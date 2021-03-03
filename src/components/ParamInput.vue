<template>
	<div :class="paramClass">
		<div v-if="descr.type=='string'">
			<label :for="inputId" >{{descr.name}}</label>
			<input type="text" v-bind:value="value" :id="inputId" :placeholder="descr.name"
				:minlength="descr.minLength" :maxlength="descr.maxLength" class="form-control"
				v-on:input="$emit('input', $event.target.value)">
		</div>
		<div v-if="descr.type=='int'">
			<label :for="inputId" >{{descr.name}}</label>
			<input type="number" :id="inputId"
				:min="descr.minValue" :maxlength="descr.maxValue" class="form-control"
				v-bind:value="value" 
				v-on:input="$emit('input', parseInt($event.target.value))">
		</div>
		<div v-if="descr.type=='float'">
			<label :for="inputId" >{{descr.name}}</label>
			<input type="number" :id="inputId"
				:min="descr.minValue" :maxlength="descr.maxValue" class="form-control"
				v-bind:value="value"
				v-on:input="$emit('input', parseFloat($event.target.value))">
		</div>
		<div class="form-check" v-if="descr.type=='boolean'">
			<input type="checkbox" :id="inputId" class="form-check-input"
				v-bind:checked="value" 
				v-on:input="$emit('input', $event.target.checked)">
			<label :for="inputId" class="form-check-label">{{descr.name}}</label>
		</div>
	</div>
</template>

<script>
export default {
	name: 'ParamInput',
	components: {
	},
	props: {
		descr: null,
		value: null
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
.p-int, .p-float, .p-boolean {
	display: inline-block;
}
.p-int input, .p-float input {
	width: 6em;
	margin-right: 0.5em;
}
.p-boolean label {
	margin-right: 0.5em;
}
</style>
