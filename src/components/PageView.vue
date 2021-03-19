<template>

	<div class="col-page">
		<div v-if="loading">
			<ProgressBar mode="indeterminate"/>
		</div>
		<div v-if="error" class="error alert alert-danger">
		{{ error }}
		</div>
		<div class="tools" v-if="!loading && !error">
			<form class="row row-cols-lg-auto align-items-center">
				<div class="col-sm-3">
					<label for="zoom" class="form-label">Zoom <b>{{ zoom }}%</b></label>
					<input type="range" class="form-range" min="20" max="200" step="5" id="zoom" v-model="zoom">
				</div>
			</form>
		</div>
		<div class="page-contents">
			<Page :pageModel="pageModel" :rectangles="rectangles" :zoom="zoom">
			</Page>
		</div>
	</div>

</template>

<script>
import ProgressBar from 'primevue/progressbar';
import Page from './Page.vue';

import BOX from '@/ontology/BOX.js';
import SEGM from '@/ontology/SEGM.js';
import {Model as BoxModel} from '@/common/boxMappers.js';
import {ApiClient} from '@/common/apiclient.js';

export default {
	name: 'PageView',
	components: {
		ProgressBar,
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
		this.fetchData();
	},
	watch: {
		'artifactIri': 'update'
	},
	methods: {
		update() {
			this.fetchData();
		},

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
					this.setPage(artifact, artifact.rectAreas);
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
				console.error('Error while fetching artifact data', error);
			}
		},

		setArtifact(artifact) {
			this.artifactModel = artifact;
		},

		setPage(page, rectangles) {
			this.pageModel = page;
			this.rectangles = rectangles;
		},

		changeArtifact(iri) {
			this.$emit('select-artifact', iri);
		}

	}
}
</script>

<style>
.col-page {
	height: 100%;
	display: flex;
	flex-direction: column;
}
.tools {
	margin-top: 0;
	background-color: #f3f3f3;
	border: 1px ridge #d0d0d0;
	font-size: 80%;
	padding: 0.3em 0;
}
.loading span {
	margin-left: 1em;
}
.page-contents {
	border: 2px solid lightgray;
	height: 100%;
	width: 100%;
	min-width: 200px;
	overflow: auto;
	position: relative;
}
</style>
