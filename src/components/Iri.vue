<template>
	<a class="iri-link" v-if="active" @click="clicked">
		<span class="iri font-monospace" v-tooltip.bottom="iri">{{ shortForm }}</span>
	</a>
	<span class="iri font-monospace" v-if="!active" v-tooltip.bottom="iri">{{ shortForm }}</span>
</template>

<script>
import IriDecoder from '@/common/iridecoder.js';

export default {
	name: 'Iri',
	props: {
		iri: null,
		active: null
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
		},

		clicked() {
			this.$router.push({name: 'show', params: { iri: this.iri}});
		}
	}
}
</script>

<style>
.iri-link {
	color: var(--blue-500);
	text-decoration: none;
	cursor: pointer;
}
.iri {
	border-bottom: 1px dotted;
}
.iri-link:hover .iri {
	border-bottom: 1px solid;
}
</style>
