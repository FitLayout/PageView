const NAMESPACE = 'http://www.w3.org/2000/01/rdf-schema#';

const RDFS = {

	NAMESPACE: 'http://www.w3.org/2000/01/rdf-schema#',

	PREFIX: 'rdfs',

	RESOURCE: NAMESPACE + 'Resource',
	LITERAL: NAMESPACE + 'Literal',
	CLASS: NAMESPACE + 'Class',
	SUBCLASSOF: NAMESPACE + 'subClassOf',
	SUBPROPERTYOF: NAMESPACE + 'subPropertyOf',
	DOMAIN: NAMESPACE + 'domain',
	RANGE: NAMESPACE + 'range',
	COMMENT: NAMESPACE + 'comment',
	LABEL: NAMESPACE + 'label',
	DATATYPE: NAMESPACE + 'Datatype',
	CONTAINER: NAMESPACE + 'Container',
	MEMBER: NAMESPACE + 'member',
	ISDEFINEDBY: NAMESPACE + 'isDefinedBy',
	SEEALSO: NAMESPACE + 'seeAlso',
	CONTAINERMEMBERSHIPPROPERTY: NAMESPACE + 'ContainerMembershipProperty'
}

export default RDFS;
