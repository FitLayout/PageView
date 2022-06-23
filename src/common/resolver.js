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
		// get the general description
		const descrData = await this.client.getSubjectDescription(iri);
		const descr = descrData.results.bindings;
		// get the dependent objects based on the type
		console.log('TYPE ' + type);
		let ret = {}; 
		if (type === BOX.Page) {
			const page = await this.getPage(iri, currentStatus);
			ret = {
				type: 'page',
				description: descr,
				rectangleType: 'box',
				artifactIri: iri,
				artifact: page,
				pageIri: iri,
				page: page,
				rectangles: page.boxes
			}
		} else if (type === SEGM.AreaTree) {
			const atree = await this.getAreaTree(iri, currentStatus);
			const page = await this.getPage(atree.hasSourcePage._iri, currentStatus);
			ret = {
				type: 'areaTree',
				description: descr,
				rectangleType: 'area',
				artifactIri: iri,
				artifact: atree,
				pageIri: page._iri,
				page: page,
				rectangles: atree.areas
			}
		} else if (type === SEGM.ChunkSet) {
			const cset = await this.getArtifact(iri, currentStatus);
			const atreeIri = await this.client.getSubjectValue(iri, SEGM.hasAreaTree);
			const pageIri = await this.client.getSubjectValue(atreeIri.value, SEGM.hasSourcePage);
			const page = await this.getPage(pageIri.value, currentStatus);
			ret = {
				type: 'chunkSet',
				description: descr,
				rectangleType: 'textChunk',
				artifactIri: iri,
				artifact: cset,
				pageIri: page._iri,
				page: page,
				rectangles: cset.textChunks
			}
		} else if (type === BOX.Box) {
			const pageIri = await this.client.getSubjectValue(iri, BOX.belongsTo);
			const page = await this.getPage(pageIri.value, currentStatus);
			ret = {
				type: 'box',
				description: descr,
				rectangleType: 'box',
				artifactIri: page._iri,
				artifact: page,
				pageIri: page._iri,
				page: page,
				rectangles: page.boxes
			}
		} else if (type === SEGM.Area) {
			const atreeIri = await this.client.getSubjectValue(iri, SEGM.belongsTo);
			const atree = await this.getAreaTree(atreeIri.value, currentStatus);
			const page = await this.getPage(atree.hasSourcePage._iri, currentStatus);
			ret = {
				type: 'area',
				description: descr,
				rectangleType: 'area',
				artifactIri: atree._iri,
				artifact: atree,
				pageIri: page._iri,
				page: page,
				rectangles: atree.areas
			}
		} else if (type === SEGM.TextChunk) {
			const chunkSetIri = await this.client.getSubjectValue(iri, SEGM.belongsToChunkSet);
			const chunkSet = await this.getArtifact(chunkSetIri.value, currentStatus);
			const atreeIri = await this.client.getSubjectValue(chunkSetIri.value, SEGM.hasAreaTree);
			const pageIri = await this.client.getSubjectValue(atreeIri.value, SEGM.hasSourcePage);
			const page = await this.getPage(pageIri.value, currentStatus);
			ret = {
				type: 'textChunk',
				description: descr,
				rectangleType: 'textChunk',
				artifactIri: chunkSet._iri,
				artifact: chunkSet,
				pageIri: page._iri,
				page: page,
				rectangles: chunkSet.textChunks
			}
		} else {
			const objData = await this.client.getSubjectDescriptionObj(iri);
			const art = await this.getArtifact(iri, currentStatus);
			ret = {
				type: 'unknown',
				description: descr,
				objData: objData,
				artifactIri: art._iri,
				artifact: art 
			};
		}
		return ret;
	}

	async getPage(iri, currentStatus) {
		if (currentStatus.pageIri === iri && !currentStatus.reloadArtifact) {
			return currentStatus.page;
		} else {
			console.log('RELOADING page');
			currentStatus.reloadArtifact = false; // artifact reloaded, put the force reload flag down
			const page = await this.client.fetchArtifact(iri);
			this.client.sortBoxes(page.boxes);
			return page;
		}
	}

	async getAreaTree(iri, currentStatus) {
		const ret = await this.getArtifact(iri, currentStatus);
		this.client.sortBoxes(ret.areas);
		return ret;
	}

	async getArtifact(iri, currentStatus) {
		if (currentStatus.artifactIri === iri && !currentStatus.reloadArtifact) {
			return currentStatus.artifact;
		} else {
			console.log('RELOADING atree');
			currentStatus.reloadArtifact = false; // artifact reloaded, put the force reload flag down
			return await this.client.fetchArtifact(iri);
		}
	}

}