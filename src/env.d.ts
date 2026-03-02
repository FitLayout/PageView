/// <reference types="vite/client" />

// Declare JS ontology modules as typed objects returning string constants
declare module '*/BOX.js' {
    const BOX: { [key: string]: string };
    export default BOX;
}
declare module '*/SEGM.js' {
    const SEGM: { [key: string]: string };
    export default SEGM;
}
declare module '*/FL.js' {
    const FL: { [key: string]: string };
    export default FL;
}
declare module '*/RDF.js' {
    const RDF: { [key: string]: string };
    export default RDF;
}
declare module '*/RDFS.js' {
    const RDFS: { [key: string]: string };
    export default RDFS;
}
declare module '*/MAPPING.js' {
    const MAPPING: { [key: string]: string };
    export default MAPPING;
}

// Window augmentation for debug helpers
interface Window {
    rdfutil: any;
}
