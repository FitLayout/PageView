import BOX from '../ontology/BOX.js';
import SEGM from '../ontology/SEGM.js';
import type { FLApiClient } from './apiclient';
import type { RdfBox, RdfObject, ResolvedObject, ResolverStatus } from './types';


/**
 * Resolves the object IRI types and fetches the corresponding pages
 * and other artifacts.
 */
export default class ObjectResolver {

    client: FLApiClient;

    constructor(apiClient: FLApiClient) {
        this.client = apiClient;
    }

    /**
     * Identifies the type of object identified by the given iri and
     * loads the remaining artifacts necessary for displaying the object.
     */
    async resolveObjectIRI(iri: string, currentStatus: ResolverStatus): Promise<ResolvedObject> {
        const type = await this.client.getTypeByIRI(iri);
        // get the general description
        const descrData = await this.client.getSubjectDescription(iri);
        const descr = descrData.results.bindings;
        let ret: ResolvedObject;
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
                rectangles: page.boxes as RdfBox[]
            }
        } else if (type === SEGM.AreaTree) {
            const atree = await this.getAreaTree(iri, currentStatus);
            const page = await this.getPage((atree.hasSourcePage as RdfObject)._iri, currentStatus);
            ret = {
                type: 'areaTree',
                description: descr,
                rectangleType: 'area',
                artifactIri: iri,
                artifact: atree,
                pageIri: page._iri,
                page: page,
                rectangles: atree.areas as RdfBox[]
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
                rectangles: cset.textChunks as RdfBox[]
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
                rectangles: page.boxes as RdfBox[]
            }
        } else if (type === SEGM.Area) {
            const atreeIri = await this.client.getSubjectValue(iri, SEGM.belongsTo);
            const atree = await this.getAreaTree(atreeIri.value, currentStatus);
            const page = await this.getPage((atree.hasSourcePage as RdfObject)._iri, currentStatus);
            ret = {
                type: 'area',
                description: descr,
                rectangleType: 'area',
                artifactIri: atree._iri,
                artifact: atree,
                pageIri: page._iri,
                page: page,
                rectangles: atree.areas as RdfBox[]
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
                rectangles: chunkSet.textChunks as RdfBox[]
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

    async getPage(iri: string, currentStatus: ResolverStatus): Promise<RdfObject> {
        if (currentStatus.pageIri === iri && !currentStatus.reloadArtifact && currentStatus.page) {
            return currentStatus.page;
        } else {
            console.log('RELOADING page');
            currentStatus.reloadArtifact = false;
            const page = await this.client.fetchArtifact(iri);
            this.client.sortBoxes(page!.boxes as RdfObject[]);
            return page!;
        }
    }

    async getAreaTree(iri: string, currentStatus: ResolverStatus): Promise<RdfObject> {
        const ret = await this.getArtifact(iri, currentStatus);
        this.client.sortBoxes(ret.areas as RdfObject[]);
        return ret;
    }

    async getArtifact(iri: string, currentStatus: ResolverStatus): Promise<RdfObject> {
        if (currentStatus.artifactIri === iri && !currentStatus.reloadArtifact && currentStatus.artifact) {
            return currentStatus.artifact;
        } else {
            console.log('RELOADING atree');
            currentStatus.reloadArtifact = false;
            return (await this.client.fetchArtifact(iri))!;
        }
    }

}
