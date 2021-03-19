<template>
	<span class="iri font-monospace" :title="iri">{{ shortForm }}</span>
</template>

<script>
import IriDecoder from '@/common/iridecoder.js';

export default {
	name: 'Iri',
	props: {
		iri: null
	},
	data () {
		return {
			shortForm: null
		}
	},
	created () {
		this.update();
	},
	watch: {
		iri: 'update'
	},
	methods: {
		update() {
			let dec = new IriDecoder();
			this.shortForm = dec.encodeIri(this.iri);
		}
	}
}
</script>

<style>
.iri {
	border-bottom: 1px dotted;
	color: var(--blue-500);
	cursor: default;
}
</style>
