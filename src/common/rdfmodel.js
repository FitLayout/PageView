import {RdfObjectLoader} from "rdf-object";
const N3 = require('n3');

export default class RDFModel {

	context = {
		"rdf" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
		"rdfs" : "http://www.w3.org/2000/01/rdf-schema#",
		"xsd" : "http://www.w3.org/2001/XMLSchema#",
		"b" : "http://fitlayout.github.io/ontology/render.owl#",
		"a" : "http://fitlayout.github.io/ontology/segmentation.owl#",
		"fl" : "http://fitlayout.github.io/ontology/fitlayout.owl#",
		"r" : "http://fitlayout.github.io/resource/"
	}
	
	creators = null;
	loader = null;
	objects = {};

	constructor(creators) {
		this.creators = creators;
		this.loader = new RdfObjectLoader({ context: this.context });
	}
	
	parse(text) {
		return new Promise(resolve => {
			const parser = new N3.Parser();
			let quads = [];
			let errors = [];
			this.boxIRIs = [];
					//window.quads = [];
			parser.parse(text, (err, quad, prefixes) => {
				if (quad) {
					quads.push(quad);
				} else if (prefixes) {
					this.loader.importArray(quads).then(() => { resolve() });
				} else {
					errors.push(err);
				}
			});
		});
	}

	async add(quad) {
		await this.loader.importArray([quad]);
	}

	/*getElements() {
		let ret = [];
		for (let iri of this.getElementIRIs()) {
			const elem = this.creator.create(this.loader.resources[iri],
				(objectIri, type) => { 
					return objectIri + ":" + type
				});
			ret.push(elem);
		}
		return ret;
	}*/

	getResources() {
		return this.loader.resources;
	}

	createObject(iri, type) {
		if (this.objects[iri] === undefined) {
			const creators = this.creators;
			const creator = this.creators[type];
			//const creator = new PageCreator();
			const resource = this.loader.resources[iri];
			window.rrr = resource;
			window.ccc = creator;
			window.ttt = this;
			window.uuu = creators;
			if (creator !== undefined && resource !== undefined) {
				let obj = creator.create(resource, this.createObject);
				if (obj) {
					this.objects[iri] = obj;
				}
			}
		} 
		return this.objects[iri];
	}

	getObject(iri, type) {
		return this.createObject(iri, type);
	}

}
