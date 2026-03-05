/**
 * Implementations of complex operations with the RDF API.
 */
export class RdfUtil {

    PREFIXES = `PREFIX fl: <http://fitlayout.github.io/ontology/fitlayout.owl#>
        PREFIX r: <http://fitlayout.github.io/resource/>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX box: <http://fitlayout.github.io/ontology/render.owl#>
        PREFIX segm: <http://fitlayout.github.io/ontology/segmentation.owl#>
        `;

    client: any;

    /**
     * Creates an instance for a specified API client.
     */
    constructor(client: any) {
        this.client = client;
    }

    /**
     * Creates a new area in the area tree that contains specified child areas.
     */
    async createSuperArea(
        artIri: string,
        parentIri: string,
        childIris: string[],
        areaData: {
            iri: string;
            label: string;
            positionX: number;
            positionY: number;
            width: number;
            height: number;
            tagIris?: string[];
        }
    ): Promise<void> {

        let delQuery = this.PREFIXES + `DELETE DATA { GRAPH <${artIri}> { `;
        for (let childIri of childIris) {
            delQuery += ` <${childIri}> segm:isChildOf <${parentIri}> . `;
        }
        delQuery += '}}';
        await this.client.updateQuery(delQuery);

        const rectIri = areaData.iri + '-rect-b';
        let insQuery = this.PREFIXES + `INSERT DATA { GRAPH <${artIri}> {
            <${areaData.iri}> rdf:type segm:Area ;
            segm:belongsTo <${artIri}> ;
            segm:isChildOf <${parentIri}> ;
            rdfs:label "${areaData.label}" ;
            box:bounds <${rectIri}> .

            <${rectIri}> box:height "${areaData.height}"^^xsd:int;
              box:positionX "${areaData.positionX}"^^xsd:int;
              box:positionY "${areaData.positionY}"^^xsd:int;
            box:width "${areaData.width}"^^xsd:int .
        `;

        if (areaData.tagIris) {
            for (let tagIri of areaData.tagIris) {
                insQuery += ` <${areaData.iri}> segm:hasTag <${tagIri}> . `;
            }
        }

        for (let childIri of childIris) {
            insQuery += ` <${childIri}> segm:isChildOf <${areaData.iri}> . `;
        }
        insQuery += '}}';
        await this.client.updateQuery(insQuery);
    }

}
