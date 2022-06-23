
import ObjectCreator from './objectcreator.js';
import RDFModel from './rdfmodel.js';

class ArtifactCreator extends ObjectCreator {
	constructor() {
		super();
		this.addMapping({
			createdOn: { name: 'http://fitlayout.github.io/ontology/fitlayout.owl#createdOn', type: 'date' },
			creatorParams: { name: 'http://fitlayout.github.io/ontology/fitlayout.owl#creatorParams', type: 'string' },
			creator: { name: 'http://fitlayout.github.io/ontology/fitlayout.owl#creator', type: 'string' },
			hasParentArtifact: { name: 'http://fitlayout.github.io/ontology/fitlayout.owl#hasParentArtifact', type: 'object<http://fitlayout.github.io/ontology/fitlayout.owl#Artifact>' },
			// Inverse collection for Artifact.hasParentArtifact.
			artifacts: { name: 'http://fitlayout.github.io/ontology/fitlayout.owl#hasParentArtifact', type: 'object<http://fitlayout.github.io/ontology/fitlayout.owl#Artifact>[]', inverse: true },
		});
	}
}

class AttributeCreator extends ObjectCreator {
	constructor() {
		super();
		this.addMapping({
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
		});
	}
}

class LogicalAreaCreator extends ObjectCreator {
	constructor() {
		super();
		this.addMapping({
			containsArea: { name: 'http://fitlayout.github.io/ontology/segmentation.owl#containsArea', type: 'object<http://fitlayout.github.io/ontology/segmentation.owl#Area>[]' },
			belongsToLogicalTree: { name: 'http://fitlayout.github.io/ontology/segmentation.owl#belongsToLogicalTree', type: 'object<http://fitlayout.github.io/ontology/segmentation.owl#LogicalAreaTree>[]' },
			text: { name: 'http://fitlayout.github.io/ontology/segmentation.owl#text', type: 'string' },
			isSubordinateTo: { name: 'http://fitlayout.github.io/ontology/segmentation.owl#isSubordinateTo', type: 'object<http://fitlayout.github.io/ontology/segmentation.owl#LogicalArea>' },
			hasTag: { name: 'http://fitlayout.github.io/ontology/segmentation.owl#hasTag', type: 'object<http://fitlayout.github.io/ontology/segmentation.owl#Tag>[]' },
			// Inverse collection for LogicalArea.isSubordinateTo.
			logicalAreas: { name: 'http://fitlayout.github.io/ontology/segmentation.owl#isSubordinateTo', type: 'object<http://fitlayout.github.io/ontology/segmentation.owl#LogicalArea>[]', inverse: true },
		});
	}
}

class RectAreaCreator extends ObjectCreator {
	constructor() {
		super();
		this.addMapping({
			fontStyle: { name: 'http://fitlayout.github.io/ontology/render.owl#fontStyle', type: 'float' },
			backgroundSeparated: { name: 'http://fitlayout.github.io/ontology/render.owl#backgroundSeparated', type: 'boolean[]' },
			backgroundColor: { name: 'http://fitlayout.github.io/ontology/render.owl#backgroundColor', type: 'string' },
			hasBottomBorder: { name: 'http://fitlayout.github.io/ontology/render.owl#hasBottomBorder', type: 'object<http://fitlayout.github.io/ontology/render.owl#Border>' },
			lineThrough: { name: 'http://fitlayout.github.io/ontology/render.owl#lineThrough', type: 'float' },
			documentOrder: { name: 'http://fitlayout.github.io/ontology/render.owl#documentOrder', type: 'int' },
			hasTopBorder: { name: 'http://fitlayout.github.io/ontology/render.owl#hasTopBorder', type: 'object<http://fitlayout.github.io/ontology/render.owl#Border>' },
			hasLeftBorder: { name: 'http://fitlayout.github.io/ontology/render.owl#hasLeftBorder', type: 'object<http://fitlayout.github.io/ontology/render.owl#Border>' },
			contentLength: { name: 'http://fitlayout.github.io/ontology/render.owl#contentLength', type: 'int' },
			fontWeight: { name: 'http://fitlayout.github.io/ontology/render.owl#fontWeight', type: 'float' },
			fontSize: { name: 'http://fitlayout.github.io/ontology/render.owl#fontSize', type: 'float' },
			underline: { name: 'http://fitlayout.github.io/ontology/render.owl#underline', type: 'float' },
			bounds: { name: 'http://fitlayout.github.io/ontology/render.owl#bounds', type: 'object<http://fitlayout.github.io/ontology/render.owl#Bounds>' },
			fontVariant: { name: 'http://fitlayout.github.io/ontology/render.owl#fontVariant', type: 'string' },
			hasBackgroundImage: { name: 'http://fitlayout.github.io/ontology/render.owl#hasBackgroundImage', type: 'object<http://fitlayout.github.io/ontology/render.owl#Image>' },
			hasRightBorder: { name: 'http://fitlayout.github.io/ontology/render.owl#hasRightBorder', type: 'object<http://fitlayout.github.io/ontology/render.owl#Border>' },
		});
	}
}

class TagCreator extends ObjectCreator {
	constructor() {
		super();
		this.addMapping({
			name: { name: 'http://fitlayout.github.io/ontology/segmentation.owl#name', type: 'string' },
			type: { name: 'http://fitlayout.github.io/ontology/segmentation.owl#type', type: 'string' },
			tagger: { name: 'http://fitlayout.github.io/ontology/segmentation.owl#tagger', type: 'object<http://fitlayout.github.io/ontology/fitlayout.owl#Tagger>[]' },
		});
	}
}

class TaggerCreator extends ObjectCreator {
	constructor() {
		super();
		this.addMapping({
		});
	}
}

class AreaCreator extends RectAreaCreator {
	constructor() {
		super();
		this.addMapping({
			tagSupport: { name: 'http://fitlayout.github.io/ontology/segmentation.owl#tagSupport', type: 'object' },
			containsBox: { name: 'http://fitlayout.github.io/ontology/segmentation.owl#containsBox', type: 'object<http://fitlayout.github.io/ontology/render.owl#Box>[]' },
			belongsTo: { name: 'http://fitlayout.github.io/ontology/segmentation.owl#belongsTo', type: 'object<http://fitlayout.github.io/ontology/segmentation.owl#AreaTree>' },
			isChildOf: { name: 'http://fitlayout.github.io/ontology/segmentation.owl#isChildOf', type: 'object<http://fitlayout.github.io/ontology/segmentation.owl#Area>' },
			hasTag: { name: 'http://fitlayout.github.io/ontology/segmentation.owl#hasTag', type: 'object<http://fitlayout.github.io/ontology/segmentation.owl#Tag>[]' },
			// Inverse collection for LogicalArea.containsArea.
			logicalAreas: { name: 'http://fitlayout.github.io/ontology/segmentation.owl#containsArea', type: 'object<http://fitlayout.github.io/ontology/segmentation.owl#LogicalArea>[]', inverse: true },
			// Inverse collection for TextChunk.hasSourceArea.
			textChunks: { name: 'http://fitlayout.github.io/ontology/segmentation.owl#hasSourceArea', type: 'object<http://fitlayout.github.io/ontology/segmentation.owl#TextChunk>[]', inverse: true },
			// Inverse collection for Area.isChildOf.
			areas: { name: 'http://fitlayout.github.io/ontology/segmentation.owl#isChildOf', type: 'object<http://fitlayout.github.io/ontology/segmentation.owl#Area>[]', inverse: true },
		});
	}
}

class AreaTreeCreator extends ArtifactCreator {
	constructor() {
		super();
		this.addMapping({
			hasSourcePage: { name: 'http://fitlayout.github.io/ontology/segmentation.owl#hasSourcePage', type: 'object<http://fitlayout.github.io/ontology/render.owl#Page>' },
			// Inverse collection for Area.belongsTo.
			areas: { name: 'http://fitlayout.github.io/ontology/segmentation.owl#belongsTo', type: 'object<http://fitlayout.github.io/ontology/segmentation.owl#Area>[]', inverse: true },
		});
	}
}

class BoxCreator extends RectAreaCreator {
	constructor() {
		super();
		this.addMapping({
			belongsTo: { name: 'http://fitlayout.github.io/ontology/render.owl#belongsTo', type: 'object<http://fitlayout.github.io/ontology/render.owl#Page>' },
			isChildOf: { name: 'http://fitlayout.github.io/ontology/render.owl#isChildOf', type: 'object<http://fitlayout.github.io/ontology/render.owl#ContainerBox>' },
			contentBounds: { name: 'http://fitlayout.github.io/ontology/render.owl#contentBounds', type: 'object<http://fitlayout.github.io/ontology/render.owl#Bounds>' },
			text: { name: 'http://fitlayout.github.io/ontology/render.owl#text', type: 'string' },
			fontFamily: { name: 'http://fitlayout.github.io/ontology/render.owl#fontFamily', type: 'string' },
			sourceXPath: { name: 'http://fitlayout.github.io/ontology/render.owl#sourceXPath', type: 'string' },
			visible: { name: 'http://fitlayout.github.io/ontology/render.owl#visible', type: 'boolean' },
			visualBounds: { name: 'http://fitlayout.github.io/ontology/render.owl#visualBounds', type: 'object<http://fitlayout.github.io/ontology/render.owl#Bounds>' },
			displayType: { name: 'http://fitlayout.github.io/ontology/render.owl#displayType', type: 'string' },
			hasAttribute: { name: 'http://fitlayout.github.io/ontology/render.owl#hasAttribute', type: 'object<http://fitlayout.github.io/ontology/render.owl#Attribute>[]' },
			htmlTagName: { name: 'http://fitlayout.github.io/ontology/render.owl#htmlTagName', type: 'string' },
			containsObject: { name: 'http://fitlayout.github.io/ontology/render.owl#containsObject', type: 'object<http://fitlayout.github.io/ontology/render.owl#ContentObject>[]' },
			color: { name: 'http://fitlayout.github.io/ontology/render.owl#color', type: 'string' },
		});
	}
}

class ChunkSetCreator extends ArtifactCreator {
	constructor() {
		super();
		this.addMapping({
			hasAreaTree: { name: 'http://fitlayout.github.io/ontology/segmentation.owl#hasAreaTree', type: 'object<http://fitlayout.github.io/ontology/segmentation.owl#AreaTree>' },
			// Inverse collection for TextChunk.belongsToChunkSet.
			textChunks: { name: 'http://fitlayout.github.io/ontology/segmentation.owl#belongsToChunkSet', type: 'object<http://fitlayout.github.io/ontology/segmentation.owl#TextChunk>[]', inverse: true },
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

class ImageCreator extends ContentObjectCreator {
	constructor() {
		super();
		this.addMapping({
			imageUrl: { name: 'http://fitlayout.github.io/ontology/render.owl#imageUrl', type: 'string' },
			imageData: { name: 'http://fitlayout.github.io/ontology/render.owl#imageData', type: 'string' },
		});
	}
}

class LogicalAreaTreeCreator extends ArtifactCreator {
	constructor() {
		super();
		this.addMapping({
			hasAreaTree: { name: 'http://fitlayout.github.io/ontology/segmentation.owl#hasAreaTree', type: 'object<http://fitlayout.github.io/ontology/segmentation.owl#AreaTree>' },
			// Inverse collection for LogicalArea.belongsToLogicalTree.
			logicalAreas: { name: 'http://fitlayout.github.io/ontology/segmentation.owl#belongsToLogicalTree', type: 'object<http://fitlayout.github.io/ontology/segmentation.owl#LogicalArea>[]', inverse: true },
		});
	}
}

class PageCreator extends ArtifactCreator {
	constructor() {
		super();
		this.addMapping({
			width: { name: 'http://fitlayout.github.io/ontology/render.owl#width', type: 'int' },
			pngImage: { name: 'http://fitlayout.github.io/ontology/render.owl#pngImage', type: 'string' },
			sourceUrl: { name: 'http://fitlayout.github.io/ontology/render.owl#sourceUrl', type: 'string' },
			height: { name: 'http://fitlayout.github.io/ontology/render.owl#height', type: 'int' },
			title: { name: 'http://fitlayout.github.io/ontology/render.owl#title', type: 'string' },
			// Inverse collection for Box.belongsTo.
			boxes: { name: 'http://fitlayout.github.io/ontology/render.owl#belongsTo', type: 'object<http://fitlayout.github.io/ontology/render.owl#Box>[]', inverse: true },
		});
	}
}

class TextChunkCreator extends RectAreaCreator {
	constructor() {
		super();
		this.addMapping({
			tagSupport: { name: 'http://fitlayout.github.io/ontology/segmentation.owl#tagSupport', type: 'object' },
			hasSourceArea: { name: 'http://fitlayout.github.io/ontology/segmentation.owl#hasSourceArea', type: 'object<http://fitlayout.github.io/ontology/segmentation.owl#Area>' },
			belongsToChunkSet: { name: 'http://fitlayout.github.io/ontology/segmentation.owl#belongsToChunkSet', type: 'object<http://fitlayout.github.io/ontology/segmentation.owl#ChunkSet>' },
			text: { name: 'http://fitlayout.github.io/ontology/segmentation.owl#text', type: 'string' },
			hasSourceBox: { name: 'http://fitlayout.github.io/ontology/segmentation.owl#hasSourceBox', type: 'object<http://fitlayout.github.io/ontology/render.owl#Box>' },
			hasTag: { name: 'http://fitlayout.github.io/ontology/segmentation.owl#hasTag', type: 'object<http://fitlayout.github.io/ontology/segmentation.owl#Tag>[]' },
		});
	}
}

const registry = {
	'http://fitlayout.github.io/ontology/fitlayout.owl#Artifact': new ArtifactCreator(),
	'http://fitlayout.github.io/ontology/render.owl#Attribute': new AttributeCreator(),
	'http://fitlayout.github.io/ontology/render.owl#Border': new BorderCreator(),
	'http://fitlayout.github.io/ontology/render.owl#Bounds': new BoundsCreator(),
	'http://fitlayout.github.io/ontology/render.owl#ContentObject': new ContentObjectCreator(),
	'http://fitlayout.github.io/ontology/segmentation.owl#LogicalArea': new LogicalAreaCreator(),
	'http://fitlayout.github.io/ontology/render.owl#RectArea': new RectAreaCreator(),
	'http://fitlayout.github.io/ontology/segmentation.owl#Tag': new TagCreator(),
	'http://fitlayout.github.io/ontology/fitlayout.owl#Tagger': new TaggerCreator(),
	'http://fitlayout.github.io/ontology/segmentation.owl#Area': new AreaCreator(),
	'http://fitlayout.github.io/ontology/segmentation.owl#AreaTree': new AreaTreeCreator(),
	'http://fitlayout.github.io/ontology/render.owl#Box': new BoxCreator(),
	'http://fitlayout.github.io/ontology/segmentation.owl#ChunkSet': new ChunkSetCreator(),
	'http://fitlayout.github.io/ontology/render.owl#ContainerBox': new ContainerBoxCreator(),
	'http://fitlayout.github.io/ontology/render.owl#ContentBox': new ContentBoxCreator(),
	'http://fitlayout.github.io/ontology/render.owl#Image': new ImageCreator(),
	'http://fitlayout.github.io/ontology/segmentation.owl#LogicalAreaTree': new LogicalAreaTreeCreator(),
	'http://fitlayout.github.io/ontology/render.owl#Page': new PageCreator(),
	'http://fitlayout.github.io/ontology/segmentation.owl#TextChunk': new TextChunkCreator()
};

export class Model extends RDFModel {
	constructor() { super(registry); }
}

