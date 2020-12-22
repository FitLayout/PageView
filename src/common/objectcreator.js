
export default class ObjectCreator {

	propertyMap = {};

	constructor() {
		//this.propertyMap = {};
	}

	addMapping(mapping) {
		for (const iri in mapping) {
			this.propertyMap[iri] = mapping[iri];
		}
	}

	/**
	 * Creates an object instance.
	 * @param {} resource the RDF resource to create from 
	 * @param {} resolverFunc a resolver function for creating nested objects
	 */
	create(resource, resolverFunc) {
		let ret = {};
		window.mmm = this.propertyMap;
		for (const prop in this.propertyMap) {
			window.ppp = prop;
			const def = this.propertyMap[prop];
			const type = def.type;
			const property = resource.property[def.name];
			if (property) {
				ret[prop] = this.getPropertyValue(property, type, resolverFunc);
			}
		}
		return ret;
	}

	getPropertyValue(property, type, resolverFunc) {
			if (type.endsWith('[]')) {
				type = type.substring(0, type.length - 2);
				return this.getValueList(property, type, resolverFunc);
			}
			else if (type.startsWith('object<')) {
				type = type.substring(7, type.length - 8);
				return this.getObject(property, type, resolverFunc);
			} else {
				return this.getSimpleValue(property, type);
			}
	}

	getSimpleValue(property, type) {
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

	getValueList(property, type, resolverFunc) {
		window.lll = property;
		let ret = [];
		if (property.list) { // a real list
			for (const listElement of property.list) {
				const val = this.getPropertyValue(listElement, type, resolverFunc);
				ret.push(val);
			}
		} else if (property.value) { // a single value
			const val = this.getPropertyValue(property, type, resolverFunc);
			ret.push(val);
		}
		return ret;
	}

	getObject(property, type, resolverFunc) {
		const objectIri = property.value;
		return resolverFunc(objectIri, type)
	}

}
