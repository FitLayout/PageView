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

<script>
import MultiSelect from 'primevue/multiselect';
import IriDecoder from '../common/iridecoder.js';
import SEGM from '../ontology/SEGM.js';

// XML namespaces
const SVG = 'http://www.w3.org/2000/svg';
const XLINK = 'http://www.w3.org/1999/xlink';

export default {
	name: 'RelationsDisplay',
	props: {
		pageRectAreas: null,
        artifactModel: null,
        selectedRect: null
	},
	inject: ['apiClient'],
    emits: ['area-click'],
	components: {
        MultiSelect
	},
	data () {
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
		async fetchRelations() {
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

        async updateRelation() {
            this.saveSelectedRelations();
            await this.update();
        },

        clear() {
            let parent = this.$refs['relcanvas'];
            while (parent.firstChild) {
                parent.removeChild(parent.firstChild);
            }

            // The following properties are not listed in component data; vue shouldn't care about them
            this.svgRoot = parent; 
            // create a defs element inside SVG to store shared rectangle definitions
            // https://stackoverflow.com/questions/11404391/invert-svg-clip-show-only-outside-path?rq=3
            this.svgDefs = document.createElementNS(SVG, 'defs');
            this.svgRoot.appendChild(this.svgDefs);

            this.maskCnt = 0;
            this.areaBoxes = []; // generated area box elements
            this.masks = []; // generated mask elements
            this.lineBoxes = []; // generated line elements
        },

        async update() {
            this.buildAreaIndex();
            this.connections = await this.fetchConnections();
            this.redraw();
        },

        async redraw() {
            this.areaRects = {};
            this.clear();
            this.drawConnections();
            this.updateDom();
        },

        areaClicked(area) {
            this.$emit('area-click', area);
        },

        elementHovered(el) {
            if (el.triples) {
                for (let triple of el.triples) {
                    this.highlightElement(triple.r1);
                    this.highlightElement(triple.con);
                    this.highlightElement(triple.r2);
                }
            }
        },

        elementLeft(el) {
            if (el.triples) {
                for (let triple of el.triples) {
                    this.unhighlightElement(triple.r1);
                    this.unhighlightElement(triple.con);
                    this.unhighlightElement(triple.r2);
                }
            }
        },

        highlightElement(el) { 
            el.classList.add('hovered');
        },

        unhighlightElement(el) { 
            el.classList.remove('hovered');
        },

        buildAreaIndex() {
            let index = {};
            if (this.pageRectAreas) {
                for (let area of this.pageRectAreas) {
                    index[area._iri] = area;
                }
            }
            this.areaIndex = index;
        },
        
        // Generates an area ID (for generated rectangles)
        areaId(area) {
            return 'ra' + area.documentOrder; // TODO is document order unique?
        },

        drawAreaByIri(iri) {
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

        drawArea(area) {
            // create a rect definition and store it in SVG defs
            let drect = document.createElementNS(SVG, 'rect');
            drect.setAttribute('x', area.bounds.positionX);
            drect.setAttribute('y', area.bounds.positionY);
            drect.setAttribute('width', area.bounds.width);
            drect.setAttribute('height', area.bounds.height);
            drect.setAttribute('id', this.areaId(area));
            this.svgDefs.appendChild(drect);

            // use the rectangle and draw it
            let rect = document.createElementNS(SVG, 'use');
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
            rect.documentOrder = area.documentOrder; // for further sorting

            this.areaBoxes.push(rect);
            return rect;
        },

        drawConnection(a1, a2, rel) {
            const b1 = a1.bounds;
            const b2 = a2.bounds;
            const x1 = b1.positionX + (b1.width / 2);
            const y1 = b1.positionY + (b1.height / 2);
            const x2 = b2.positionX + (b2.width / 2);
            const y2 = b2.positionY + (b2.height / 2);

            // create a mask for the boxes
            const relId = 'm' + (++this.maskCnt);
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
            this.masks.push(mask);

            // create the line and mask it
            let line = document.createElementNS(SVG, 'line');
            line.setAttribute('x1', x1);
            line.setAttribute('y1', y1);
            line.setAttribute('x2', x2);
            line.setAttribute('y2', y2);
            line.setAttribute('mask', `url(#${relId})`);
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

            this.lineBoxes.push(line);
            return line;
        },

        async fetchConnections() {
            if (this.selectedRelations) {
                let rels = [];
                for (let relType of this.selectedRelations) {
                    let relsForRelType = await this.fetchSingleRelation(relType);
                    rels = rels.concat(relsForRelType);
                }
                return rels;
            } else {
                return [];
            }
        },

        async fetchSingleRelation(relType) {
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

        drawConnections()
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
                        const triple = {r1, con, r2};
                        this.connectionTriples.push(triple);
                        r1.triples.push(triple);
                        r2.triples.push(triple);
                        con.triples.push(triple);
                    }

                    if (a1.bounds.positionX + a1.bounds.width > maxw) {
                        maxw = a1.bounds.positionX + a1.bounds.width;
                    }
                    if (a1.bounds.positionY + a1.bounds.height > maxh) {
                        maxh = a1.bounds.positionY + a1.bounds.height;
                    }
                    if (a2.bounds.positionX + a2.bounds.width > maxw) {
                        maxw = a2.bounds.positionX + a2.bounds.width;
                    }
                    if (a2.bounds.positionY + a2.bounds.height > maxh) {
                        maxh = a2.bounds.positionY + a2.bounds.height;
                    }
                }
            }
            this.canvasWidth = maxw;
            this.canvasHeight = maxh;
        },

        updateDom() {
            // sort area boxes by orderId
            //   to make them properly selectable
            this.areaBoxes.sort((a, b) => {
                return a.documentOrder - b.documentOrder;
            });
            // insert area boxes
            for (let abox of this.areaBoxes) {
                this.svgRoot.appendChild(abox);
            }
            // insert masks and lines
            for (let mask of this.masks) {
                this.svgRoot.appendChild(mask);
            }
            for (let line of this.lineBoxes) {
                this.svgRoot.appendChild(line);
            }
        },

        saveSelectedRelations() {
            window.localStorage.setItem('selectedRelations', JSON.stringify(this.selectedRelations));
        },

        restoreSelectedRelations() {
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
}
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
    stroke-width: 1px;
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
    stroke: red;
}
.relations-display > svg use.hovered, .relations-display > svg line.hovered {
    stroke: #e4002b;
}
.relations-display > svg line {
    stroke: #00ff00;
    stroke-width: 1px;
    fill: none;
    cursor: pointer;
}
</style>
