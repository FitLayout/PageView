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
	//inverse properties to watch separately
	invProperties = [];
	//target objects of inverse propeties
	targets = {};
	//a cache of already created objects
	objects = {};

	constructor(creators) {
		this.creators = creators;
		this.loader = new RdfObjectLoader({ context: this.context });
		//scan for inverse properties
		for (const type in this.creators) {
			const creator = this.creators[type];
			for (const key in creator.propertyMap) {
				if (creator.propertyMap[key].inverse) {
					const propIri = creator.propertyMap[key].name;
					this.invProperties[propIri] = type;
				}
			}
		}
	}
	
	parse(text) {
		return new Promise(resolve => {
			const parser = new N3.Parser();
			let quads = [];
			let errors = [];
			this.boxIRIs = [];
			parser.parse(text, (err, quad, prefixes) => {
				if (quad) {
					quads.push(quad);
					//store the sources of inverse properties
					if (this.invProperties[quad.predicate.id] !== undefined)
					{
						this.addTarget(quad.object.id, quad.predicate.id, quad.subject.id);
					}
				} else if (prefixes) {
					this.loader.importArray(quads).then(() => { resolve() });
				} else {
					errors.push(err);
				}
			});
		});
	}

	addTarget(objectIri, propertyIri, subjectIri) {
		let target = this.targets[objectIri];
		if (target === undefined) {
			target = {};
			this.targets[objectIri] = target;
		}
		let property = target[propertyIri];
		if (property === undefined) {
			property = [];
			target[propertyIri] = property;
		}
		property.push(subjectIri);
	}

	async add(quad) {
		await this.loader.importArray([quad]);
	}

	getResources() {
		return this.loader.resources;
	}

	createObject(iri, type) {
		if (this.objects[iri] === undefined) {
			const creator = this.creators[type];
			const resource = this.loader.resources[iri];
			if (creator !== undefined && resource !== undefined) {
				let obj = creator.create(resource, this);
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

	createInverseObjects(target, property) {
		let ret = [];
		if (this.invProperties[target] && this.invProperties[target][property]) {
			for (const subj of this.invProperties[target][property]) {
				const type = this.loader.resources[subj].property['rdf:type'];
				const obj = this.createObject(subj, type);
				if (obj) {
					ret.push(obj);
				}
			}
		}
		return ret;
	}

}
