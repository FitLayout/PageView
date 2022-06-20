<template>
	<div class="explore-view">
		<div class="subj-selection" v-if="iri">
			Subject: <InputText v-if="destIri" type="text" v-model="destIri" @keydown.enter="changeIri()" style="width: 50em" />
		</div>
		<SubjectInfo :iri="iri" :activeIris="true" @show-iri="showIri" />
	</div>
</template>

<script>
import InputText from 'primevue/inputtext';

import Iri from '@/components/Iri.vue';
import SubjectInfo from '@/components/SubjectInfo.vue';

import IriDecoder from '@/common/iridecoder.js';


export default {
	name: 'ExploreView',
	components: {
		InputText,
		Iri,
		SubjectInfo
	},
	props: {
	},
	inject: ['apiClient'],
	data () {
		return {
			destIri: null
		}
	},
	created () {
		this.update();
	},
	computed: {
		iri() {
			return this.$route.params.iri;
		},
		repoId() {
			return this.$route.params.repoId;
		}
	},
	watch: {
		'$route.params.iri': 'update'
	},
	methods: {
		update() {
			let dec = new IriDecoder();
			this.destIri = dec.encodeIri(this.iri);
		},

		showIri(iri) {
			this.$router.push({name: 'explore', params: { repoId: this.repoId, iri: iri }});
		},

		changeIri() {
			let dec = new IriDecoder();
			let iri = dec.decodeIri(this.destIri);
			this.showIri(iri);
		}
	}
}
</script>

<style>
.explore-view .subj-selection {
	padding: 1em;
}
</style>
