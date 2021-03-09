<template>
	<ul class="artlist">
		<li v-for="art in children" :key="art._iri" :class="(art._iri === currentIri) ? 'selected':''">
			<ArtInfo :iri="art._iri" 
				v-on:select-artifact="selectArtifact"
				v-on:delete-artifact="deleteArtifact"></ArtInfo>
			<ArtTree :artifacts="artifacts" :currentIri="currentIri" :root="art._iri" 
				v-on:select-artifact="selectArtifact"
				v-on:delete-artifact="deleteArtifact"></ArtTree>
		</li>
	</ul>
</template>

<script>
import Page from './Page.vue';
import ArtInfo from './ArtInfo.vue';
import BOX from '@/ontology/BOX.js';
import SEGM from '@/ontology/SEGM.js';
import {Model as BoxModel} from '@/common/boxMappers.js';
import {ApiClient} from '@/common/apiclient.js';

export default {
	name: 'ArtTree',
	components: {
		Page,
		ArtInfo
	},
	props: {
		artifacts: null,
		currentIri: null,
		root: null
	},
	data () {
		return {
		}
	},
	computed: {
		children() {
			if (this.artifacts) {
				let ret = [];
				for (let art of this.artifacts) {
					if ((this.root !== undefined && art.hasParentArtifact !== undefined && art.hasParentArtifact._iri === this.root) 
					    || (this.root === undefined && art.hasParentArtifact === undefined)) {
						ret.push(art);
					}
				}
				return ret;
			} else {
				return null;
			}
		}
	},
	watch: {
		// call again the method if the route changes
		//'$route': 'fetchData'
	},
	methods: {
		selectArtifact(iri) {
			this.$emit('select-artifact', iri);
		},
		deleteArtifact(iri) {
			this.$emit('delete-artifact', iri);
		}
	}
}
</script>

<style>
.artlist {
	margin: 0;
	padding: 0;
}
.artlist li {
	list-style-type: none;
	margin: 0;
	padding: 0;
}
.artlist li ul {
	margin-left: 2em;
}
</style>
