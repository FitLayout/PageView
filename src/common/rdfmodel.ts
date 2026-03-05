import {RdfObjectLoader, Resource} from "rdf-object";
import {Parser} from "n3";
import ObjectCreator from './objectcreator';
import type { RdfObject } from './types';

type CreatorRegistry = { [type: string]: ObjectCreator };

/**
 * A RDF model that uses RDF-Object and N3 to load and parse RDF data and provides 
 * an interface for creating and retrieving RDF-backed domain objects.
 */
export default class RDFModel {

    context: { [prefix: string]: string } = {
        "rdf" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
        "rdfs" : "http://www.w3.org/2000/01/rdf-schema#",
        "xsd" : "http://www.w3.org/2001/XMLSchema#",
        "b" : "http://fitlayout.github.io/ontology/render.owl#",
        "a" : "http://fitlayout.github.io/ontology/segmentation.owl#",
        "fl" : "http://fitlayout.github.io/ontology/fitlayout.owl#",
        "r" : "http://fitlayout.github.io/resource/"
    }

    creators: CreatorRegistry;
    loader: RdfObjectLoader;
    //inverse properties to watch separately
    invProperties: { [propIri: string]: string } = {};
    //target objects of inverse properties
    targets: { [objectIri: string]: { [propIri: string]: string[] } } = {};
    //a cache of already created objects
    objects: { [iri: string]: RdfObject } = {};

    constructor(creators: CreatorRegistry) {
        this.creators = creators;
        this.loader = new RdfObjectLoader({ context: this.context });
        //scan for inverse properties
        for (const type in this.creators) {
            const creator = this.creators[type];
            for (const key in creator.propertyMap) {
                if (creator.propertyMap[key].inverse) {
                    const propIri = creator.propertyMap[key].name;
                    this.invProperties[propIri] = type;
                }
            }
        }
    }

    parse(text: string): Promise<void> {
        return new Promise(resolve => {
            const parser = new Parser();
            let quads: any[] = [];
            parser.parse(text, (err: any, quad: any, prefixes: any) => {
                if (quad) {
                    quads.push(quad);
                    //store the sources of inverse properties
                    if (this.invProperties[quad.predicate.id] !== undefined)
                    {
                        this.addTarget(quad.object.id, quad.predicate.id, quad.subject.id);
                    }
                } else if (prefixes) {
                    this.loader.importArray(quads).then(() => { resolve() });
                }
                // errors are silently ignored
            });
        });
    }

    addTarget(objectIri: string, propertyIri: string, subjectIri: string): void {
        let target = this.targets[objectIri];
        if (target === undefined) {
            target = {};
            this.targets[objectIri] = target;
        }
        let property = target[propertyIri];
        if (property === undefined) {
            property = [];
            target[propertyIri] = property;
        }
        property.push(subjectIri);
    }

    async add(quad: any): Promise<void> {
        await this.loader.importArray([quad]);
    }

    getResources(): Record<string, Resource> {
        return this.loader.resources;
    }

    getType(subj: string): string | undefined {
        const type = this.loader.resources[subj].property['rdf:type'];
        if (type && type.value) {
            return type.value;
        } else {
            return undefined;
        }
    }

    /**
     * Infers the concrete type of an object.
     */
    inferObjectType(iri: string, baseType: string): string {
        let type = this.getType(iri); //try to use rdf:type
        if (!type) {
            type = baseType; //no type defined, use the base type
        }
        return type;
    }

    createObject(iri: string, type: string): RdfObject | undefined {
        if (this.objects[iri] === undefined) {
            const finalType = this.inferObjectType(iri, type);
            const creator = this.creators[finalType];
            const resource = this.loader.resources[iri];
            if (creator !== undefined && resource !== undefined) {
                const obj: RdfObject = { _iri: iri, _type: finalType };
                this.objects[iri] = obj;
                creator.create(resource, this, obj);
            }
        }
        return this.objects[iri];
    }

    getObject(iri: string, type: string): RdfObject | undefined {
        return this.createObject(iri, type);
    }

    /**
     * Creates all objects of known types and returns a collection.
     */
    getAllObjects(): RdfObject[] {
        const ret: RdfObject[] = [];
        for (const res in this.getResources()) {
            const rtype = this.getType(res);
            if (rtype) {
                const obj = this.getObject(res, rtype);
                if (obj) {
                    ret.push(obj);
                }
            }
        }
        return ret;
    }

    createInverseObjects(target: string, property: string): RdfObject[] {
        const ret: RdfObject[] = [];
        const t = this.targets[target];
        if (t !== undefined && t[property] !== undefined) {
            for (const subj of t[property]) {
                const type = this.getType(subj);
                if (type) {
                    const obj = this.createObject(subj, type);
                    if (obj) {
                        ret.push(obj);
                    }
                }
            }
        }
        return ret;
    }

}
