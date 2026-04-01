import { IriDecoder } from '@/rdf4j-vue-components/src';

export default class FLIriDecoder extends IriDecoder {

    constructor() {
        super({
            b: 'http://fitlayout.github.io/ontology/render.owl#',
            a: 'http://fitlayout.github.io/ontology/segmentation.owl#',
            fl: 'http://fitlayout.github.io/ontology/fitlayout.owl#',
            r: 'http://fitlayout.github.io/resource/'
        });
    }

}
