<template>
	<span :class="typeClass">
		<strong class="badge">{{ typeName }}</strong>
	</span>
</template>

<style>
</style>

<script lang="ts">
import { defineComponent } from 'vue';
import BOX from '../ontology/BOX.js';
import SEGM from '../ontology/SEGM.js';

export default defineComponent({
	name: 'TypeBadge',
	components: {
	},
	inject: ['apiClient'],
	props: {
		typeIri: null
	},
	data () {
		return {
			typeName: null,
			typeClass: null
		}
	},
	created () {
		this.update();
	},
	methods: {
		update() {
			//console.log(this.artifact);
			switch (this.typeIri) {
				case BOX.Page:
					this.typeName = 'Page';
					this.typeClass = 'boxtree';
					break;
				case SEGM.AreaTree:
					this.typeName = 'Area Tree';
					this.typeClass = 'areatree';
					break;
				case SEGM.ChunkSet:
					this.typeName = 'Chunk Set';
					this.typeClass = 'chunkset';
					break;
				default:
					this.type = 'unknown';
					this.typeClass = 'unknown';
					break;
			}
		},

	}
})
</script>
