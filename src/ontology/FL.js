const NAMESPACE = 'http://fitlayout.github.io/ontology/fitlayout.owl#';

/**
 * FitLayout Core Ontology.
 * <p>
 * FITLayout shared types and properties..
 * <p>
 * Namespace FL.
 * Prefix: {@code <http://fitlayout.github.io/ontology/fitlayout.owl#>}
 */
const FL = {

	NAMESPACE: 'http://fitlayout.github.io/ontology/fitlayout.owl#',

	PREFIX: 'fl',

	/**
	 * Artifact
	 * http://fitlayout.github.io/ontology/fitlayout.owl#Artifact
	 * An artifact created during the page processing
	 */
	Artifact: NAMESPACE + 'Artifact',

	/**
	 * createdOn
	 * http://fitlayout.github.io/ontology/fitlayout.owl#createdOn
	 * Creation date/time for an artifact or page set
	 */
	createdOn: NAMESPACE + 'createdOn',

	/**
	 * creator
	 * http://fitlayout.github.io/ontology/fitlayout.owl#creator
	 * An identification of the service that created an artifact.
	 */
	creator: NAMESPACE + 'creator',

	/**
	 * creatorParams
	 * http://fitlayout.github.io/ontology/fitlayout.owl#creatorParams
	 * Parametres of the service used for creating an artifact.
	 */
	creatorParams: NAMESPACE + 'creatorParams',

	/**
	 * hasParentArtifact
	 * http://fitlayout.github.io/ontology/fitlayout.owl#hasParentArtifact
	 * Assigns a parent artifact to another artifact.
	 */
	hasParentArtifact: NAMESPACE + 'hasParentArtifact',

	/**
	 * param
	 * http://fitlayout.github.io/ontology/fitlayout.owl#param
	 * Service parameter value definition.
	 */
	param: NAMESPACE + 'param',

	/**
	 * paramName
	 * http://fitlayout.github.io/ontology/fitlayout.owl#paramName
	 * Parameter name
	 */
	paramName: NAMESPACE + 'paramName',

	/**
	 * paramValue
	 * http://fitlayout.github.io/ontology/fitlayout.owl#paramValue
	 * Parameter value.
	 */
	paramValue: NAMESPACE + 'paramValue',

	/**
	 * service
	 * http://fitlayout.github.io/ontology/fitlayout.owl#service
	 * A service ID definition
	 */
	service: NAMESPACE + 'service',

	/**
	 * Tagger
	 * http://fitlayout.github.io/ontology/fitlayout.owl#Tagger
	 * A tagger that is able to assign tags to content rectangles.
	 */
	Tagger: NAMESPACE + 'Tagger'

}

export default FL;
