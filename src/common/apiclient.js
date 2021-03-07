import {Model as BoxModel} from '../common/boxMappers.js';

const ARTIFACT_ENDPOINT = 'http://localhost:8080/fitlayout-web/service/artifact';
const SERVICE_ENDPOINT = 'http://localhost:8080/fitlayout-web/service/service';

export class ApiClient {

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