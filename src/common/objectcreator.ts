
export interface PropertyDef {
	name: string;
	type: string;
	inverse?: boolean;
}

export type PropertyMap = { [key: string]: PropertyDef };

export default class ObjectCreator {

	propertyMap: PropertyMap = {};

	constructor() {
		this.addMapping({
			_label: { name: 'http://www.w3.org/2000/01/rdf-schema#label', type: 'string' },
			_value: { name: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#value', type: 'string' },
			createdOn: { name: 'http://fitlayout.github.io/ontology/fitlayout.owl#createdOn', type: 'string' },
			creator: { name: 'http://fitlayout.github.io/ontology/fitlayout.owl#creator', type: 'string' },
			creatorParams: { name: 'http://fitlayout.github.io/ontology/fitlayout.owl#creatorParams', type: 'string' },
		});
	}

	addMapping(mapping: PropertyMap): void {
		for (const iri in mapping) {
			this.propertyMap[iri] = mapping[iri];
		}
	}

	/**
	 * Creates an object instance. Takes an initial target object and fills it with
	 * the properties and their values.
	 */
	create(resource: any, model: any, target: any): any {
		let ret = target;
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

	getPropertyValue(properties: any[], type: string, model: any): any {
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

	getSimpleValue(property: any, type: string): any {
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

	getValueList(properties: any[], type: string, model: any): any[] {
		let ret: any[] = [];
		for (const property of properties) {
			const val = this.getPropertyValue([property], type, model);
			ret.push(val);
		}
		return ret;
	}

	getObject(property: any, type: string, model: any): any {
		const objectIri = property.value;
		return model.createObject(objectIri, type)
	}

	getObjectList(properties: any[], type: string, model: any): any[] {
		let ret: any[] = [];
		let iris = this.getValueList(properties, type, model);
		for (let iri of iris) {
			ret.push(model.createObject(iri, type));
		}
		return ret;
	}

}
