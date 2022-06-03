const NAMESPACE = 'http://fitlayout.github.io/ontology/mapping.owl#';

/**
 * Visual area to entity mapping ontology.
 * <p>
 * An ontology for mapping visual areas to ontological instances and
 * properties..
 * <p>
 * Namespace MAPPING.
 * Prefix: {@code <http://fitlayout.github.io/ontology/mapping.owl#>}
 */
const MAPPING = {

	NAMESPACE: 'http://fitlayout.github.io/ontology/mapping.owl#',

	PREFIX: 'mapping',

	/**
	 * http://fitlayout.github.io/ontology/mapping.owl#describesInstance
	 * Assigns an individual to the visual area that the area describes.
	 */
	describesInstance: NAMESPACE + 'describesInstance',

	/**
	 * http://fitlayout.github.io/ontology/mapping.owl#isValueOf
	 * Assigns an ontological property to the area whose value the area
	 * represents.
	 */
	isValueOf: NAMESPACE + 'isValueOf'

}

export default MAPPING;
