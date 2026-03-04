import type { RdfValueBinding } from '@/rdf4j-vue-components/src/common/types';

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

/**
 * Current display status passed to ObjectResolver to enable artifact caching.
 */
export interface ResolverStatus {
	pageIri: string;
	reloadArtifact: boolean;
	page: RdfObject;
	artifactIri: string;
	artifact: RdfObject;
}

/** Rectangle type discriminator for visualization. */
export type RectangleType = 'box' | 'area' | 'textChunk';

/**
 * Result of ObjectResolver.resolveObjectIRI(). A discriminated union on the 'type' field.
 * The 'unknown' variant lacks rectangle/page context; all other variants carry full display data.
 */
export type ResolvedObject =
	| {
		type: 'page' | 'areaTree' | 'chunkSet' | 'box' | 'area' | 'textChunk';
		description: RdfValueBinding[];
		rectangleType: RectangleType;
		artifactIri: string;
		artifact: RdfObject;
		pageIri: string;
		page: RdfObject;
		rectangles: RdfObject[];
	  }
	| {
		type: 'unknown';
		description: RdfValueBinding[];
		objData: unknown;
		artifactIri: string;
		artifact: RdfObject;
	  };
