<template>
	<router-link class="p-button p-component link-button" 
		:to="to"
		:target="target">
		<span v-if="icon" :class="icon" class="p-button-icon p-button-icon-left"></span>
		<span class="p-button-label">{{label}}</span>
	</router-link>
</template>

<script>

export default {
	name: 'LinkButton',
	props: {
		to: null,
		target: null,
		icon: null,
		label: null
	}
}
</script>

<style>
.link-button {
	text-decoration: none;
}
.link-button:hover {
	filter: brightness(0.95);
}
</style>
