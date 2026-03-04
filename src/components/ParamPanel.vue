<template>
	<div class="param-panel formgroup-inline">
		<ParamInput v-for="param in descr" :descr="param" :key="param.name" v-model="curValues[param.name]"></ParamInput>
	</div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import ParamInput from './ParamInput.vue';
import type { ParamDescr } from '@/common/types';

interface ComponentData {
	curValues: any;
}

export default defineComponent({
	name: 'ParamPanel',
	components: {
		ParamInput
	},
	props: {
		descr: {
			type: Array as PropType<ParamDescr[] | null>,
			default: null
		},
		values: {
			type: Object as PropType<Record<string, string | number | boolean> | null>,
			default: null
		}
	},
	data (): ComponentData {
		return {
			curValues: []
		}
	},
	computed: {
	},
	created () {
		this.curValues = this.values;
	},
	watch: {
		'descr': 'update'
	},
	methods: {
		update() {
			this.curValues = this.values;
		}
	}
})
</script>

<style>
/*.param-panel {
	margin: 0;
}*/
</style>
