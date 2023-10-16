const NAMESPACE = 'http://fitlayout.github.io/ontology/segmentation.owl#';

/**
 * Visual Area Ontology.
 * <p>
 * Document visual area (segmentation) ontology..
 * <p>
 * Namespace SEGM.
 * Prefix: {@code <http://fitlayout.github.io/ontology/segmentation.owl#>}
 */
const SEGM = {

	NAMESPACE: 'http://fitlayout.github.io/ontology/segmentation.owl#',

	PREFIX: 'segm',

	/**
	 * Area
	 * http://fitlayout.github.io/ontology/segmentation.owl#Area
	 * A visual area within the page. The areas can be nested an together
	 * they form an AreaTree.
	 */
	Area: NAMESPACE + 'Area',

	/**
	 * AreaTree
	 * http://fitlayout.github.io/ontology/segmentation.owl#AreaTree
	 * A tree of visual areas created from a rendered page by page
	 * segmentation.
	 */
	AreaTree: NAMESPACE + 'AreaTree',

	/**
	 * belongsTo
	 * http://fitlayout.github.io/ontology/segmentation.owl#belongsTo
	 * Assigns an AreaTree to an Area.
	 */
	belongsTo: NAMESPACE + 'belongsTo',

	/**
	 * belongsToChunkSet
	 * http://fitlayout.github.io/ontology/segmentation.owl#belongsToChunkSet
	 * Assigns a ChunkSet to a TextChunk.
	 */
	belongsToChunkSet: NAMESPACE + 'belongsToChunkSet',

	/**
	 * belongsToLogicalTree
	 * http://fitlayout.github.io/ontology/segmentation.owl#belongsToLogicalTree
	 * Assigns the owning LogicalAreaTree to a LogicalArea.
	 */
	belongsToLogicalTree: NAMESPACE + 'belongsToLogicalTree',

	/**
	 * ChunkSet
	 * http://fitlayout.github.io/ontology/segmentation.owl#ChunkSet
	 * A set of text chunks extreacted from a source page.
	 */
	ChunkSet: NAMESPACE + 'ChunkSet',

	/**
	 * containsArea
	 * http://fitlayout.github.io/ontology/segmentation.owl#containsArea
	 */
	containsArea: NAMESPACE + 'containsArea',

	/**
	 * containsBox
	 * http://fitlayout.github.io/ontology/segmentation.owl#containsBox
	 */
	containsBox: NAMESPACE + 'containsBox',

	/**
	 * hasAreaTree
	 * http://fitlayout.github.io/ontology/segmentation.owl#hasAreaTree
	 */
	hasAreaTree: NAMESPACE + 'hasAreaTree',

	/**
	 * hasRelatedRect
	 * http://fitlayout.github.io/ontology/segmentation.owl#hasRelatedRect
	 * Defines a related Area or TextChunk for a relation description
	 */
	hasRelatedRect: NAMESPACE + 'hasRelatedRect',

	/**
	 * hasRelationType
	 * http://fitlayout.github.io/ontology/segmentation.owl#hasRelationType
	 * Assigns a relation type to a relation description
	 */
	hasRelationType: NAMESPACE + 'hasRelationType',

	/**
	 * hasSourceArea
	 * http://fitlayout.github.io/ontology/segmentation.owl#hasSourceArea
	 */
	hasSourceArea: NAMESPACE + 'hasSourceArea',

	/**
	 * hasSourceBox
	 * http://fitlayout.github.io/ontology/segmentation.owl#hasSourceBox
	 */
	hasSourceBox: NAMESPACE + 'hasSourceBox',

	/**
	 * hasSourcePage
	 * http://fitlayout.github.io/ontology/segmentation.owl#hasSourcePage
	 */
	hasSourcePage: NAMESPACE + 'hasSourcePage',

	/**
	 * hasTag
	 * http://fitlayout.github.io/ontology/segmentation.owl#hasTag
	 */
	hasTag: NAMESPACE + 'hasTag',

	/**
	 * isChildOf
	 * http://fitlayout.github.io/ontology/segmentation.owl#isChildOf
	 */
	isChildOf: NAMESPACE + 'isChildOf',

	/**
	 * isInRelation
	 * http://fitlayout.github.io/ontology/segmentation.owl#isInRelation
	 * Assigns an Area or TextChunk a description of a relation with another
	 * Area or TextChunk
	 */
	isInRelation: NAMESPACE + 'isInRelation',

	/**
	 * isSubordinateTo
	 * http://fitlayout.github.io/ontology/segmentation.owl#isSubordinateTo
	 */
	isSubordinateTo: NAMESPACE + 'isSubordinateTo',

	/**
	 * LogicalArea
	 * http://fitlayout.github.io/ontology/segmentation.owl#LogicalArea
	 * Logical area represents a set of areas that form a single semantic
	 * entity. Logical areas are organized in a tree where the parent-child
	 * relationships have some semantic meaning instead of representing the
	 * actual layout.
	 */
	LogicalArea: NAMESPACE + 'LogicalArea',

	/**
	 * LogicalAreaTree
	 * http://fitlayout.github.io/ontology/segmentation.owl#LogicalAreaTree
	 * A tree of logical areas created from an area tree by some kind of
	 * logical structure analysis.
	 */
	LogicalAreaTree: NAMESPACE + 'LogicalAreaTree',

	/**
	 * name
	 * http://fitlayout.github.io/ontology/segmentation.owl#name
	 * Assigned area name
	 */
	name: NAMESPACE + 'name',

	/**
	 * RelationDescription
	 * http://fitlayout.github.io/ontology/segmentation.owl#RelationDescription
	 * Describes a relation between two Areas or TextChunks
	 */
	RelationDescription: NAMESPACE + 'RelationDescription',

	/**
	 * support
	 * http://fitlayout.github.io/ontology/segmentation.owl#support
	 */
	support: NAMESPACE + 'support',

	/**
	 * Tag
	 * http://fitlayout.github.io/ontology/segmentation.owl#Tag
	 */
	Tag: NAMESPACE + 'Tag',

	/**
	 * tagger
	 * http://fitlayout.github.io/ontology/segmentation.owl#tagger
	 * Assigns a tagger to a tag
	 */
	tagger: NAMESPACE + 'tagger',

	/**
	 * tagSupport
	 * http://fitlayout.github.io/ontology/segmentation.owl#tagSupport
	 * Assigns a node that refers to a tag and the assigned support.
	 */
	tagSupport: NAMESPACE + 'tagSupport',

	/**
	 * text
	 * http://fitlayout.github.io/ontology/segmentation.owl#text
	 */
	text: NAMESPACE + 'text',

	/**
	 * TextChunk
	 * http://fitlayout.github.io/ontology/segmentation.owl#TextChunk
	 * A connected piece of a document text that forms a rectangular area in
	 * the page.
	 */
	TextChunk: NAMESPACE + 'TextChunk',

	/**
	 * type
	 * http://fitlayout.github.io/ontology/segmentation.owl#type
	 */
	type: NAMESPACE + 'type'

}

export default SEGM;
