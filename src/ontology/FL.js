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
	hasParentArtifact: NAMESPACE + 'hasParentArtifact'

}

export default FL;
