
import ObjectCreator from './objectcreator.js';

export class ContentObjectCreator extends ObjectCreator {
	constructor(mapping = {}) {
		super({
			objectInformation: { name: 'http://fitlayout.github.io/ontology/render.owl#objectInformation', type: 'string' },
			...mapping
		});
	}
}

export class BorderCreator extends ObjectCreator {
	constructor(mapping = {}) {
		super({
			borderWidth: { name: 'http://fitlayout.github.io/ontology/render.owl#borderWidth', type: 'int' },
			borderStyle: { name: 'http://fitlayout.github.io/ontology/render.owl#borderStyle', type: 'string' },
			borderColor: { name: 'http://fitlayout.github.io/ontology/render.owl#borderColor', type: 'string' },
			...mapping
		});
	}
}

export class RectangleCreator extends ObjectCreator {
	constructor(mapping = {}) {
		super({
			width: { name: 'http://fitlayout.github.io/ontology/render.owl#width', type: 'int' },
			imageUrl: { name: 'http://fitlayout.github.io/ontology/render.owl#imageUrl', type: 'string' },
			backgroundImagePosition: { name: 'http://fitlayout.github.io/ontology/render.owl#backgroundImagePosition', type: 'string' },
			belongsTo: { name: 'http://fitlayout.github.io/ontology/render.owl#belongsTo', type: 'object<http://fitlayout.github.io/ontology/render.owl#Page>' },
			fontStyle: { name: 'http://fitlayout.github.io/ontology/render.owl#fontStyle', type: 'float' },
			backgroundColor: { name: 'http://fitlayout.github.io/ontology/render.owl#backgroundColor', type: 'string' },
			hasBottomBorder: { name: 'http://fitlayout.github.io/ontology/render.owl#hasBottomBorder', type: 'object<http://fitlayout.github.io/ontology/render.owl#Border>' },
			positionY: { name: 'http://fitlayout.github.io/ontology/render.owl#positionY', type: 'int' },
			backgroundImageData: { name: 'http://fitlayout.github.io/ontology/render.owl#backgroundImageData', type: 'string' },
			lineThrough: { name: 'http://fitlayout.github.io/ontology/render.owl#lineThrough', type: 'float' },
			positionX: { name: 'http://fitlayout.github.io/ontology/render.owl#positionX', type: 'int' },
			documentOrder: { name: 'http://fitlayout.github.io/ontology/render.owl#documentOrder', type: 'int' },
			hasTopBorder: { name: 'http://fitlayout.github.io/ontology/render.owl#hasTopBorder', type: 'object<http://fitlayout.github.io/ontology/render.owl#Border>' },
			hasLeftBorder: { name: 'http://fitlayout.github.io/ontology/render.owl#hasLeftBorder', type: 'object<http://fitlayout.github.io/ontology/render.owl#Border>' },
			backgroundImageUrl: { name: 'http://fitlayout.github.io/ontology/render.owl#backgroundImageUrl', type: 'string' },
			fontWeight: { name: 'http://fitlayout.github.io/ontology/render.owl#fontWeight', type: 'float' },
			fontSize: { name: 'http://fitlayout.github.io/ontology/render.owl#fontSize', type: 'float' },
			underline: { name: 'http://fitlayout.github.io/ontology/render.owl#underline', type: 'float' },
			height: { name: 'http://fitlayout.github.io/ontology/render.owl#height', type: 'int' },
			fontVariant: { name: 'http://fitlayout.github.io/ontology/render.owl#fontVariant', type: 'string' },
			hasRightBorder: { name: 'http://fitlayout.github.io/ontology/render.owl#hasRightBorder', type: 'object<http://fitlayout.github.io/ontology/render.owl#Border>' },
			...mapping
		});
	}
}

export class BoxCreator extends RectangleCreator {
	constructor(mapping = {}) {
		super({
			containsImage: { name: 'http://fitlayout.github.io/ontology/render.owl#containsImage', type: 'object<http://fitlayout.github.io/ontology/render.owl#Image>[]' },
			visualHeight: { name: 'http://fitlayout.github.io/ontology/render.owl#visualHeight', type: 'int' },
			isChildOf: { name: 'http://fitlayout.github.io/ontology/render.owl#isChildOf', type: 'object<http://fitlayout.github.io/ontology/render.owl#ContainerBox>' },
			hasText: { name: 'http://fitlayout.github.io/ontology/render.owl#hasText', type: 'string' },
			fontFamily: { name: 'http://fitlayout.github.io/ontology/render.owl#fontFamily', type: 'string' },
			visualY: { name: 'http://fitlayout.github.io/ontology/render.owl#visualY', type: 'int' },
			visualX: { name: 'http://fitlayout.github.io/ontology/render.owl#visualX', type: 'int' },
			visualWidth: { name: 'http://fitlayout.github.io/ontology/render.owl#visualWidth', type: 'int' },
			displayType: { name: 'http://fitlayout.github.io/ontology/render.owl#displayType', type: 'string' },
			hasAttribute: { name: 'http://fitlayout.github.io/ontology/render.owl#hasAttribute', type: 'object' },
			htmlTagName: { name: 'http://fitlayout.github.io/ontology/render.owl#htmlTagName', type: 'string' },
			containsObject: { name: 'http://fitlayout.github.io/ontology/render.owl#containsObject', type: 'object<http://fitlayout.github.io/ontology/render.owl#ContentObject>[]' },
			color: { name: 'http://fitlayout.github.io/ontology/render.owl#color', type: 'string' },
			...mapping
		});
	}
}

export class ContainerBoxCreator extends BoxCreator {
	constructor(mapping = {}) {
		super({
			...mapping
		});
	}
}

export class ImageCreator extends ObjectCreator {
	constructor(mapping = {}) {
		super({
			imageUrl: { name: 'http://fitlayout.github.io/ontology/render.owl#imageUrl', type: 'string' },
			imageData: { name: 'http://fitlayout.github.io/ontology/render.owl#imageData', type: 'string' },
			...mapping
		});
	}
}

export class PageCreator extends ObjectCreator {
	constructor(mapping = {}) {
		super({
			width: { name: 'http://fitlayout.github.io/ontology/render.owl#width', type: 'int' },
			hasTitle: { name: 'http://fitlayout.github.io/ontology/render.owl#hasTitle', type: 'string' },
			pngImage: { name: 'http://fitlayout.github.io/ontology/render.owl#pngImage', type: 'string' },
			sourceUrl: { name: 'http://fitlayout.github.io/ontology/render.owl#sourceUrl', type: 'string' },
			height: { name: 'http://fitlayout.github.io/ontology/render.owl#height', type: 'int' },
			...mapping
		});
	}
}

export class ContentBoxCreator extends BoxCreator {
	constructor(mapping = {}) {
		super({
			...mapping
		});
	}
}

