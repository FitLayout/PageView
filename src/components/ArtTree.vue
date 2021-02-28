<template>
	<ul class="artlist">
		<li v-for="art in children" :key="art._iri">
			<ArtInfo :iri="art._iri" :expand="art._iri === currentIri"
				v-on:select-artifact="selectArtifact"></ArtInfo>
			<ArtTree :currentIri="currentIri" :root="art._iri" v-on:select-artifact="selectArtifact"></ArtTree>
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
		currentIri: null,
		root: null
	},
	data () {
		return {
			loading: false,
			error: null,
			artifacts: null
		}
	},
	computed: {
		children() {
			if (this.artifacts) {
				let ret = [];
				console.log(this.root);
				for (let art of this.artifacts) {
					if ((this.root !== undefined && art.hasParentArtifact !== undefined && art.hasParentArtifact._iri === this.root) 
					    || (this.root === undefined && art.hasParentArtifact === undefined)) {
						ret.push(art);
					}
				}
				console.log(ret);
				return ret;
			} else {
				return null;
			}
		}
	},
	created () {
		// fetch the data when the view is created and the data is
		// already being observed
		this.fetchData();
	},
	watch: {
		// call again the method if the route changes
		//'$route': 'fetchData'
	},
	methods: {
		async fetchData() {
			console.log('fetch ' + this.artifactIri)
			this.error = null;
			this.loading = true;
			
			const client = new ApiClient();
			try {
				this.artifacts = await client.fetchArtifactInfoAll();
				console.log(this.artifacts);

				this.loading = false;
			} catch (error) {
				this.error = error.message;
				this.loading = false;
				console.error('Error while fetching artifact info!', error);
			}
		},
		selectArtifact(iri) {
			//console.log('select: ' + iri);
			this.$emit('select-artifact', iri);
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
