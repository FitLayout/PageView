<template>
	<div class="param-panel container">
		<ParamInput v-for="param in descr" :descr="param" :key="param.name" v-model="values[param.name]"></ParamInput>
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
		}
	},
	computed: {
	},
	created () {
	},
	watch: {
	},
	methods: {
	}
}
</script>

<style>
</style>
