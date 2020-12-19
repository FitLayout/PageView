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
	
	iri = null; // main object IRI (e.g. page IRI)
	elementType = null; // e.g. http://fitlayout.github.io/ontology/render.owl#Box
	creator = null; // object creator to be used

	loader = null;
	elementIRIs = [];

	constructor(iri, elementType, creator) {
		this.iri = iri;
		this.elementType = elementType;
		this.creator = creator;
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
					//window.quads.push(quad);
					if (quad.predicate.value === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type') {
						if (quad.object.value === this.elementType) {
							this.elementIRIs.push(quad.subject.value);
						}
					}
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

	getElementIRIs() {
		return this.elementIRIs;
	}

	getElements() {
		let ret = [];
		for (let iri of this.getElementIRIs()) {
			const elem = this.creator.create(this.loader.resources[iri]);
			ret.push(elem);
		}
		return ret;
	}

	getResources() {
		return this.loader.resources;
	}

	getMain() {
		return this.loader.resources[this.iri];
	}

}
