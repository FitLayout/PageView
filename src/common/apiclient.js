import {Model as BoxModel} from '../common/boxMappers.js';


const ARTIFACT_ENDPOINT = 'http://localhost:8080/fitlayout-web/service/artifact/item/';

export class ApiClient {

	async fetchArtifact(artifactIri) {
			const url = ARTIFACT_ENDPOINT + encodeURIComponent(artifactIri);
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

}