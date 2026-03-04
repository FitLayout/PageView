import {Model as BoxModel} from '../common/boxMappers';
import IriDecoder from '@/rdf4j-vue-components/src/common/iridecoder';
import type { ApiClient } from '@/rdf4j-vue-components/src/common/apiclient';
import type { AskQueryResult, ContextDescription, RdfValueBinding, RdfValueSpec, RepositoryInfo, SavedQuery, SelectQueryResult, UpdateQueryResult } from '@/rdf4j-vue-components/src/common/types';
import type RDFModel from './rdfmodel';
import type { RdfObject } from './types';

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

export interface StorageStatus {
	createAvailable: boolean,
	repositories: number,
	available : number,
	singleMode: true
}

export interface UserInfo {
	expires: string,
	roles: string[],
	anonymous: boolean,
	guest: boolean,
	userId: string,
	email: string
}

export interface FLRepositoryInfo extends RepositoryInfo {
	owner: string,
	expires: string,
	accessedOn: string,
	description: string,
	readOnly: boolean,
	version: string,
	createdOn: string,
	email: string
}

export interface ResultValue {
	status: string | null,
	result: object | null,
}

export interface TagInfo {
	iri: string,
	name: string,
	context: string,
	type: string,
	tagger?: string,
	service?: string
}

export class FLApiClient implements ApiClient {

	currentRepo: string = 'default';
	onNotAuthorized: (() => void) | null = null;

	// Properties required by RdfApiClient interface
	serverUrl: string = SERVER_ROOT;
	serverLogin: string | null = null;

	private cachedIriDecoder: IriDecoder | null = null;

	repositoryRoot(): string {
		return SERVER_ROOT + '/r/' + this.currentRepo;
	}

	artifactEndpoint(): string {
		return SERVER_ROOT + '/r/' + this.currentRepo + '/artifact';
	}

	repositoryEndpoint(): string {
		return SERVER_ROOT + '/r/' + this.currentRepo + '/repository';
	}

	serviceEndpoint(): string {
		return SERVER_ROOT + '/r/' + this.currentRepo + '/service';
	}

	operatorEndpoint(): string {
		return SERVER_ROOT + '/r/' + this.currentRepo + '/operator';
	}

	tagsEndpoint(): string {
		return SERVER_ROOT + '/r/' + this.currentRepo + '/tags';
	}

	queriesEndpoint(): string {
		return SERVER_ROOT + '/r/' + this.currentRepo + '/query';
	}

	setServerUrl(url: string): void {
		this.serverUrl = url;
	}

	async login(username: string, password: string): Promise<void> {
		this.serverLogin = username;
		// JWT-based auth is used; login is handled separately via getUserInfo()
	}

	async setRepository(repo: string): Promise<void> {
		this.currentRepo = repo;
		this.cachedIriDecoder = null;
		this.touch(); // async, just for updating the last access time
	}

	async touch(): Promise<void> {
		const url = this.repositoryEndpoint() + '/touch';
		await fetch(url, {
			method: 'GET',
			headers: this.headers()
		});
	}

	async forceInitMetadata(): Promise<void> {
		const url = this.repositoryEndpoint() + '/forceInitRepo';
		await fetch(url, {
			method: 'GET',
			headers: this.headers()
		});
	}

    async getTypeByIRI(iri: string): Promise<string> {
		const url = this.repositoryEndpoint() + '/type/' + encodeURIComponent(iri);
		let response = await fetch(url, {
			method: 'GET',
			headers: this.headers()
		});
		this.checkAuth(response);
		const data = await response.json();
		return data.result;
	}

    async getSubjectDescription(subjectIri: string): Promise<SelectQueryResult> {
		const url = this.repositoryEndpoint() + '/subject/' + encodeURIComponent(subjectIri);
		let response = await fetch(url, {
			method: 'GET',
			headers: this.headers()
		});
		this.checkAuth(response);
		const data = await response.json();
		return data;
	}

    async getSubjectDescriptionObj(subjectIri: string): Promise<any> {
		const url = this.repositoryEndpoint() + '/describe/' + encodeURIComponent(subjectIri);
		let response = await fetch(url, {
			method: 'GET',
			headers: this.headers()
		});
		this.checkAuth(response);
		const data = await response.json();
		return data.description;
	}

    async getSubjectReferences(subjectIri: string): Promise<SelectQueryResult> {
		const url = this.repositoryEndpoint() + '/object/' + encodeURIComponent(subjectIri);
		let response = await fetch(url, {
			method: 'GET',
			headers: this.headers()
		});
		this.checkAuth(response);
		const data = await response.json();
		return data;
	}

	async getSubjectMentions(subjectIri: string): Promise<SelectQueryResult> {
		return this.getSubjectReferences(subjectIri);
	}

    async getSubjectValue(subjectIri: string, propertyIri: string): Promise<RdfValueSpec> {
		const url = this.repositoryEndpoint() + '/subject/' + encodeURIComponent(subjectIri) + '/' + encodeURIComponent(propertyIri);
		let response = await fetch(url, {
			method: 'GET',
			headers: this.headers()
		});
		this.checkAuth(response);
		const data = await response.json();
		return data;
	}

	async selectQuery(query: string, limit?: number): Promise<SelectQueryResult> {
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
			throw new Error(String(error));
		}
		const data = await response.json();
		return data;
	}

	async askQuery(query: string, limit?: number): Promise<AskQueryResult> {
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
			throw new Error(String(error));
		}
		const data = await response.json();
		return data;
	}

	async constructQuery(query: string, accept: string, limit?: number): Promise<string> {
		const qlimit = (limit === undefined) ? QUERY_LIMIT : limit
		const url = this.repositoryEndpoint() + '/selectQuery?limit=' + qlimit;
		let response = await fetch(url, {
			method: 'POST',
			headers: this.headers({
				'Content-Type': 'application/sparql-query',
				'Accept': accept
			}),
			body: query
		});
		this.checkAuth(response);
		if (!response.ok) {
			let error = response.status;
			throw new Error(String(error));
		}
		return await response.text();
	}

	async updateQuery(query: string): Promise<UpdateQueryResult> {
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
			throw new Error(String(error));
		}
		return { success: true };
	}

	async getContexts(): Promise<ContextDescription[]> {
		const url = this.repositoryEndpoint() + '/contexts';
		let response = await fetch(url, {
			method: 'GET',
			headers: this.headers()
		});
		this.checkAuth(response);
		if (!response.ok) {
			let error = response.status;
			throw new Error(String(error));
		}
		const resp = await response.json();
		let ret: ContextDescription[] = [];
		for (let bind of resp.results.bindings) {
			ret.push({ iri: bind.contextID.value });
		}
		return ret;
	}

	async exportContext(contextIri: string, mime: string, thenFunction: (blob: Blob) => void): Promise<void> {
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
			throw new Error(String(error));
		}
		response.blob().then(thenFunction);
	}

	async replaceContext(contextIri: string, mime: string, data: string): Promise<void> {
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
			let rdata = await response.json();
			throw new Error(rdata.message);
		}
	}

	async deleteContext(contextIri: string): Promise<boolean> {
		const url = this.repositoryEndpoint() + '/statements?context=' + encodeURIComponent('<' + contextIri + '>');
		let response = await fetch(url, {
			method: 'DELETE',
			headers: this.headers()
		})
		this.checkAuth(response);
		if (!response.ok) {
			let error = response.status;
			throw new Error(String(error));
		}
		const data = await response.json();
		return data.status == 'ok';
	}

	async fetchArtifact(artifactIri: string): Promise<RdfObject | undefined> {
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
			throw new Error(String(error));
		}

		await pageModel.parse(await response.text());
		const type = pageModel.getType(artifactIri);
		const artifact = pageModel.getObject(artifactIri, type!);

		return artifact;
	}

	async fetchArtifactInfo(artifactIri: string): Promise<RdfObject | undefined> {
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
			throw new Error(String(error));
		}

		await pageModel.parse(await response.text());
		const type = pageModel.getType(artifactIri);
		const artifact = pageModel.getObject(artifactIri, type!);

		return artifact;
	}

	async exportArtifact(artifactIri: string, mime: string, thenFunction: (blob: Blob) => void): Promise<void> {
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
			throw new Error(String(error));
		}

		response.blob().then(thenFunction);
	}

	async fetchArtifactInfoAll(): Promise<RdfObject[]> {
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
			throw new Error(String(error));
		}

		await pageModel.parse(await response.text());
		return pageModel.getAllObjects();
	}

	async fetchArtifactInfoForPage(pageIri: string): Promise<RdfObject[]> {
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
			throw new Error(String(error));
		}

		await pageModel.parse(await response.text());
		return pageModel.getAllObjects();
	}

	async createArtifact(serviceId: string, params: object, srcIri: string | null): Promise<string> {
		const url = this.artifactEndpoint() + '/create';
		const payload: any = {
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

		} catch (e: any) {
			throw new Error(e);
		}
	}

	async deleteArtifact(artifactIri: string): Promise<boolean> {
		const url = this.artifactEndpoint() + '/item/' + encodeURIComponent(artifactIri);
		let response = await fetch(url, {
			method: 'DELETE',
			headers: this.headers()
		})
		this.checkAuth(response);
		if (!response.ok) {
			let error = response.status;
			throw new Error(String(error));
		}
		const data = await response.json();
		return data.status == 'ok';
	}

	async refreshArtifact(artifactIri: string): Promise<boolean> {
		const url = this.artifactEndpoint() + '/refresh/' + encodeURIComponent(artifactIri);
		let response = await fetch(url, {
			method: 'GET',
			headers: this.headers()
		})
		this.checkAuth(response);
		if (!response.ok) {
			let error = response.status;
			throw new Error(String(error));
		}
		const data = await response.json();
		return data.status == 'ok';
	}

	//================================================================================

	async addValue(subjectIri: string, predicateIri: string, value: any, artifactIri: string): Promise<void> {
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

		} catch (e: any) {
			throw new Error(e);
		}
	}

	async deleteValue(subjectIri: string, predicateIri: string, artifactIri: string): Promise<boolean> {
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
			throw new Error(String(error));
		}
		const data = await response.json();
		return data.status == 'ok';
	}

	async addTag(subjectIri: string, tagIri: string, artifactIri: string): Promise<void> {
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

		} catch (e: any) {
			throw new Error(e);
		}
	}

	async deleteTag(subjectIri: string, tagIri: string, artifactIri: string): Promise<boolean> {
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
			throw new Error(String(error));
		}
		const data = await response.json();
		return data.status == 'ok';
	}

	//================================================================================

	async getStorageStatus(): Promise<StorageStatus> {
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
			return data as StorageStatus;
		} catch (e: any) {
			throw new Error(e);
		}
	}

	async listRepositories(): Promise<FLRepositoryInfo[]> {
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
			return data as FLRepositoryInfo[];
		} catch (e: any) {
			throw new Error(e);
		}
	}

	async listAllRepositories(): Promise<FLRepositoryInfo[]> {
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
			return data as FLRepositoryInfo[];
		} catch (e: any) {
			throw new Error(e);
		}
	}

	async getRepositoryInfo(id: string): Promise<FLRepositoryInfo> {
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
			return data as FLRepositoryInfo;
		} catch (e: any) {
			throw new Error(e);
		}
	}

	async getRepositoryInfos(ids: string[], onError?: (id: string, e: any) => void): Promise<FLRepositoryInfo[]> {
		let ret: FLRepositoryInfo[] = [];
		for (const id of ids) {
			try {
				const info = await this.getRepositoryInfo(id);
				ret.push(info);
			} catch (e) {
				if (typeof onError === 'function') {
					onError(id, e);
				}
			}
		}
		return ret;
	}

	async createRepository(data: object): Promise<FLRepositoryInfo> {
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

			return rdata as FLRepositoryInfo;

		} catch (e: any) {
			throw new Error(e);
		}
	}

	async updateRepositoryInfo(id: string, data: object): Promise<FLRepositoryInfo> {
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

			return rdata as FLRepositoryInfo;

		} catch (e: any) {
			throw new Error(e);
		}
	}

	async sendReminder(email: string): Promise<any> {
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
		} catch (e: any) {
			throw new Error(e);
		}
	}

	//================================================================================

	/**
	 * Sorts elements in the list based on their documentOrder property.
	 */
	sortBoxes(list: any[]): void {
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

	async fetchArtifactServices(): Promise<any> {
		const url = this.serviceEndpoint();
		let response = await fetch(url, {
			method: 'GET',
			headers: this.headers()
		});
		this.checkAuth(response);
		const data = await response.json();
		return data;
	}

	async getServiceParams(serviceId: string): Promise<any> {
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

	hasToken(): boolean {
		return (localStorage.getItem('jwt') !== null);
	}

	logout(): void {
		localStorage.removeItem('jwt');
	}

	checkAuth(response: Response): boolean {
		if (response.status == 401 || response.status == 403) {
			if (this.onNotAuthorized) {
				this.onNotAuthorized();
			}
			return false;
		} else {
			return true;
		}
	}

	headers(headers?: { [key: string]: string }): { [key: string]: string } {
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

	async getUserInfo(): Promise<UserInfo> {
		const url = AUTH_ENDPOINT + '/userInfo';
		let response = await fetch(url, {
			method: 'GET',
			headers: this.headers()
		});
		this.checkAuth(response);
		const data = await response.json();
		return data as UserInfo;
	}

	//================================================================================

	async getIriDecoder(): Promise<IriDecoder> {
		if (!this.cachedIriDecoder) {
			const fitlayoutNamespaces: { [key: string]: string } = {
				b: 'http://fitlayout.github.io/ontology/render.owl#',
				a: 'http://fitlayout.github.io/ontology/segmentation.owl#',
				fl: 'http://fitlayout.github.io/ontology/fitlayout.owl#',
				r: 'http://fitlayout.github.io/resource/'
			};
			this.cachedIriDecoder = new IriDecoder(fitlayoutNamespaces);
		}
		return this.cachedIriDecoder;
	}

	//================================================================================

	async getTags(): Promise<TagInfo[]> {
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
			return data as TagInfo[];
		} catch (e: any) {
			throw new Error(e);
		}
	}

	async getSavedQueries(): Promise<SavedQuery[]> {
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
		} catch (e: any) {
			throw new Error(e);
		}
	}

	async saveQuery(data: SavedQuery): Promise<void> {
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

		} catch (e: any) {
			throw new Error(e);
		}
	}

	async deleteQuery(queryId: number): Promise<void> {
		const url = this.queriesEndpoint() + '/' + queryId;
		let response = await fetch(url, {
			method: 'DELETE',
			headers: this.headers()
		})
		this.checkAuth(response);
		if (!response.ok) {
			let error = response.status;
			throw new Error(String(error));
		}
	}

	async getNamespaces(): Promise<SelectQueryResult> {
		const url = this.repositoryEndpoint() + '/namespaces';
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
		} catch (e: any) {
			throw new Error(e);
		}
	}

	toObject(binding: RdfValueBinding): object {
		const obj: { [k: string]: any } = {};
		for (let prop in binding) {
			let bind = binding[prop];
			let val;
			if (bind.datatype && bind.datatype === 'http://www.w3.org/2001/XMLSchema#boolean') {
				val = (bind.value === 'true');
			} else if (bind.datatype && bind.datatype === 'http://www.w3.org/2001/XMLSchema#integer') {
				val = parseInt(bind.value);
			} else if (bind.datatype && bind.datatype === 'http://www.w3.org/2001/XMLSchema#decimal') {
				val = parseFloat(bind.value);
			} else {
				val = bind.value;
			}
			obj[prop] = val;
		}
		return obj;
	}

	toObjectArray(bindings: RdfValueBinding[]): object[] {
		return bindings.map(binding => this.toObject(binding));
	}

}
