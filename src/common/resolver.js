import BOX from '@/ontology/BOX.js';
import SEGM from '@/ontology/SEGM.js';


/**
 * Resolves the object IRI types and fetches the corresponging pages
 * and other atrifacts.
 */
export default class ObjectResolver {

	client = null;

	constructor(apiClient) {
		this.client = apiClient;
	}
	
	/**
	 * Identifies the type of object identified by the given iri and
	 * loads the remaining artifacts necessary for displaying the object.
	 * If some of the artifacts are already present in current status,
	 * they are not loaded again.
	 * @param {*} iri 
	 */
	async resolveObjectIRI(iri, currentStatus) {
		const type = await this.client.getTypeByIRI(iri);
		console.log('TYPE ' + type);
		if (type === BOX.Page) {
			const page = this.getPage(iri, currentStatus);
			return {
				type: 'page',
				rectangleType: 'box',
				artifactIri: iri,
				artifact: page,
				pageIri: iri,
				page: page,
				rectangles: page.rectAreas
			}
		} else if (type === SEGM.AreaTree) {
			const atree = await this.getAreaTree(iri, currentStatus);
			const page = await this.getPage(atree.hasSourcePage, currentStatus);
			this.client.sortBoxes(page.rectAreas);
			return {
				type: 'areaTree',
				rectangleType: 'area',
				artifactIri: iri,
				artifact: atree,
				pageIri: page._iri,
				page: page,
				rectangles: atree.areas
			}
		} else if (type === BOX.Box) {
			const pageIri = await this.client.getSubjectValue(iri, BOX.belongsTo);
			const page = await this.getPage(pageIri.value, currentStatus);
			this.client.sortBoxes(page.rectAreas);
			return {
				type: 'box',
				rectangleType: 'box',
				artifactIri: pageIri,
				artifact: page,
				pageIri: pageIri,
				page: page,
				rectangles: page.rectAreas
			}
		} else if (type === SEGM.Area) {
			const atreeIri = await this.client.getSubjectValue(iri, SEGM.belongsTo);
			const atree = await this.getAreaTree(atreeIri.value, currentStatus);
			const page = await this.getPage(atree.hasSourcePage, currentStatus);
			this.client.sortBoxes(page.rectAreas);
			return {
				type: 'area',
				rectangleType: 'area',
				artifactIri: atree._iri,
				artifact: atree,
				pageIri: page._iri,
				page: page,
				rectangles: atree.areas
			}
		} else {
			return { type: 'unknown' };
		}
	}

	async getPage(iri, currentStatus) {
		if (currentStatus.pageIri === iri) {
			return currentStatus.page;
		} else {
			const page = await this.client.fetchArtifact(iri);
			this.client.sortBoxes(page.rectAreas);
			return page;
		}
	}

	async getAreaTree(iri, currentStatus) {
		if (currentStatus.artifactIri === iri) {
			return currentStatus.artifact;
		} else {
			return await this.client.fetchArtifact(iri);
		}
	}

}