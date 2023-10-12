<template>
	<div class="relations-display">
        <div class="floatRow">				
            <div class="floatBlock">
                <Dropdown v-model="selectedRelation" :options="relations" optionLabel="name" optionValue="iri" 
                    placeholder="Select relation" :show-clear="true"
                    @change="updateRelation"></Dropdown>
            </div>
        </div>
        <svg ref="relcanvas" xmlns="http://www.w3.org/2000/svg" :width="canvasWidth" :height="canvasHeight">
        </svg>
	</div>
</template>

<script>
import Dropdown from 'primevue/dropdown';
import IriDecoder from '../common/iridecoder.js';
import SEGM from '../ontology/SEGM.js';

export default {
	name: 'RelationsDisplay',
	props: {
		pageRectAreas: null,
        artifactModel: null,
        selectedRect: null
	},
	inject:['apiClient'],
	components: {
        Dropdown
	},
	data () {
		return {
            relations: [], // considered relations
            selectedRelation: null,
            areaIndex: {}, // index of all areas
            areaRects: {}, // index of svg rects generated for the highlighted areas
            connections: [],
            canvasWidth: 0,
            canvasHeight: 0
		}
	},
    async created() {
		await this.fetchRelations();
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
                `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
                PREFIX segm: <http://fitlayout.github.io/ontology/segmentation.owl#>
                SELECT DISTINCT ?p WHERE {
                    ?a <${belongsRel}> <${artifactIri}> .
                    ?b <${belongsRel}> <${artifactIri}> .
                    ?a ?p ?b
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
            await this.update();
        },

        clear() {
            let parent = this.$refs['relcanvas'];
            while (parent.firstChild) {
                parent.removeChild(parent.firstChild);
            }
        },

        async update() {
            this.buildAreaIndex();
            this.areaRects = {};
            this.clear();
            this.connections = await this.fetchConnections();
            this.drawConnections();
        },

        async redraw() {
            this.areaRects = {};
            this.clear();
            this.drawConnections();
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
            let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('x', area.bounds.positionX);
            rect.setAttribute('y', area.bounds.positionY);
            rect.setAttribute('width', area.bounds.width);
            rect.setAttribute('height', area.bounds.height);
            this.$refs['relcanvas'].appendChild(rect);
            return rect;
        },

        drawConnection(a1, a2) {
            const b1 = a1.bounds;
            const b2 = a2.bounds;
            const x1 = b1.positionX + (b1.width / 2);
            const y1 = b1.positionY + (b1.height / 2);
            const x2 = b2.positionX + (b2.width / 2);
            const y2 = b2.positionY + (b2.height / 2);

            let line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', x1);
            line.setAttribute('y1', y1);
            line.setAttribute('x2', x2);
            line.setAttribute('y2', y2);
            this.$refs['relcanvas'].appendChild(line);
            return line;
        },

        async fetchConnections() {
            if (this.selectedRelation) {
                const artifactIri = this.artifactModel._iri;
                const belongsRel = (this.artifactModel._type === SEGM.ChunkSet) ? SEGM.belongsToChunkSet : SEGM.belongsTo;
                const query = `PREFIX r: <http://fitlayout.github.io/resource/>
                    SELECT DISTINCT ?a ?b WHERE {
                        ?a <${belongsRel}> <${artifactIri}> .
                        ?b <${belongsRel}> <${artifactIri}> .
                        ?a <${this.selectedRelation}> ?b
                    }`;
                let resp = await this.apiClient.selectQuery(query);
                let rels = [];
                if (resp && resp.results && resp.results.bindings) {
                    for (let binding of resp.results.bindings) {
                        const a1 = binding.a.value;
                        const a2 = binding.b.value;
                        rels.push({a1, a2});
                    }
                }
                return rels;
            } else {
                return [];
            }
        },

        drawConnections()
        {
            console.log(this.selectedRect);
            let maxw = 0;
            let maxh = 0;
            if (this.connections) {
                for (let rel of this.connections) {
                    const iri1 = rel.a1;
                    const iri2 = rel.a2;
                    const a1 = this.areaIndex[iri1];
                    const a2 = this.areaIndex[iri2];

                    this.drawAreaByIri(iri1);
                    this.drawAreaByIri(iri2);

                    if (!this.selectedRect || iri2 === this.selectedRect._iri) { // if a rect is selected, use only relations that include that box
                        this.drawConnection(a1, a2);
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
.relations-display > svg rect {
    stroke: #00ff00;
    stroke-width: 1px;
    fill: none;
    cursor: pointer;
}
.relations-display > svg rect:hover {
    stroke: red;
}
.relations-display > svg line {
    stroke: #00ff00;
    stroke-width: 1px;
    fill: none;
    cursor: pointer;
}
</style>
