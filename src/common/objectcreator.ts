
import { Resource } from 'rdf-object';
import type { RdfObject, RdfPropertyValue, PropertyMap } from './types';
import type RDFModel from './rdfmodel';


export default class ObjectCreator {

	propertyMap: PropertyMap = {};

	constructor() {
		// Common properties for all objects.
		this.addMapping({
			_label: { name: 'http://www.w3.org/2000/01/rdf-schema#label', type: 'string' },
			_value: { name: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#value', type: 'string' },
			createdOn: { name: 'http://fitlayout.github.io/ontology/fitlayout.owl#createdOn', type: 'string' },
			creator: { name: 'http://fitlayout.github.io/ontology/fitlayout.owl#creator', type: 'string' },
			creatorParams: { name: 'http://fitlayout.github.io/ontology/fitlayout.owl#creatorParams', type: 'string' },
		});
	}

	/**
	 * Add a new mapping to the object creator.
	 * @param mapping The object mapping specification.
	 */
	addMapping(mapping: PropertyMap): void {
		for (const iri in mapping) {
			this.propertyMap[iri] = mapping[iri];
		}
	}

	/**
	 * Creates an object instance. Takes an initial target object and fills it with
	 * the properties and their values.
	 */
	create(resource: Resource, model: RDFModel, target: RdfObject): RdfObject {
		const ret = target;
		for (const prop in this.propertyMap) {
			const def = this.propertyMap[prop];
			const type = def.type;
			if (def.inverse) {
				ret[prop] = model.createInverseObjects(resource.value, def.name);
			} else {
				const properties = resource.properties[def.name];
				if (properties && properties.length > 0) {
					ret[prop] = this.getPropertyValue(properties, type, model);
				}
			}
		}
		return ret;
	}

	getPropertyValue(properties: Resource[], type: string, model: RDFModel): RdfPropertyValue | undefined {
		if (type.startsWith('object<')) {
			type = type.substring(7, type.length);
			if (type.endsWith('[]')) {
				type = type.substring(0, type.length - 3);
				return this.getObjectList(properties, type, model);
			} else {
				type = type.substring(0, type.length - 1);
				return this.getObject(properties[0], type, model);
			}
		}
		else if (type.endsWith('[]')) {
			type = type.substring(0, type.length - 2);
			return this.getValueList(properties, type, model);
		}
		else {
			return this.getSimpleValue(properties[0], type);
		}
	}

	getSimpleValue(property: Resource, type: string): string | number {
		const val = property.value;
		switch (type) {
			case 'int':
				return parseInt(val);
			case 'float':
				return parseFloat(val);
			default:
				return val;
		}
	}

	getValueList(properties: Resource[], type: string, model: RDFModel): (string | number)[] {
		const ret: (string | number)[] = [];
		for (const property of properties) {
			ret.push(this.getPropertyValue([property], type, model) as string | number);
		}
		return ret;
	}

	getObject(property: Resource, type: string, model: RDFModel): RdfObject | undefined {
		const objectIri = property.value;
		return model.createObject(objectIri, type);
	}

	getObjectList(properties: Resource[], type: string, model: RDFModel): RdfObject[] {
		const ret: RdfObject[] = [];
		const iris = this.getValueList(properties, type, model) as string[];
		for (const iri of iris) {
			const obj = model.createObject(iri, type);
			if (obj) {
                ret.push(obj);
            }
		}
		return ret;
	}

}
