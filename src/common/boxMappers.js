
import ObjectCreator from './objectcreator.js';
import RDFModel from './rdfmodel.js';

class ArtifactCreator extends ObjectCreator {
	constructor() {
		super();
		this.addMapping({
			createdOn: { name: 'http://fitlayout.github.io/ontology/fitlayout.owl#createdOn', type: 'date' },
			creatorParams: { name: 'http://fitlayout.github.io/ontology/fitlayout.owl#creatorParams', type: 'string' },
			creator: { name: 'http://fitlayout.github.io/ontology/fitlayout.owl#creator', type: 'string' },
			hasParentArtifact: { name: 'http://fitlayout.github.io/ontology/fitlayout.owl#hasParentArtifact', type: 'object<http://fitlayout.github.io/ontology/fitlayout.owl#Artifact>[]' },
			// Inverse collection for Artifact.hasParentArtifact.
			artifacts: { name: 'http://fitlayout.github.io/ontology/fitlayout.owl#hasParentArtifact', type: 'object<http://fitlayout.github.io/ontology/fitlayout.owl#Artifact>[]', inverse: true },
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

class BoundsCreator extends ObjectCreator {
	constructor() {
		super();
		this.addMapping({
			width: { name: 'http://fitlayout.github.io/ontology/render.owl#width', type: 'int' },
			positionY: { name: 'http://fitlayout.github.io/ontology/render.owl#positionY', type: 'int' },
			positionX: { name: 'http://fitlayout.github.io/ontology/render.owl#positionX', type: 'int' },
			height: { name: 'http://fitlayout.github.io/ontology/render.owl#height', type: 'int' },
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
			// Inverse collection for LogicalArea.isSubordinateTo.
			logicalAreas: { name: 'http://fitlayout.github.io/ontology/segmentation.owl#isSubordinateTo', type: 'object<http://fitlayout.github.io/ontology/segmentation.owl#LogicalArea>[]', inverse: true },
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

class PageSetCreator extends ObjectCreator {
	constructor() {
		super();
		this.addMapping({
			createdOn: { name: 'http://fitlayout.github.io/ontology/fitlayout.owl#createdOn', type: 'date' },
			containsPage: { name: 'http://fitlayout.github.io/ontology/fitlayout.owl#containsPage', type: 'object' },
		});
	}
}

class RectAreaCreator extends ObjectCreator {
	constructor() {
		super();
		this.addMapping({
			imageUrl: { name: 'http://fitlayout.github.io/ontology/render.owl#imageUrl', type: 'string' },
			backgroundImagePosition: { name: 'http://fitlayout.github.io/ontology/render.owl#backgroundImagePosition', type: 'string' },
			belongsTo: { name: 'http://fitlayout.github.io/ontology/render.owl#belongsTo', type: 'object<http://fitlayout.github.io/ontology/render.owl#Page>' },
			fontStyle: { name: 'http://fitlayout.github.io/ontology/render.owl#fontStyle', type: 'float' },
			backgroundColor: { name: 'http://fitlayout.github.io/ontology/render.owl#backgroundColor', type: 'string' },
			hasBottomBorder: { name: 'http://fitlayout.github.io/ontology/render.owl#hasBottomBorder', type: 'object<http://fitlayout.github.io/ontology/render.owl#Border>' },
			backgroundImageData: { name: 'http://fitlayout.github.io/ontology/render.owl#backgroundImageData', type: 'string' },
			lineThrough: { name: 'http://fitlayout.github.io/ontology/render.owl#lineThrough', type: 'float' },
			documentOrder: { name: 'http://fitlayout.github.io/ontology/render.owl#documentOrder', type: 'int' },
			hasTopBorder: { name: 'http://fitlayout.github.io/ontology/render.owl#hasTopBorder', type: 'object<http://fitlayout.github.io/ontology/render.owl#Border>' },
			hasLeftBorder: { name: 'http://fitlayout.github.io/ontology/render.owl#hasLeftBorder', type: 'object<http://fitlayout.github.io/ontology/render.owl#Border>' },
			backgroundImageUrl: { name: 'http://fitlayout.github.io/ontology/render.owl#backgroundImageUrl', type: 'string' },
			fontWeight: { name: 'http://fitlayout.github.io/ontology/render.owl#fontWeight', type: 'float' },
			fontSize: { name: 'http://fitlayout.github.io/ontology/render.owl#fontSize', type: 'float' },
			underline: { name: 'http://fitlayout.github.io/ontology/render.owl#underline', type: 'float' },
			bounds: { name: 'http://fitlayout.github.io/ontology/render.owl#bounds', type: 'object<http://fitlayout.github.io/ontology/render.owl#Bounds>' },
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
			// Inverse collection for Area.hasTag.
			areas: { name: 'http://fitlayout.github.io/ontology/segmentation.owl#hasTag', type: 'object<http://fitlayout.github.io/ontology/segmentation.owl#Area>[]', inverse: true },
		});
	}
}

class AreaCreator extends RectAreaCreator {
	constructor() {
		super();
		this.addMapping({
			tagSupport: { name: 'http://fitlayout.github.io/ontology/segmentation.owl#tagSupport', type: 'object' },
			hasContentLength: { name: 'http://fitlayout.github.io/ontology/segmentation.owl#hasContentLength', type: 'int' },
			containsBox: { name: 'http://fitlayout.github.io/ontology/segmentation.owl#containsBox', type: 'object' },
			belongsTo: { name: 'http://fitlayout.github.io/ontology/segmentation.owl#belongsTo', type: 'object<http://fitlayout.github.io/ontology/segmentation.owl#AreaTree>' },
			isChildOf: { name: 'http://fitlayout.github.io/ontology/segmentation.owl#isChildOf', type: 'object<http://fitlayout.github.io/ontology/segmentation.owl#Area>' },
			hasTag: { name: 'http://fitlayout.github.io/ontology/segmentation.owl#hasTag', type: 'object<http://fitlayout.github.io/ontology/segmentation.owl#Tag>[]' },
			// Inverse collection for LogicalArea.containsArea.
			logicalAreas: { name: 'http://fitlayout.github.io/ontology/segmentation.owl#containsArea', type: 'object<http://fitlayout.github.io/ontology/segmentation.owl#LogicalArea>[]', inverse: true },
			// Inverse collection for Area.isChildOf.
			areas: { name: 'http://fitlayout.github.io/ontology/segmentation.owl#isChildOf', type: 'object<http://fitlayout.github.io/ontology/segmentation.owl#Area>[]', inverse: true },
		});
	}
}

class AreaTreeCreator extends ArtifactCreator {
	constructor() {
		super();
		this.addMapping({
			hasSourcePage: { name: 'http://fitlayout.github.io/ontology/segmentation.owl#hasSourcePage', type: 'object' },
			// Inverse collection for Area.belongsTo.
			areas: { name: 'http://fitlayout.github.io/ontology/segmentation.owl#belongsTo', type: 'object<http://fitlayout.github.io/ontology/segmentation.owl#Area>[]', inverse: true },
			// Inverse collection for LogicalAreaTree.hasAreaTree.
			logicalAreaTrees: { name: 'http://fitlayout.github.io/ontology/segmentation.owl#hasAreaTree', type: 'object<http://fitlayout.github.io/ontology/segmentation.owl#LogicalAreaTree>[]', inverse: true },
		});
	}
}

class BoxCreator extends RectAreaCreator {
	constructor() {
		super();
		this.addMapping({
			containsImage: { name: 'http://fitlayout.github.io/ontology/render.owl#containsImage', type: 'object<http://fitlayout.github.io/ontology/render.owl#Image>[]' },
			isChildOf: { name: 'http://fitlayout.github.io/ontology/render.owl#isChildOf', type: 'object<http://fitlayout.github.io/ontology/render.owl#ContainerBox>' },
			visualBounds: { name: 'http://fitlayout.github.io/ontology/render.owl#visualBounds', type: 'object<http://fitlayout.github.io/ontology/render.owl#Bounds>' },
			displayType: { name: 'http://fitlayout.github.io/ontology/render.owl#displayType', type: 'string' },
			hasAttribute: { name: 'http://fitlayout.github.io/ontology/render.owl#hasAttribute', type: 'object' },
			contentBounds: { name: 'http://fitlayout.github.io/ontology/render.owl#contentBounds', type: 'object<http://fitlayout.github.io/ontology/render.owl#Bounds>' },
			hasText: { name: 'http://fitlayout.github.io/ontology/render.owl#hasText', type: 'string' },
			htmlTagName: { name: 'http://fitlayout.github.io/ontology/render.owl#htmlTagName', type: 'string' },
			fontFamily: { name: 'http://fitlayout.github.io/ontology/render.owl#fontFamily', type: 'string' },
			containsObject: { name: 'http://fitlayout.github.io/ontology/render.owl#containsObject', type: 'object<http://fitlayout.github.io/ontology/render.owl#ContentObject>[]' },
			color: { name: 'http://fitlayout.github.io/ontology/render.owl#color', type: 'string' },
		});
	}
}

class ContainerBoxCreator extends BoxCreator {
	constructor() {
		super();
		this.addMapping({
			// Inverse collection for Box.isChildOf.
			boxes: { name: 'http://fitlayout.github.io/ontology/render.owl#isChildOf', type: 'object<http://fitlayout.github.io/ontology/render.owl#Box>[]', inverse: true },
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

class PageCreator extends ArtifactCreator {
	constructor() {
		super();
		this.addMapping({
			width: { name: 'http://fitlayout.github.io/ontology/render.owl#width', type: 'int' },
			hasTitle: { name: 'http://fitlayout.github.io/ontology/render.owl#hasTitle', type: 'string' },
			pngImage: { name: 'http://fitlayout.github.io/ontology/render.owl#pngImage', type: 'string' },
			sourceUrl: { name: 'http://fitlayout.github.io/ontology/render.owl#sourceUrl', type: 'string' },
			height: { name: 'http://fitlayout.github.io/ontology/render.owl#height', type: 'int' },
			// Inverse collection for RectArea.belongsTo.
			rectAreas: { name: 'http://fitlayout.github.io/ontology/render.owl#belongsTo', type: 'object<http://fitlayout.github.io/ontology/render.owl#RectArea>[]', inverse: true },
		});
	}
}

const registry = {
	'http://fitlayout.github.io/ontology/fitlayout.owl#Artifact': new ArtifactCreator(),
	'http://fitlayout.github.io/ontology/render.owl#Border': new BorderCreator(),
	'http://fitlayout.github.io/ontology/render.owl#Bounds': new BoundsCreator(),
	'http://fitlayout.github.io/ontology/render.owl#ContentObject': new ContentObjectCreator(),
	'http://fitlayout.github.io/ontology/render.owl#Image': new ImageCreator(),
	'http://fitlayout.github.io/ontology/segmentation.owl#LogicalArea': new LogicalAreaCreator(),
	'http://fitlayout.github.io/ontology/segmentation.owl#LogicalAreaTree': new LogicalAreaTreeCreator(),
	'http://fitlayout.github.io/ontology/fitlayout.owl#PageSet': new PageSetCreator(),
	'http://fitlayout.github.io/ontology/render.owl#RectArea': new RectAreaCreator(),
	'http://fitlayout.github.io/ontology/segmentation.owl#Tag': new TagCreator(),
	'http://fitlayout.github.io/ontology/segmentation.owl#Area': new AreaCreator(),
	'http://fitlayout.github.io/ontology/segmentation.owl#AreaTree': new AreaTreeCreator(),
	'http://fitlayout.github.io/ontology/render.owl#Box': new BoxCreator(),
	'http://fitlayout.github.io/ontology/render.owl#ContainerBox': new ContainerBoxCreator(),
	'http://fitlayout.github.io/ontology/render.owl#ContentBox': new ContentBoxCreator(),
	'http://fitlayout.github.io/ontology/render.owl#Page': new PageCreator()
};

export class Model extends RDFModel {
	constructor() { super(registry); }
}

