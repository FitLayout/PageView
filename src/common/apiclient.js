import {Model as BoxModel} from '../common/boxMappers.js';

const SERVER_ROOT = 'http://localhost:8080/fitlayout-web/api';
const ARTIFACT_ENDPOINT = SERVER_ROOT + '/r/default/artifact';
const SERVICE_ENDPOINT = SERVER_ROOT + '/service';
const REPOSITORY_ENDPOINT = SERVER_ROOT + '/r/default/repository';
const REPOSITORY_ADMIN_ENDPOINT = SERVER_ROOT + '/repository';

export class ApiClient {

    async getTypeByIRI(iri) {
		const url = REPOSITORY_ENDPOINT + '/type/' + encodeURIComponent(iri);
		let response = await fetch(url, {
			method: 'GET',
		});
		const data = await response.json();
		return data.result;
	}

    async getSubjectDescription(subjectIri) {
		const url = REPOSITORY_ENDPOINT + '/subject/' + encodeURIComponent(subjectIri);
		let response = await fetch(url, {
			method: 'GET',
		});
		const data = await response.json();
		return data.result;
	}

    async getSubjectDescriptionObj(subjectIri) {
		const url = REPOSITORY_ENDPOINT + '/describe/' + encodeURIComponent(subjectIri);
		let response = await fetch(url, {
			method: 'GET',
		});
		const data = await response.json();
		return data.result.description;
	}

    async getSubjectReferences(subjectIri) {
		const url = REPOSITORY_ENDPOINT + '/object/' + encodeURIComponent(subjectIri);
		let response = await fetch(url, {
			method: 'GET',
		});
		const data = await response.json();
		return data.result;
	}

    async getSubjectValue(subjectIri, propertyIri) {
		const url = REPOSITORY_ENDPOINT + '/subject/' + encodeURIComponent(subjectIri) + '/' + encodeURIComponent(propertyIri);
		let response = await fetch(url, {
			method: 'GET',
		});
		const data = await response.json();
		return data.result;
	}

	async fetchArtifact(artifactIri) {
			const url = ARTIFACT_ENDPOINT + '/item/' + encodeURIComponent(artifactIri);
			let pageModel = new BoxModel();
			let response = await fetch(url, {
				method: 'GET',
				headers: {
					'Accept': 'text/turtle'
				}
			})

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
			const url = ARTIFACT_ENDPOINT + '/info/' + encodeURIComponent(artifactIri);
			let pageModel = new BoxModel();
			let response = await fetch(url, {
				method: 'GET',
				headers: {
					'Accept': 'text/turtle'
				}
			})

			if (!response.ok) {
				let error = response.status;
				throw new Error(error);
			}

			await pageModel.parse(await response.text());
			const type = pageModel.getType(artifactIri);
			const artifact = pageModel.getObject(artifactIri, type);

			return artifact;
	}

	async fetchArtifactInfoAll() {
		const url = ARTIFACT_ENDPOINT;
		let pageModel = new BoxModel();
		let response = await fetch(url, {
			method: 'GET',
			headers: {
				'Accept': 'text/turtle'
			}
		})

		if (!response.ok) {
			let error = response.status;
			throw new Error(error);
		}

		await pageModel.parse(await response.text());
		return pageModel.getAllObjects();
	}

	async createArtifact(serviceId, params, srcIri) {
		const url = ARTIFACT_ENDPOINT + '/create';
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
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(payload)
			});

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
			const url = ARTIFACT_ENDPOINT + '/item/' + encodeURIComponent(artifactIri);
			let response = await fetch(url, {
				method: 'DELETE'
			})
			if (!response.ok) {
				let error = response.status;
				throw new Error(error);
			}
			const data = await response.json();
			return data.status == 'ok';
	}

	//================================================================================

	async addValue(subjectIri, predicateIri, value, artifactIri) {
		const url = REPOSITORY_ENDPOINT + '/add/';
		const payload = {
			s: subjectIri,
			p: predicateIri,
			value: value,
			artifact: artifactIri
		};
		try {
			let response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(payload)
			});

			if (!response.ok) {
				let data = await response.json();
				throw new Error(data.message);
			}

		} catch (e) {
			throw new Error(e);
		}
	}

	async addTag(subjectIri, tagName, artifactIri) {
		const url = REPOSITORY_ENDPOINT + '/add/';
		const payload = {
			s: subjectIri,
			p: 'http://fitlayout.github.io/ontology/segmentation.owl#hasTag',
			o: 'http://fitlayout.github.io/resource/tag-gui--' + tagName,
			artifact: artifactIri
		};
		try {
			let response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(payload)
			});

			if (!response.ok) {
				let data = await response.json();
				throw new Error(data.message);
			}

		} catch (e) {
			throw new Error(e);
		}
	}

	//================================================================================

	async getStorageStatus() {
		const url = REPOSITORY_ADMIN_ENDPOINT + '/status';
		try {
			let response = await fetch(url, {
				method: 'GET'
			});

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

	async listRepositories() {
		const url = REPOSITORY_ADMIN_ENDPOINT;
		try {
			let response = await fetch(url, {
				method: 'GET'
			});

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
		const url = SERVICE_ENDPOINT;
		let response = await fetch(url, {
			method: 'GET'
		});
		const data = await response.json();
		return data.result;
	}

	async getServiceParams(serviceId) {
		const url = SERVICE_ENDPOINT + '/config?' + new URLSearchParams({'id': serviceId});
		let response = await fetch(url, {
			method: 'GET',
		});
		const data = await response.json();
		return data.result.params;
	}

}