<template>
	<div class="relations-display">
        <div class="floatRow">				
            <div class="floatBlock">
                <Dropdown v-model="selectedRelation" :options="relations" optionLabel="name" optionValue="iri" placeholder="Select relation" :show-clear="true"></Dropdown>
            </div>
        </div>
        <svg ref="relcanvas" xmlns="http://www.w3.org/2000/svg" :width="canvasWidth" :height="canvasHeight">
        </svg>
	</div>
</template>

<script>
import Dropdown from 'primevue/dropdown';

export default {
	name: 'RelationsDisplay',
	props: {
		pageRectAreas: null,
	},
	inject:['apiClient'],
	components: {
        Dropdown
	},
	data () {
		return {
            relations: [
                { name: 'New York', iri: 'NY' },
            ],
            selectedRelation: null,
            canvasWidth: 0,
            canvasHeight: 0
		}
	},
	mounted () {
		this.fetchRelations();
        this.drawAreas();
	},
	watch: {
		'pageRectAreas': 'drawAreas'
	},
	methods: {
		async fetchRelations() {
			//this.tags = await this.apiClient.getTags();
		},

        drawAreas() {
            let maxw = 0;
            let maxh = 0;
            if (this.pageRectAreas) {
                for (let area of this.pageRectAreas) {
                    console.log(area);
                    let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                    rect.setAttribute('x', area.bounds.positionX);
                    rect.setAttribute('y', area.bounds.positionY);
                    rect.setAttribute('width', area.bounds.width);
                    rect.setAttribute('height', area.bounds.height);
                    rect.setAttribute('style', 'stroke:#00ff00; fill: none;');
                    this.$refs['relcanvas'].appendChild(rect);

                    if (area.bounds.positionX + area.bounds.width > maxw) {
                        maxw = area.bounds.positionX + area.bounds.width;
                    }
                    if (area.bounds.positionY + area.bounds.height > maxh) {
                        maxh = area.bounds.positionY + area.bounds.height;
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
    z-index: 1000;
}
.relations-display > svg {
    position: absolute; 
    width: auto;
    height: auto;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
}
</style>
