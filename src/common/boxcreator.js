
import ObjectCreator from './objectcreator.js';

export default class BoxCreator extends ObjectCreator {

	constructor() {
		super({
			x: { name: 'b:positionX', type: 'int' },
			y: { name: 'b:positionY', type: 'int' },
			width: { name: 'b:width', type: 'int' },
			height: { name: 'b:height', type: 'int' }
		});
	}

}
