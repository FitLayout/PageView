import {Model as BoxModel} from '../common/boxMappers.js';

const develMode = (window.location.port === '3000'); //development server detection
const localMode = (window.location.hostname === 'localhost'); //local mode (http allowed)
const protocol = localMode ? location.protocol : 'https:'; //force https for non-local mode
const flhost = develMode ? 'http://localhost:8080' : (protocol + '//' + window.location.host);

const SERVER_ROOT = flhost + '/api';
const REPOSITORY_ADMIN_ENDPOINT = SERVER_ROOT + '/repository';
const AUTH_ENDPOINT = SERVER_ROOT + '/auth';

// SELECT response size limit (in rows) sent to the endpoint. 
// Note that the server also has a maximal allowed limit that cannot be exceeded.
const QUERY_LIMIT = 2048; 


export class ApiClient {

	currentRepo = 'default';
	onNotAuthorized = null;

	repositoryRoot() {
		return SERVER_ROOT + '/r/' + this.currentRepo;
	}

	artifactEndpoint() {
		return SERVER_ROOT + '/r/' + this.currentRepo + '/artifact';
	}

	repositoryEndpoint() {
		return SERVER_ROOT + '/r/' + this.currentRepo + '/repository';
	}

	serviceEndpoint() {
		return SERVER_ROOT + '/r/' + this.currentRepo + '/service';
	}

	operatorEndpoint() {
		return SERVER_ROOT + '/r/' + this.currentRepo + '/operator';
	}

	tagsEndpoint() {
		return SERVER_ROOT + '/r/' + this.currentRepo + '/tags';		
	}

	queriesEndpoint() {
		return SERVER_ROOT + '/r/' + this.currentRepo + '/query';
	}

	setRepository(repo) {
		this.currentRepo = repo;
		this.touch(); // async, just for updating the last access time
	}

	async touch() {
		const url = this.repositoryEndpoint() + '/touch';
		await fetch(url, {
			method: 'GET',
			headers: this.headers()
		});
	}

	async forceInitMetadata() {
		const url = this.repositoryEndpoint() + '/forceInitRepo';
		await fetch(url, {
			method: 'GET',
			headers: this.headers()
		});
	}

    async getTypeByIRI(iri) {
		const url = this.repositoryEndpoint() + '/type/' + encodeURIComponent(iri);
		let response = await fetch(url, {
			method: 'GET',
			headers: this.headers()
		});
		this.checkAuth(response);
		const data = await response.json();
		return data.result;
	}

    async getSubjectDescription(subjectIri) {
		const url = this.repositoryEndpoint() + '/subject/' + encodeURIComponent(subjectIri);
		let response = await fetch(url, {
			method: 'GET',
			headers: this.headers()
		});
		this.checkAuth(response);
		const data = await response.json();
		return data;
	}

    async getSubjectDescriptionObj(subjectIri) {
		const url = this.repositoryEndpoint() + '/describe/' + encodeURIComponent(subjectIri);
		let response = await fetch(url, {
			method: 'GET',
			headers: this.headers()
		});
		this.checkAuth(response);
		const data = await response.json();
		return data.description;
	}

    async getSubjectReferences(subjectIri) {
		const url = this.repositoryEndpoint() + '/object/' + encodeURIComponent(subjectIri);
		let response = await fetch(url, {
			method: 'GET',
			headers: this.headers()
		});
		this.checkAuth(response);
		const data = await response.json();
		return data;
	}

    async getSubjectValue(subjectIri, propertyIri) {
		const url = this.repositoryEndpoint() + '/subject/' + encodeURIComponent(subjectIri) + '/' + encodeURIComponent(propertyIri);
		let response = await fetch(url, {
			method: 'GET',
			headers: this.headers()
		});
		this.checkAuth(response);
		const data = await response.json();
		return data;
	}

	async selectQuery(query, limit) {
		const qlimit = (limit === undefined) ? QUERY_LIMIT : limit
		const url = this.repositoryEndpoint() + '/selectQuery?limit=' + qlimit;
		let response = await fetch(url, {
			method: 'POST',
			headers: this.headers({
				'Content-Type': 'application/sparql-query'
			}),
			body: query
		});
		this.checkAuth(response);
		if (!response.ok) {
			let error = response.status;
			throw new Error(error);
		}
		const data = await response.json();
		return data;
	}

	async updateQuery(query) {
		const url = this.repositoryEndpoint() + '/updateQuery';
		let response = await fetch(url, {
			method: 'POST',
			headers: this.headers({
				'Content-Type': 'application/sparql-query'
			}),
			body: query
		});
		this.checkAuth(response);
		if (!response.ok) {
			let error = response.status;
			throw new Error(error);
		}
		return true;
	}

	async getContexts() {
		const url = this.repositoryEndpoint() + '/contexts';
		let response = await fetch(url, {
			method: 'GET',
			headers: this.headers()
		});
		this.checkAuth(response);
		if (!response.ok) {
			let error = response.status;
			throw new Error(error);
		}
		const resp = await response.json();
		let ret = [];
		for (let bind of resp.results.bindings) {
			ret.push({ iri: bind.contextID.value });
		}
		return ret;
	}

	async exportContext(contextIri, mime, thenFunction) {
		const url = this.repositoryEndpoint() + '/statements?context=' + encodeURIComponent('<' + contextIri + '>');
		let response = await fetch(url, {
			method: 'GET',
			headers: this.headers({
				'Accept': mime
			})
		})
		this.checkAuth(response);
		if (!response.ok) {
			let error = response.status;
			throw new Error(error);
		}
		response.blob().then(thenFunction);
	}

	async replaceContext(contextIri, mime, data) {
		const url = this.repositoryEndpoint() + '/statements?context=' + encodeURIComponent('<' + contextIri + '>');
		let response = await fetch(url, {
			method: 'PUT',
			headers: this.headers({
				'Content-Type': mime
			}),
			body: data
		})
		this.checkAuth(response);
		if (!response.ok) {
			let data = await response.json();
			throw new Error(data.message);
		}
	}

	async deleteContext(contextIri) {
		const url = this.repositoryEndpoint() + '/statements?context=' + encodeURIComponent('<' + contextIri + '>');
		let response = await fetch(url, {
			method: 'DELETE',
			headers: this.headers()
		})
		this.checkAuth(response);
		if (!response.ok) {
			let error = response.status;
			throw new Error(error);
		}
		const data = await response.json();
		return data.status == 'ok';
	}

	async fetchArtifact(artifactIri) {
			const url = this.artifactEndpoint() + '/item/' + encodeURIComponent(artifactIri);
			let pageModel = new BoxModel();
			let response = await fetch(url, {
				method: 'GET',
				headers: this.headers({
					'Accept': 'text/turtle'
				})
			})

			this.checkAuth(response);
			if (!response.ok) {
				let error = response.status;
				throw new Error(error);
			}

			await pageModel.parse(await response.text());
			const type = pageModel.getType(artifactIri);
			const artifact = pageModel.getObject(artifactIri, type);

			return artifact;
	}

	async fetchArtifactInfo(artifactIri) {
			const url = this.artifactEndpoint() + '/info/' + encodeURIComponent(artifactIri);
			let pageModel = new BoxModel();
			let response = await fetch(url, {
				method: 'GET',
				headers: this.headers({
					'Accept': 'text/turtle'
				})
			})

			this.checkAuth(response);
			if (!response.ok) {
				let error = response.status;
				throw new Error(error);
			}

			await pageModel.parse(await response.text());
			const type = pageModel.getType(artifactIri);
			const artifact = pageModel.getObject(artifactIri, type);

			return artifact;
	}

	async exportArtifact(artifactIri, mime, thenFunction) {
			const url = this.artifactEndpoint() + '/item/' + encodeURIComponent(artifactIri);
			let response = await fetch(url, {
				method: 'GET',
				headers: this.headers({
					'Accept': mime
				})
			})

			this.checkAuth(response);
			if (!response.ok) {
				let error = response.status;
				throw new Error(error);
			}

			response.blob().then(thenFunction);
	}

	async fetchArtifactInfoAll() {
		const url = this.artifactEndpoint();
		let pageModel = new BoxModel();
		let response = await fetch(url, {
			method: 'GET',
			headers: this.headers({
				'Accept': 'text/turtle'
			})
		})

		this.checkAuth(response);
		if (!response.ok) {
			let error = response.status;
			throw new Error(error);
		}

		await pageModel.parse(await response.text());
		return pageModel.getAllObjects();
	}

	async fetchArtifactInfoForPage(pageIri) {
		const url = this.artifactEndpoint() + '?page=' + encodeURIComponent(pageIri);
		let pageModel = new BoxModel();
		let response = await fetch(url, {
			method: 'GET',
			headers: this.headers({
				'Accept': 'text/turtle'
			})
		})

		this.checkAuth(response);
		if (!response.ok) {
			let error = response.status;
			throw new Error(error);
		}

		await pageModel.parse(await response.text());
		return pageModel.getAllObjects();
	}

	async createArtifact(serviceId, params, srcIri) {
		const url = this.artifactEndpoint() + '/create';
		const payload = {
			serviceId: serviceId,
			params: params
		};
		if (srcIri) {
			payload.parentIri = srcIri;
		}
		try {
			let response = await fetch(url, {
				method: 'POST',
				headers: this.headers({
					'Content-Type': 'application/json'
				}),
				body: JSON.stringify(payload)
			});

			this.checkAuth(response);
			if (!response.ok) {
				let data = await response.json();
				throw new Error(data.message);
			}

			const data = await response.json();
			return data.result;

		} catch (e) {
			throw new Error(e);
		}
	}

	async deleteArtifact(artifactIri) {
			const url = this.artifactEndpoint() + '/item/' + encodeURIComponent(artifactIri);
			let response = await fetch(url, {
				method: 'DELETE',
				headers: this.headers()
			})
			this.checkAuth(response);
			if (!response.ok) {
				let error = response.status;
				throw new Error(error);
			}
			const data = await response.json();
			return data.status == 'ok';
	}

	async refreshArtifact(artifactIri) {
			const url = this.artifactEndpoint() + '/refresh/' + encodeURIComponent(artifactIri);
			let response = await fetch(url, {
				method: 'GET',
				headers: this.headers()
			})
			this.checkAuth(response);
			if (!response.ok) {
				let error = response.status;
				throw new Error(error);
			}
			const data = await response.json();
			return data.status == 'ok';
	}

	//================================================================================

	async addValue(subjectIri, predicateIri, value, artifactIri) {
		const url = this.repositoryEndpoint() + '/add/';
		const payload = {
			s: subjectIri,
			p: predicateIri,
			value: value,
			artifact: artifactIri
		};
		try {
			let response = await fetch(url, {
				method: 'POST',
				headers: this.headers({
					'Content-Type': 'application/json'
				}),
				body: JSON.stringify(payload)
			});

			this.checkAuth(response);
			if (!response.ok) {
				let data = await response.json();
				throw new Error(data.message);
			}

		} catch (e) {
			throw new Error(e);
		}
	}

	async deleteValue(subjectIri, predicateIri, artifactIri) {
		const url = this.repositoryEndpoint()
			+ '/statements?context=' + encodeURIComponent('<' + artifactIri + '>')
			+ '&subj=' + encodeURIComponent('<' + subjectIri + '>')
			+ '&pred=' + encodeURIComponent('<' + predicateIri + '>');
		let response = await fetch(url, {
			method: 'DELETE',
			headers: this.headers()
		})
		this.checkAuth(response);
		if (!response.ok) {
			let error = response.status;
			throw new Error(error);
		}
		const data = await response.json();
		return data.status == 'ok';
	}

	async addTag(subjectIri, tagIri, artifactIri) {
		const url = this.repositoryEndpoint() + '/add/';
		const payload = {
			s: subjectIri,
			p: 'http://fitlayout.github.io/ontology/segmentation.owl#hasTag',
			o: tagIri,
			artifact: artifactIri
		};
		try {
			let response = await fetch(url, {
				method: 'POST',
				headers: this.headers({
					'Content-Type': 'application/json'
				}),
				body: JSON.stringify(payload)
			});

			this.checkAuth(response);
			if (!response.ok) {
				let data = await response.json();
				throw new Error(data.message);
			}

		} catch (e) {
			throw new Error(e);
		}
	}

	async deleteTag(subjectIri, tagIri, artifactIri) {
		const predicateIri = 'http://fitlayout.github.io/ontology/segmentation.owl#hasTag';
		const url = this.repositoryEndpoint()
			+ '/statements?context=' + encodeURIComponent('<' + artifactIri + '>')
			+ '&subj=' + encodeURIComponent('<' + subjectIri + '>')
			+ '&pred=' + encodeURIComponent('<' + predicateIri + '>')
			+ '&obj=' + encodeURIComponent('<' + tagIri + '>');
		let response = await fetch(url, {
			method: 'DELETE',
			headers: this.headers()
		})
		this.checkAuth(response);
		if (!response.ok) {
			let error = response.status;
			throw new Error(error);
		}
		const data = await response.json();
		return data.status == 'ok';
	}

	//================================================================================

	async getStorageStatus() {
		const url = REPOSITORY_ADMIN_ENDPOINT + '/status';
		try {
			let response = await fetch(url, {
				method: 'GET',
				headers: this.headers()
			});

			this.checkAuth(response);
			if (!response.ok) {
				let data = await response.json();
				throw new Error(data.message);
			}

			const data = await response.json();
			return data;
		} catch (e) {
			throw new Error(e);
		}		
	}

	async listRepositories() {
		const url = REPOSITORY_ADMIN_ENDPOINT;
		try {
			let response = await fetch(url, {
				method: 'GET',
				headers: this.headers()
			});

			this.checkAuth(response);
			if (!response.ok) {
				let data = await response.json();
				throw new Error(data.message);
			}

			const data = await response.json();
			return data;
		} catch (e) {
			throw new Error(e);
		}		
	}

	async listAllRepositories() {
		const url = REPOSITORY_ADMIN_ENDPOINT + '/all';
		try {
			let response = await fetch(url, {
				method: 'GET',
				headers: this.headers()
			});

			this.checkAuth(response);
			if (!response.ok) {
				let data = await response.json();
				throw new Error(data.message);
			}

			const data = await response.json();
			return data;
		} catch (e) {
			throw new Error(e);
		}		
	}

	async getRepositoryInfo(id) {
		const url = REPOSITORY_ADMIN_ENDPOINT + '/' + encodeURIComponent(id);
		try {
			let response = await fetch(url, {
				method: 'GET',
				headers: this.headers()
			});

			this.checkAuth(response);
			if (!response.ok) {
				let data = await response.json();
				throw new Error(data.message);
			}

			const data = await response.json();
			return data;
		} catch (e) {
			throw new Error(e);
		}		
	}

	/**
	 * 
	 * @param {*} ids a collection of IDs
	 * @param {*} onError a function that is called when some id cannot be fetched
	 */
	async getRepositoryInfos(ids, onError) {
		let ret = [];
		for (const id of ids) {
			try {
				const info = await this.getRepositoryInfo(id);
				ret.push(info);
			} catch (e) {
				//console.error(e);
				if (typeof onError === 'function') {
					onError(id, e);
				}
			}
		}
		return ret;
	}

	async createRepository(data) {
		const url = REPOSITORY_ADMIN_ENDPOINT;
		try {
			let response = await fetch(url, {
				method: 'POST',
				headers: this.headers({
					'Content-Type': 'application/json'
				}),
				body: JSON.stringify(data)
			});

			this.checkAuth(response);
			const rdata = await response.json();
			if (!response.ok) {
				throw new Error(rdata.message);
			}

			return rdata;

		} catch (e) {
			throw new Error(e);
		}
	}

	async updateRepositoryInfo(id, data) {
		const url = REPOSITORY_ADMIN_ENDPOINT + '/' + encodeURIComponent(id);
		try {
			let response = await fetch(url, {
				method: 'PUT',
				headers: this.headers({
					'Content-Type': 'application/json'
				}),
				body: JSON.stringify(data)
			});

			this.checkAuth(response);
			const rdata = await response.json();
			if (!response.ok) {
				throw new Error(rdata.message);
			}

			return rdata;

		} catch (e) {
			throw new Error(e);
		}
	}

	async sendReminder(email) {
		const url = REPOSITORY_ADMIN_ENDPOINT + '/remind/' + encodeURIComponent(email);
		try {
			let response = await fetch(url, {
				method: 'GET',
				headers: this.headers({
					'Content-Type': 'application/json'
				})
			});

			const rdata = await response.json();
			if (!response.ok) {
				throw new Error(rdata.message);
			}

			return rdata.result;
		} catch (e) {
			throw new Error(e);
		}
	}

	//================================================================================

	/**
	 * Sorts elements in the list based on their documentOrder property.
	 * @param {*} list 
	 */
	sortBoxes(list) {
		list.sort((a, b) => {
			if (a.documentOrder < b.documentOrder) {
				return -1;
			} else if (a.documentOrder > b.documentOrder) {
				return 1;
			} else {
				return 0;
			}
		});
	}

	//================================================================================

	async fetchArtifactServices() {
		const url = this.serviceEndpoint();
		let response = await fetch(url, {
			method: 'GET',
			headers: this.headers()
		});
		this.checkAuth(response);
		const data = await response.json();
		return data;
	}

	async getServiceParams(serviceId) {
		const url = this.serviceEndpoint() + '/config?' + new URLSearchParams({'id': serviceId});
		let response = await fetch(url, {
			method: 'GET',
			headers: this.headers()
		});
		this.checkAuth(response);
		const data = await response.json();
		return data.params;
	}

	//================================================================================

	hasToken() {
		return (localStorage.getItem('jwt') !== null);
	}

	logout() {
		localStorage.removeItem('jwt');
	}

	checkAuth(response) {
		if (response.status == 401 || response.status == 403) {
			if (this.onNotAuthorized) {
				this.onNotAuthorized();
			}
			return false;
		} else {
			return true;
		}
	}

	headers(headers) {
		const src = headers ? headers : {};
		const token = localStorage.getItem('jwt');
		if (token) {
			return {
				...src,
				'Authorization': ('Bearer ' + token)
			};
		} else {
			return src;
		}
	}

	async getUserInfo() {
		const url = AUTH_ENDPOINT + '/userInfo';
		let response = await fetch(url, {
			method: 'GET',
			headers: this.headers()
		});
		this.checkAuth(response);
		const data = await response.json();
		return data;
	}

	async getTags() {
		const url = this.tagsEndpoint();
		try {
			let response = await fetch(url, {
				method: 'GET',
				headers: this.headers()
			});

			this.checkAuth(response);
			if (!response.ok) {
				let data = await response.json();
				throw new Error(data.message);
			}

			const data = await response.json();
			return data;
		} catch (e) {
			throw new Error(e);
		}		
	}

	async getSavedQueries() {
		const url = this.queriesEndpoint();
		try {
			let response = await fetch(url, {
				method: 'GET',
				headers: this.headers()
			});

			this.checkAuth(response);
			if (!response.ok) {
				let data = await response.json();
				throw new Error(data.message);
			}

			const data = await response.json();
			return data;
		} catch (e) {
			throw new Error(e);
		}		
	}

	async saveQuery(data) {
		const url = this.queriesEndpoint();
		try {
			let response = await fetch(url, {
				method: 'POST',
				headers: this.headers({
					'Content-Type': 'application/json'
				}),
				body: JSON.stringify(data)
			});

			this.checkAuth(response);
			const rdata = await response.json();
			if (!response.ok) {
				throw new Error(rdata.message);
			}

			return rdata;

		} catch (e) {
			throw new Error(e);
		}
	}

	async deleteQuery(queryId) {
		const url = this.queriesEndpoint() + '/' + queryId;
		let response = await fetch(url, {
			method: 'DELETE',
			headers: this.headers()
		})
		this.checkAuth(response);
		if (!response.ok) {
			let error = response.status;
			throw new Error(error);
		}
		const data = await response.json();
		return data.status == 'ok';
	}

}