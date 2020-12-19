const NAMESPACE = 'http://fitlayout.github.io/ontology/segmentation.owl#';

/**
 * Namespace SEGM.
 * Prefix: {@code <http://fitlayout.github.io/ontology/segmentation.owl#>}
 */
const SEGM = {

	NAMESPACE: 'http://fitlayout.github.io/ontology/segmentation.owl#',

	PREFIX: 'segm',

	/**
	 * http://fitlayout.github.io/ontology/segmentation.owl#Area
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
	 * http://fitlayout.github.io/ontology/segmentation.owl#containsArea
	 */
	containsArea: NAMESPACE + 'containsArea',

	/**
	 * http://fitlayout.github.io/ontology/segmentation.owl#containsBox
	 */
	containsBox: NAMESPACE + 'containsBox',

	/**
	 * http://fitlayout.github.io/ontology/segmentation.owl#hasAreaTree
	 */
	hasAreaTree: NAMESPACE + 'hasAreaTree',

	/**
	 * http://fitlayout.github.io/ontology/segmentation.owl#hasContentLength
	 * The number of content elements used to compute the style statistics
	 * such as average font weight.
	 */
	hasContentLength: NAMESPACE + 'hasContentLength',

	/**
	 * http://fitlayout.github.io/ontology/segmentation.owl#hasName
	 */
	hasName: NAMESPACE + 'hasName',

	/**
	 * http://fitlayout.github.io/ontology/segmentation.owl#hasSourcePage
	 */
	hasSourcePage: NAMESPACE + 'hasSourcePage',

	/**
	 * http://fitlayout.github.io/ontology/segmentation.owl#hasTag
	 */
	hasTag: NAMESPACE + 'hasTag',

	/**
	 * http://fitlayout.github.io/ontology/segmentation.owl#hasText
	 */
	hasText: NAMESPACE + 'hasText',

	/**
	 * http://fitlayout.github.io/ontology/segmentation.owl#hasType
	 */
	hasType: NAMESPACE + 'hasType',

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
	tagSupport: NAMESPACE + 'tagSupport'

}

export default SEGM;
