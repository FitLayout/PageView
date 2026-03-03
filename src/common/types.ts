
/**
 * Base type for all domain objects created from RDF data.
 * Every created object carries its IRI and RDF type, plus dynamically
 * mapped properties whose values are not statically known.
 */
export interface RdfObject {
	_iri: string;
	_type: string;
	[key: string]: unknown;
}

/**
 * A specification of a property mapping from RDF to a domain object.
 */
export interface PropertyDef {
	name: string;
	type: string;
	inverse?: boolean;
}

/**
 * A specification of a mapping from RDF to a domain object.
 */
export type PropertyMap = { [key: string]: PropertyDef };

/**
 * The set of value types that can be produced when mapping an RDF property
 * to a domain object field:
 *   - string | number   – a single scalar value
 *   - (string|number)[] – an array of scalar values
 *   - RdfObject         – a single linked object
 *   - RdfObject[]       – an array of linked objects
 */
export type RdfPropertyValue = string | number | (string | number)[] | RdfObject | RdfObject[];
