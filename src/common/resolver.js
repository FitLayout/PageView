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
	 * @param {*} iri 
	 */
	async resolveObjectIRI(iri) {
		const type = await this.client.getTypeByIRI(iri);
		console.log('TYPE ' + type);
		if (type === BOX.Page) {
			const page = await this.client.fetchArtifact(iri);
			this.client.sortBoxes(page.rectAreas);
			return {
				type: 'page',
				rectangleType: 'box',
				artifact: page,
				page: page,
				rectangles: page.rectAreas
			}
		} else if (type === SEGM.AreaTree) {
			const atree = await this.client.fetchArtifact(iri);
			const page = await this.client.fetchArtifact(atree.hasSourcePage);
			this.client.sortBoxes(page.rectAreas);
			return {
				type: 'areaTree',
				rectangleType: 'area',
				artifact: atree,
				page: page,
				rectangles: atree.areas
			}
		} else if (type === BOX.Box) {
			const pageIri = await this.client.getSubjectValue(iri, BOX.belongsTo);
			const page = await this.client.fetchArtifact(pageIri.value);
			this.client.sortBoxes(page.rectAreas);
			return {
				type: 'box',
				rectangleType: 'box',
				artifact: page,
				page: page,
				rectangles: page.rectAreas
			}
		} else if (type === SEGM.Area) {
			const atreeIri = await this.client.getSubjectValue(iri, SEGM.belongsTo);
			const atree = await this.client.fetchArtifact(atreeIri.value);
			const page = await this.client.fetchArtifact(atree.hasSourcePage);
			this.client.sortBoxes(page.rectAreas);
			return {
				type: 'area',
				rectangleType: 'area',
				artifact: atree,
				page: page,
				rectangles: atree.areas
			}
		} else {
			return { type: 'unknown' };
		}
	}

}