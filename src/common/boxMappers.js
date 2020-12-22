
import ObjectCreator from './objectcreator.js';
import RDFModel from './rdfmodel.js';

class AreaTreeCreator extends ObjectCreator {
	constructor() {
		super();
		this.addMapping({
			hasSourcePage: { name: 'http://fitlayout.github.io/ontology/segmentation.owl#hasSourcePage', type: 'object' },
		});
	}
}

class BorderCreator extends ObjectCreator {
	constructor() {
		super();
		this.addMapping({
			borderWidth: { name: 'http://fitlayout.github.io/ontology/render.owl#borderWidth', type: 'int' },
			borderStyle: { name: 'http://fitlayout.github.io/ontology/render.owl#borderStyle', type: 'string' },
			borderColor: { name: 'http://fitlayout.github.io/ontology/render.owl#borderColor', type: 'string' },
		});
	}
}

class ContentObjectCreator extends ObjectCreator {
	constructor() {
		super();
		this.addMapping({
			objectInformation: { name: 'http://fitlayout.github.io/ontology/render.owl#objectInformation', type: 'string' },
		});
	}
}

class ImageCreator extends ObjectCreator {
	constructor() {
		super();
		this.addMapping({
			imageUrl: { name: 'http://fitlayout.github.io/ontology/render.owl#imageUrl', type: 'string' },
			imageData: { name: 'http://fitlayout.github.io/ontology/render.owl#imageData', type: 'string' },
		});
	}
}

class LogicalAreaCreator extends ObjectCreator {
	constructor() {
		super();
		this.addMapping({
			containsArea: { name: 'http://fitlayout.github.io/ontology/segmentation.owl#containsArea', type: 'object<http://fitlayout.github.io/ontology/segmentation.owl#Area>[]' },
			hasText: { name: 'http://fitlayout.github.io/ontology/segmentation.owl#hasText', type: 'string' },
			isSubordinateTo: { name: 'http://fitlayout.github.io/ontology/segmentation.owl#isSubordinateTo', type: 'object<http://fitlayout.github.io/ontology/segmentation.owl#LogicalArea>' },
			hasTag: { name: 'http://fitlayout.github.io/ontology/segmentation.owl#hasTag', type: 'object<http://fitlayout.github.io/ontology/segmentation.owl#Tag>[]' },
		});
	}
}

class LogicalAreaTreeCreator extends ObjectCreator {
	constructor() {
		super();
		this.addMapping({
			hasAreaTree: { name: 'http://fitlayout.github.io/ontology/segmentation.owl#hasAreaTree', type: 'object<http://fitlayout.github.io/ontology/segmentation.owl#AreaTree>' },
		});
	}
}

class PageCreator extends ObjectCreator {
	constructor() {
		super();
		this.addMapping({
			width: { name: 'http://fitlayout.github.io/ontology/render.owl#width', type: 'int' },
			hasTitle: { name: 'http://fitlayout.github.io/ontology/render.owl#hasTitle', type: 'string' },
			pngImage: { name: 'http://fitlayout.github.io/ontology/render.owl#pngImage', type: 'string' },
			sourceUrl: { name: 'http://fitlayout.github.io/ontology/render.owl#sourceUrl', type: 'string' },
			height: { name: 'http://fitlayout.github.io/ontology/render.owl#height', type: 'int' },
		});
	}
}

class RectangleCreator extends ObjectCreator {
	constructor() {
		super();
		this.addMapping({
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
		});
	}
}

class TagCreator extends ObjectCreator {
	constructor() {
		super();
		this.addMapping({
			hasName: { name: 'http://fitlayout.github.io/ontology/segmentation.owl#hasName', type: 'string' },
			hasType: { name: 'http://fitlayout.github.io/ontology/segmentation.owl#hasType', type: 'string' },
		});
	}
}

class AreaCreator extends RectangleCreator {
	constructor() {
		super();
		this.addMapping({
			tagSupport: { name: 'http://fitlayout.github.io/ontology/segmentation.owl#tagSupport', type: 'object' },
			hasContentLength: { name: 'http://fitlayout.github.io/ontology/segmentation.owl#hasContentLength', type: 'int' },
			containsBox: { name: 'http://fitlayout.github.io/ontology/segmentation.owl#containsBox', type: 'object' },
			belongsTo: { name: 'http://fitlayout.github.io/ontology/segmentation.owl#belongsTo', type: 'object<http://fitlayout.github.io/ontology/segmentation.owl#AreaTree>' },
			isChildOf: { name: 'http://fitlayout.github.io/ontology/segmentation.owl#isChildOf', type: 'object<http://fitlayout.github.io/ontology/segmentation.owl#Area>' },
			hasTag: { name: 'http://fitlayout.github.io/ontology/segmentation.owl#hasTag', type: 'object<http://fitlayout.github.io/ontology/segmentation.owl#Tag>[]' },
		});
	}
}

class BoxCreator extends RectangleCreator {
	constructor() {
		super();
		this.addMapping({
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
		});
	}
}

class ContainerBoxCreator extends BoxCreator {
	constructor() {
		super();
		this.addMapping({
		});
	}
}

class ContentBoxCreator extends BoxCreator {
	constructor() {
		super();
		this.addMapping({
		});
	}
}

const registry = {
	'http://fitlayout.github.io/ontology/segmentation.owl#AreaTree': new AreaTreeCreator(),
	'http://fitlayout.github.io/ontology/render.owl#Border': new BorderCreator(),
	'http://fitlayout.github.io/ontology/render.owl#ContentObject': new ContentObjectCreator(),
	'http://fitlayout.github.io/ontology/render.owl#Image': new ImageCreator(),
	'http://fitlayout.github.io/ontology/segmentation.owl#LogicalArea': new LogicalAreaCreator(),
	'http://fitlayout.github.io/ontology/segmentation.owl#LogicalAreaTree': new LogicalAreaTreeCreator(),
	'http://fitlayout.github.io/ontology/render.owl#Page': new PageCreator(),
	'http://fitlayout.github.io/ontology/render.owl#Rectangle': new RectangleCreator(),
	'http://fitlayout.github.io/ontology/segmentation.owl#Tag': new TagCreator(),
	'http://fitlayout.github.io/ontology/segmentation.owl#Area': new AreaCreator(),
	'http://fitlayout.github.io/ontology/render.owl#Box': new BoxCreator(),
	'http://fitlayout.github.io/ontology/render.owl#ContainerBox': new ContainerBoxCreator(),
	'http://fitlayout.github.io/ontology/render.owl#ContentBox': new ContentBoxCreator()
};

export class Model extends RDFModel {
	constructor() { super(registry); }
}

