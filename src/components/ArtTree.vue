<template>
	<ul class="artlist">
		<li v-for="art in children" :key="art._iri" :class="(art._iri === currentIri) ? 'selected':''">
			<ArtInfo :iri="art._iri" :focus="itemFocused"
				v-on:toggle-focus="toggleFocus"
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
			focus: true,
			parents: null
		}
	},
	computed: {
		children() {
			if (this.artifacts) {
				let ret = [];
				for (let art of this.artifacts) {
					if (this.root === undefined && art.hasParentArtifact === undefined) {
						// root artifacts
						if (this.focus && this.currentIri) {
							this.indexParents();
							const rootIri = this.findRootIri(this.currentIri);
							if (art._iri === rootIri) { //allow only root artifact for the current selection  
								ret.push(art);
							}
						} else {
							ret.push(art); // no focus - push all
						}
					} else if (this.root !== undefined && art.hasParentArtifact !== undefined && art.hasParentArtifact._iri === this.root) {
						// derived artifacts
						ret.push(art);
					} 
				}
				return ret;
			} else {
				return null;
			}
		},
		itemFocused() {
			return this.focus && this.currentIri;
		}
	},
	methods: {
		selectArtifact(iri) {
			this.$emit('select-artifact', iri);
		},
		deleteArtifact(iri) {
			this.$emit('delete-artifact', iri);
		},
		indexParents() {
			this.parents = {};
			for (let art of this.artifacts) {
				if (art.hasParentArtifact !== undefined) {
					this.parents[art._iri] = art.hasParentArtifact._iri;
				}
			}
		},
		findRootIri(iri) {
			let ret = iri;
			let change = true;
			while (change) {
				if (this.parents[ret] !== undefined) {
					ret = this.parents[ret];
				} else {
					change = false;
				}
			}
			return ret;
		},
		toggleFocus() {
			this.focus = !this.focus;
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
