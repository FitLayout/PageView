<template>
  <div class="page-view h-100 row">

	<div class="sidebar col-4">
		<div v-if="loading" class="loading alert alert-light">
			<div class="spinner-border text-primary" role="status">
			</div>
			<span>Loading...</span>
		</div>
		<div v-if="error" class="error alert alert-danger">
		{{ error }}
		</div>
	</div>

	<div class="col-page h-100 col-8 d-flex flex-column">
		<div class="tools row">
			<form class="row row-cols-lg-auto g-3 align-items-center">
				<div class="col-sm-3">
					<label for="zoom" class="form-label">Zoom <b>{{ zoom }}%</b></label>
					<input type="range" class="form-range" min="20" max="200" step="5" id="zoom" v-model="zoom">
				</div>
			</form>
		</div>
		<div class="page-contents row gx-0 h-100 overflow-auto">
			<Page :pageModel="pageModel" :rectangles="rectangles" :zoom="zoom">
			</Page>
		</div>
	</div>

  </div>
</template>

<script>
import Page from './Page.vue';
import BOX from '../ontology/BOX.js';
import SEGM from '../ontology/SEGM.js';
import {Model as BoxModel} from '../common/boxMappers.js';
import {ApiClient} from '../common/apiclient.js';

const ARTIFACT_ENDPOINT = 'http://localhost:8080/fitlayout-web/service/artifact/item/';

export default {
	name: 'PageView',
	components: {
		Page
	},
	props: {
		artifactIri: null
	},
	data () {
		return {
			loading: false,
			error: null,
			artifactModel: null,
			pageModel: null,
			rectangles: null,
			zoom: 100
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
		'artifactIri': 'fetchData'
	},
	methods: {
		async fetchData() {
			console.log('fetch ' + this.artifactIri)
			if (!this.artifactIri) {
				return;
			}
			this.error = this.post = null;
			this.loading = true;
			
			const client = new ApiClient();
			try {
				let artifact = await client.fetchArtifact(this.artifactIri);
				console.log(artifact);
				let type = artifact._type;

				if (type === BOX.Page) {
					this.setArtifact(artifact);
					this.setPage(artifact, artifact.rectangles);
				} else if (type === SEGM.AreaTree) {
					this.setArtifact(artifact);
					if (artifact.hasSourcePage) {
						let page = await client.fetchArtifact(artifact.hasSourcePage);
						this.setPage(page, artifact.areas);
					}
				} else {
					console.error('Unknown artifact type for ' + this.artifactIri)
				}

				this.loading = false;
			} catch (error) {
				this.error = error.message;
				this.loading = false;
				console.error('There was an error!', error);
			}
		},

		setArtifact(artifact) {
			this.artifactModel = artifact;
		},

		setPage(page, rectangles) {
			this.pageModel = page;
			this.rectangles = rectangles;
		}

	}
}
</script>

<style>
.loading span {
	margin-left: 1em;
}
.page-contents {
	border: 2px solid lightgray;
}
</style>
