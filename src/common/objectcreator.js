
export default class ObjectCreator {

	propertyMap = null;

	constructor(propertyMap) {
		this.propertyMap = propertyMap;
	}

	create(resource) {
		let ret = {};
		for (const prop in this.propertyMap) {
			const def = this.propertyMap[prop];
			const val = resource.property[def.name].value;
			switch (def.type) {
				case 'int':
					ret[prop] = parseInt(val);
					break;
				case 'float':
					ret[prop] = parseFloat(val);
					break;
				default:
					ret[prop] = val;
					break;
			}
		}
		return ret;
	}

}
