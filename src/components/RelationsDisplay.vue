<template>
    <div class="relations-display">
        <div class="floatRow">				
            <div class="floatBlock">
                <MultiSelect v-model="selectedRelations" :options="relations" optionLabel="name" optionValue="iri" 
                    placeholder="Select relation" :show-clear="true"
                    @change="updateRelation"></MultiSelect>
            </div>
        </div>
        <svg ref="relcanvas" xmlns="http://www.w3.org/2000/svg" :width="canvasWidth" :height="canvasHeight">
        </svg>
    </div>
</template>

<script lang="ts">
import { defineComponent, inject, type PropType } from 'vue';
import MultiSelect from 'primevue/multiselect';
import { IriDecoder } from '@/rdf4j-vue-components/src';
import SEGM from '../ontology/SEGM.js';
import type { FLApiClient } from '@/common/apiclient.js';
import type { RdfObject } from '@/common/types';

// XML namespaces
const SVG = 'http://www.w3.org/2000/svg';
const XLINK = 'http://www.w3.org/1999/xlink';

interface RelationInfo {
    name: string;
    iri: string;
}

interface Connection {
    a1: string;  // IRI of first area
    a2: string;  // IRI of second area
    w: string;   // weight/support value
    type: string; // relation type IRI
}

type SvgTripleElement = SVGElement & { triples: ConnectionTriple[]; documentOrder?: number };

interface ConnectionTriple {
    r1: SvgTripleElement;
    con: SvgTripleElement;
    r2: SvgTripleElement;
}

interface ComponentData {
    relations: RelationInfo[];
    selectedRelations: string[] | null;
    areaIndex: Record<string, RdfObject>;
    areaRects: Record<string, SvgTripleElement>;
    connections: Connection[];
    connectionTriples: ConnectionTriple[];
    canvasWidth: number;
    canvasHeight: number;
}

export default defineComponent({
    name: 'RelationsDisplay',
    props: {
        pageRectAreas: {
            type: Array as PropType<RdfObject[] | null>,
            default: null
        },
        artifactModel: {
            type: Object as PropType<RdfObject | null>,
            default: null
        },
        selectedRect: {
            type: Object as PropType<RdfObject | null>,
            default: null
        }
    },
    setup() {
        return {
            apiClient: inject('apiClient') as FLApiClient
        }
    },
    emits: ['area-click'],
    components: {
        MultiSelect
    },
    data (): ComponentData {
        return {
            relations: [], // considered relations
            selectedRelations: null,
            areaIndex: {}, // index of all areas
            areaRects: {}, // index of svg rects generated for the highlighted areas
            connections: [],
            connectionTriples: [], // triples of the generated area-connection-area SVG boxes
            canvasWidth: 0,
            canvasHeight: 0
        }
    },
    async created() {
        await this.fetchRelations();
        if (this.relations.length > 0) {
            this.restoreSelectedRelations();
            await this.update();
        }
    },
    async mounted () {
        await this.update();
    },
    watch: {
        'pageRectAreas': 'update',
        'artifactModel': 'update',
        'selectedRect': 'redraw'
    },
    methods: {
        async fetchRelations(): Promise<void> {
            const artifactIri = this.artifactModel._iri;
            const belongsRel = (this.artifactModel._type === SEGM.ChunkSet) ? SEGM.belongsToChunkSet : SEGM.belongsTo;
            const query =
                `PREFIX segm: <http://fitlayout.github.io/ontology/segmentation.owl#>
                SELECT DISTINCT ?p WHERE {
                    ?a <${belongsRel}> <${artifactIri}> .
                    ?a segm:isInRelation ?d .
                    ?d segm:hasRelationType ?p
                }`;
            let resp = await this.apiClient.selectQuery(query);
            let dec = new IriDecoder();
            let rels = [];
            if (resp && resp.results && resp.results.bindings) {
                for (let binding of resp.results.bindings) {
                    const iri = binding.p.value;
                    const name = dec.encodeIri(iri);
                    rels.push({name, iri});
                }
            }
            this.relations = rels;
        },

        async updateRelation(): Promise<void> {
            this.saveSelectedRelations();
            await this.update();
        },

        clear(): void {
            let parent = this.$refs['relcanvas'] as SVGElement;
            while (parent.firstChild) {
                parent.removeChild(parent.firstChild);
            }

            // The following properties are not listed in component data; vue shouldn't care about them
            (this as any).svgRoot = parent;
            // create a defs element inside SVG to store shared rectangle definitions
            // https://stackoverflow.com/questions/11404391/invert-svg-clip-show-only-outside-path?rq=3
            (this as any).svgDefs = document.createElementNS(SVG, 'defs');
            (this as any).svgRoot.appendChild((this as any).svgDefs);

            (this as any).maskCnt = 0;
            (this as any).areaBoxes = []; // generated area box elements
            (this as any).masks = []; // generated mask elements
            (this as any).lineBoxes = []; // generated line elements
        },

        async update(): Promise<void> {
            this.buildAreaIndex();
            this.connections = await this.fetchConnections();
            this.redraw();
        },

        async redraw(): Promise<void> {
            this.areaRects = {};
            this.clear();
            this.drawConnections();
            this.updateDom();
        },

        areaClicked(area: RdfObject): void {
            this.$emit('area-click', area);
        },

        elementHovered(el: SvgTripleElement): void {
            if (el.triples) {
                for (let triple of el.triples) {
                    this.highlightElement(triple.r1);
                    this.highlightElement(triple.con);
                    this.highlightElement(triple.r2);
                }
            }
        },

        elementLeft(el: SvgTripleElement): void {
            if (el.triples) {
                for (let triple of el.triples) {
                    this.unhighlightElement(triple.r1);
                    this.unhighlightElement(triple.con);
                    this.unhighlightElement(triple.r2);
                }
            }
        },

        highlightElement(el: SVGElement): void {
            el.classList.add('hovered');
        },

        unhighlightElement(el: SVGElement): void {
            el.classList.remove('hovered');
        },

        buildAreaIndex(): void {
            let index: Record<string, RdfObject> = {};
            if (this.pageRectAreas) {
                for (let area of this.pageRectAreas) {
                    index[area._iri] = area;
                }
            }
            this.areaIndex = index;
        },

        // Generates an area ID (for generated rectangles)
        areaId(area: RdfObject): string {
            return 'ra' + area.documentOrder; // TODO is document order unique?
        },

        drawAreaByIri(iri: string): SvgTripleElement | null {
            let area = this.areaIndex[iri];
            if (area) {
                let rect = this.areaRects[iri];
                if (!rect) {
                    rect = this.drawArea(area);
                    this.areaRects[iri] = rect;
                }
                return rect;
            } else {
                return null;
            }
        },

        drawArea(area: RdfObject): SvgTripleElement {
            const bounds = area.bounds as any;
            // create a rect definition and store it in SVG defs
            let drect = document.createElementNS(SVG, 'rect');
            drect.setAttribute('x', bounds.positionX);
            drect.setAttribute('y', bounds.positionY);
            drect.setAttribute('width', bounds.width);
            drect.setAttribute('height', bounds.height);
            drect.setAttribute('id', this.areaId(area));
            (this as any).svgDefs.appendChild(drect);

            // use the rectangle and draw it
            let rect = document.createElementNS(SVG, 'use') as SvgTripleElement;
            rect.setAttributeNS(XLINK, 'href', '#' + this.areaId(area));
            rect.triples = []; // for saving related triples of boxes

            let thisObj = this;
            rect.onclick = () => {
                thisObj.areaClicked(area);
            };
            rect.onmouseover = () => {
                thisObj.elementHovered(rect);
            };
            rect.onmouseout = () => {
                thisObj.elementLeft(rect);
            };
            rect.documentOrder = area.documentOrder as number; // for further sorting

            (this as any).areaBoxes.push(rect);
            return rect;
        },

        drawConnection(a1: RdfObject, a2: RdfObject, rel: Connection): SvgTripleElement {
            const b1 = a1.bounds as any;
            const b2 = a2.bounds as any;
            const x1 = b1.positionX + (b1.width / 2);
            const y1 = b1.positionY + (b1.height / 2);
            const x2 = b2.positionX + (b2.width / 2);
            const y2 = b2.positionY + (b2.height / 2);

            // create a mask for the boxes
            const relId = 'm' + (++(this as any).maskCnt);
            let mask = document.createElementNS(SVG, 'mask');
            mask.setAttribute('id', relId);
            mask.setAttribute('maskUnits', 'userSpaceOnUse');
            let mbgrect = document.createElementNS(SVG, 'rect');
            mbgrect.setAttribute('x', '0');
            mbgrect.setAttribute('y', '0');
            mbgrect.setAttribute('width', '100%');
            mbgrect.setAttribute('height', '100%');
            mbgrect.setAttribute('class', 'fwhite');
            mask.appendChild(mbgrect);
            let muse1 = document.createElementNS(SVG, 'use');
            muse1.setAttributeNS(XLINK, 'href', '#' + this.areaId(a1));
            muse1.setAttribute('class', 'fblack');
            mask.appendChild(muse1);
            let muse2 = document.createElementNS(SVG, 'use');
            muse2.setAttributeNS(XLINK, 'href', '#' + this.areaId(a2));
            muse2.setAttribute('class', 'fblack');
            mask.appendChild(muse2);
            (this as any).masks.push(mask);

            // create the line and mask it
            let line = document.createElementNS(SVG, 'line') as SvgTripleElement;
            line.setAttribute('x1', String(x1));
            line.setAttribute('y1', String(y1));
            line.setAttribute('x2', String(x2));
            line.setAttribute('y2', String(y2));
            line.setAttribute('mask', `url(#${relId})`);
            line.setAttribute('style', 'stroke:' + this.relationColor(rel.type));
            line.triples = [];  // for saving related triples of boxes

            let thisObj = this;
            line.onmouseover = () => {
                thisObj.elementHovered(line);
            };
            line.onmouseout = () => {
                thisObj.elementLeft(line);
            };

            let dec = new IriDecoder();
            let reltype = dec.encodeIri(rel.type);
            let title = document.createElementNS(SVG, 'title');
            title.appendChild(document.createTextNode(reltype + '; w=' + rel.w));
            line.appendChild(title);

            (this as any).lineBoxes.push(line);
            return line;
        },

        async fetchConnections(): Promise<Connection[]> {
            if (this.selectedRelations) {
                let rels: Connection[] = [];
                for (let relType of this.selectedRelations) {
                    let relsForRelType = await this.fetchSingleRelation(relType);
                    rels = rels.concat(relsForRelType);
                }
                return rels;
            } else {
                return [];
            }
        },

        async fetchSingleRelation(relType: string): Promise<Connection[]> {
            const artifactIri = this.artifactModel._iri;
            const belongsRel = (this.artifactModel._type === SEGM.ChunkSet) ? SEGM.belongsToChunkSet : SEGM.belongsTo;
            const query = `PREFIX segm: <http://fitlayout.github.io/ontology/segmentation.owl#>
                SELECT DISTINCT ?a ?b ?w WHERE {
                    ?a <${belongsRel}> <${artifactIri}> .
                    ?a segm:isInRelation ?rel .
                    ?rel segm:hasRelationType <${relType}> .
                    ?rel segm:hasRelatedRect ?b .
                    ?rel segm:support ?w
                }`;
            let resp = await this.apiClient.selectQuery(query);
            let rels = [];
            if (resp && resp.results && resp.results.bindings) {
                for (let binding of resp.results.bindings) {
                    const a1 = binding.a.value;
                    const a2 = binding.b.value;
                    const w = binding.w.value;
                    rels.push({a1, a2, w, type: relType});
                }
            }
            return rels;
        },

        drawConnections(): void
        {
            let maxw = 0;
            let maxh = 0;
            this.connectionTriples = [];
            if (this.connections) {
                for (let rel of this.connections) {
                    const iri1 = rel.a1;
                    const iri2 = rel.a2;
                    const a1 = this.areaIndex[iri1];
                    const a2 = this.areaIndex[iri2];

                    const r1 = this.drawAreaByIri(iri1);
                    const r2 = this.drawAreaByIri(iri2);

                    if (!this.selectedRect || iri1 === this.selectedRect._iri) { // if a rect is selected, use only relations that include that box
                        const con = this.drawConnection(a1, a2, rel);
                        const triple: ConnectionTriple = {r1: r1!, con, r2: r2!};
                        this.connectionTriples.push(triple);
                        r1!.triples.push(triple);
                        r2!.triples.push(triple);
                        con.triples.push(triple);
                    }

                    const b1 = a1.bounds as any;
                    const b2 = a2.bounds as any;
                    if (b1.positionX + b1.width > maxw) {
                        maxw = b1.positionX + b1.width;
                    }
                    if (b1.positionY + b1.height > maxh) {
                        maxh = b1.positionY + b1.height;
                    }
                    if (b2.positionX + b2.width > maxw) {
                        maxw = b2.positionX + b2.width;
                    }
                    if (b2.positionY + b2.height > maxh) {
                        maxh = b2.positionY + b2.height;
                    }
                }
            }
            this.canvasWidth = maxw;
            this.canvasHeight = maxh;
        },

        updateDom(): void {
            const self = this as any;
            // sort area boxes by orderId
            //   to make them properly selectable
            self.areaBoxes.sort((a: SvgTripleElement, b: SvgTripleElement) => {
                return (a.documentOrder ?? 0) - (b.documentOrder ?? 0);
            });
            // insert masks and lines
            for (let mask of self.masks) {
                self.svgRoot.appendChild(mask);
            }
            for (let line of self.lineBoxes) {
                self.svgRoot.appendChild(line);
            }
            // insert area boxes
            for (let abox of self.areaBoxes) {
                self.svgRoot.appendChild(abox);
            }
        },

        relationColor(relIri: string): string {
            //let colors = ['#4CAF50', '#2196F3', '#FFC107', '#9C27B0', '#00BCD4', '#FF9800'];
            //let colors = ['#2196F3', '#FFC107', '#9C27B0', '#00BCD4', '#FF9800', '#795548'];
            let colors = ["#fd7f6f", "#7eb0d5", "#b2e061", "#bd7ebe", "#ffb55a", "#ffee65", "#beb9db", "#fdcce5", "#8bd3c7"];
            let idx = 0;
            for (let rel of this.relations) {
                if (rel.iri === relIri) {
                    return colors[idx % colors.length];
                }
                idx++;
            }
            return colors[idx % colors.length];
        },

        saveSelectedRelations(): void {
            window.localStorage.setItem('selectedRelations', JSON.stringify(this.selectedRelations));
        },

        restoreSelectedRelations(): void {
            const storedRelations = window.localStorage.getItem('selectedRelations');
            if (storedRelations) {
                let toRestore = JSON.parse(storedRelations);
                let restored = [];
                for (let rel of this.relations) {
                    if (toRestore.includes(rel.iri)) {
                        restored.push(rel.iri);
                    }
                }
                this.selectedRelations = restored;
            } else {
                this.selectedRelations = [ this.relations[0].iri ]; // select the first relation as default
            }
        }
    }
})
</script>

<style>
.relations-display {
    position: absolute; 
    width: auto;
    height: auto;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
}
.relations-display .floatRow {
    z-index: 1100;
}
.relations-display > svg {
    position: absolute;
    z-index: 1000;
    width: auto;
    height: auto;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    pointer-events: all;
}
.relations-display > svg rect { /* rectangles in defs that are later used using 'use' */
    stroke: inherit; /* inherit the color from the 'use' element */
    fill: inherit;
}
.relations-display > svg use {
    stroke: #00ff00;
    cursor: pointer;
    fill: none;
}
.relations-display > svg use.fwhite, .relations-display > svg rect.fwhite {
    stroke: none;
    fill: white;
}
.relations-display > svg use.fblack {
    stroke: none;
    fill: black;
}
.relations-display > svg use:hover {
    stroke: red !important;
    stroke-width: 3px !important;
}
.relations-display > svg use.hovered, .relations-display > svg line.hovered {
    stroke: #e4002b !important;
    stroke-width: 3px;
}
.relations-display > svg line {
    stroke: #00ff00;
    stroke-width: 2px;
    fill: none;
    cursor: pointer;
}
</style>
