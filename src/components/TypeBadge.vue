<template>
	<span :class="typeClass">
		<strong class="badge">{{ typeName }}</strong>
	</span>
</template>

<style>
</style>

<script lang="ts">
import { defineComponent, inject, type PropType } from 'vue';
import BOX from '../ontology/BOX.js';
import SEGM from '../ontology/SEGM.js';

import type { FLApiClient } from '@/common/apiclient.js';

interface ComponentData {
	typeName: string | null;
	typeClass: string | null;
}

export default defineComponent({
	name: 'TypeBadge',
	components: {
	},
	setup() {
		return {
			apiClient: inject('apiClient') as FLApiClient
		}
	},
	props: {
		typeIri: {
			type: String as PropType<string | null>,
			default: null
		}
	},
	data (): ComponentData {
		return {
			typeName: null,
			typeClass: null
		}
	},
	created () {
		this.update();
	},
	methods: {
		update(): void {
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
