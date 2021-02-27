<template>
	<div>
		<ArtInfo v-for="art in artifacts" :key="art._iri" :iri="art._iri" 
			:expand="art._iri === currentIri" v-on:select-artifact="selectArtifact"></ArtInfo>
	</div>
</template>

<script>
import Page from './Page.vue';
import ArtInfo from './ArtInfo.vue';
import BOX from '@/ontology/BOX.js';
import SEGM from '@/ontology/SEGM.js';
import {Model as BoxModel} from '@/common/boxMappers.js';
import {ApiClient} from '@/common/apiclient.js';

export default {
	name: 'PageView',
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
</style>
