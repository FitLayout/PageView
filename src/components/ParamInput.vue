<template>
	<div :class="paramClass" class="param-field">
		<div v-if="descr.type=='string'" class="field">
			<label :for="inputId" >{{descr.name}}</label>
			<InputText type="text" :id="inputId" :placeholder="descr.name"
				:minlength="descr.minLength" :data-maxlength="descr.maxLength"
				v-bind:modelValue="modelValue" 
				v-tooltip="paramDescription"
				@update:modelValue="$emit('update:modelValue', $event)" />
		</div>
		<div v-if="descr.type=='int'" class="field">
			<label :for="inputId" >{{descr.name}}</label>
			<InputNumber mode="decimal" showButtons :id="inputId"
				:min="descr.minValue" :max="descr.maxValue"
				v-bind:modelValue="modelValue" 
				v-tooltip="paramDescription"
				@update:modelValue="$emit('update:modelValue', $event)" />
		</div>
		<div v-if="descr.type=='float'" class="field">
			<label :for="inputId" >{{descr.name}}</label>
			<InputNumber mode="decimal" showButtons :minFractionDigits="2" :maxFractionDigits="2" :id="inputId"
				:min="descr.minValue" :max="descr.maxValue" :step="0.2"
				v-bind:modelValue="modelValue" 
				v-tooltip="paramDescription"
				@update:modelValue="$emit('update:modelValue', $event)" />
		</div>
		<div v-if="descr.type=='boolean'" class="field-checkbox">
			<Checkbox :binary="true" :id="inputId"
				v-bind:modelValue="modelValue" 
				v-tooltip="paramDescription"
				@update:modelValue="$emit('update:modelValue', $event)" />
			<label :for="inputId" class="form-check-label" v-tooltip="paramDescription">{{descr.name}}</label>
		</div>
	</div>
</template>

<script>
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Checkbox from 'primevue/checkbox';


export default {
	name: 'ParamInput',
	components: {
		InputText,
		InputNumber,
		Checkbox
	},
	props: {
		descr: null,
		modelValue: null
	},
	data () {
		return {
		}
	},
	computed: {
		inputId() {
			return 'P' + this.descr.name;
		},
		paramClass() {
			return 'p-' + this.descr.type;
		},
		paramDescription() {
			return this.descr.description || '';
		}
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
.p-int, .p-float, .p-boolean, .p-string {
	display: inline-block;
	vertical-align: bottom;
}
.p-string {
	width: 25em;
	margin-right: 0.5em;
}
.p-int, .p-float {
	width: 6em;
	margin-right: 0.5em;
}
.p-boolean label {
	margin-right: 0.5em;
}
.param-field .field > label {
	word-break: break-all;
	overflow-wrap: anywhere;
}
</style>
