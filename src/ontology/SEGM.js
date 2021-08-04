const NAMESPACE = 'http://fitlayout.github.io/ontology/segmentation.owl#';

/**
 * Document Visual Area Ontology.
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
	 * http://fitlayout.github.io/ontology/segmentation.owl#Area
	 * A visual area within the page. The areas can be nested an together
	 * they form an AreaTree.
	 */
	Area: NAMESPACE + 'Area',

	/**
	 * http://fitlayout.github.io/ontology/segmentation.owl#AreaTree
	 * A tree of visual areas created from a rendered page by page
	 * segmentation.
	 */
	AreaTree: NAMESPACE + 'AreaTree',

	/**
	 * http://fitlayout.github.io/ontology/segmentation.owl#belongsTo
	 */
	belongsTo: NAMESPACE + 'belongsTo',

	/**
	 * http://fitlayout.github.io/ontology/segmentation.owl#belongsToChunkSet
	 */
	belongsToChunkSet: NAMESPACE + 'belongsToChunkSet',

	/**
	 * http://fitlayout.github.io/ontology/segmentation.owl#ChunkSet
	 * A set of text chunks extreacted from a source page.
	 */
	ChunkSet: NAMESPACE + 'ChunkSet',

	/**
	 * http://fitlayout.github.io/ontology/segmentation.owl#containsArea
	 */
	containsArea: NAMESPACE + 'containsArea',

	/**
	 * http://fitlayout.github.io/ontology/segmentation.owl#containsBox
	 */
	containsBox: NAMESPACE + 'containsBox',

	/**
	 * http://fitlayout.github.io/ontology/segmentation.owl#contentLength
	 * The number of content elements used to compute the style statistics
	 * such as average font weight.
	 */
	contentLength: NAMESPACE + 'contentLength',

	/**
	 * http://fitlayout.github.io/ontology/segmentation.owl#hasAreaTree
	 */
	hasAreaTree: NAMESPACE + 'hasAreaTree',

	/**
	 * http://fitlayout.github.io/ontology/segmentation.owl#hasSourceArea
	 */
	hasSourceArea: NAMESPACE + 'hasSourceArea',

	/**
	 * http://fitlayout.github.io/ontology/segmentation.owl#hasSourceBox
	 */
	hasSourceBox: NAMESPACE + 'hasSourceBox',

	/**
	 * http://fitlayout.github.io/ontology/segmentation.owl#hasSourcePage
	 */
	hasSourcePage: NAMESPACE + 'hasSourcePage',

	/**
	 * http://fitlayout.github.io/ontology/segmentation.owl#hasTag
	 */
	hasTag: NAMESPACE + 'hasTag',

	/**
	 * http://fitlayout.github.io/ontology/segmentation.owl#isChildOf
	 */
	isChildOf: NAMESPACE + 'isChildOf',

	/**
	 * http://fitlayout.github.io/ontology/segmentation.owl#isSubordinateTo
	 */
	isSubordinateTo: NAMESPACE + 'isSubordinateTo',

	/**
	 * http://fitlayout.github.io/ontology/segmentation.owl#LogicalArea
	 * Logical area represents a set of areas that form a single semantic
	 * entity. Logical areas are organized in a tree where the parent-child
	 * relationships have some semantic meaning instead of representing the
	 * actual layout.
	 */
	LogicalArea: NAMESPACE + 'LogicalArea',

	/**
	 * http://fitlayout.github.io/ontology/segmentation.owl#LogicalAreaTree
	 * A tree of logical areas created from an area tree by some kind of
	 * logical structure analysis.
	 */
	LogicalAreaTree: NAMESPACE + 'LogicalAreaTree',

	/**
	 * http://fitlayout.github.io/ontology/segmentation.owl#name
	 * Assigned area name
	 */
	name: NAMESPACE + 'name',

	/**
	 * http://fitlayout.github.io/ontology/segmentation.owl#support
	 */
	support: NAMESPACE + 'support',

	/**
	 * http://fitlayout.github.io/ontology/segmentation.owl#Tag
	 */
	Tag: NAMESPACE + 'Tag',

	/**
	 * http://fitlayout.github.io/ontology/segmentation.owl#tagSupport
	 */
	tagSupport: NAMESPACE + 'tagSupport',

	/**
	 * http://fitlayout.github.io/ontology/segmentation.owl#text
	 */
	text: NAMESPACE + 'text',

	/**
	 * http://fitlayout.github.io/ontology/segmentation.owl#TextChunk
	 * A connected piece of a document text that forms a rectangular area in
	 * the page.
	 */
	TextChunk: NAMESPACE + 'TextChunk',

	/**
	 * http://fitlayout.github.io/ontology/segmentation.owl#type
	 */
	type: NAMESPACE + 'type'

}

export default SEGM;
