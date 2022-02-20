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
		

	/**
	 * Creates an instance for a specified API client.
	 * 
	 * @param {ApiClient} client 
	 */
	constructor(client) {
		this.client = client;
	}

	/**
	 * Creates a new area in the area tree that contains specified child areas. 
	 * 
	 * @param {*} artIri artifact IRI 
	 * @param {*} parentIri IRI of the parent area of the newly created area
	 * @param {*} childIris array of child area IRIs that will be child nodes of the new area
	 * @param {*} areaData area property specification: positionX, positionY, width, height, iri, label
	 */
	async createSuperArea(artIri, parentIri, childIris, areaData) {

		let delQuery = this.PREFIXES + `DELETE DATA { GRAPH <${artIri}> { `;
		for (let childIri of childIris) {
			delQuery += ` <${childIri}> segm:isChildOf <${parentIri}> . `;
		}
		delQuery += '}}';
		//console.log(delQuery);
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

		for (let childIri of childIris) {
			insQuery += ` <${childIri}> segm:isChildOf <${areaData.iri}> . `;
		}
		insQuery += '}}';
		//console.log(insQuery);
		await this.client.updateQuery(insQuery);
	}

}
