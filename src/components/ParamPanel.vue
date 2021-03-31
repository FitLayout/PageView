<template>
	<div class="param-panel p-fluid">
		<ParamInput v-for="param in descr" :descr="param" :key="param.name" v-model="curValues[param.name]"></ParamInput>
	</div>
</template>

<script>
import ParamInput from './ParamInput.vue';

export default {
	name: 'ParamPanel',
	components: {
		ParamInput
	},
	props: {
		descr: null,
		values: null
	},
	data () {
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
}
</script>

<style>
/*.param-panel {
	margin: 0;
}*/
</style>
