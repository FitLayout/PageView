<template>

	<div class="col-page">
		<div v-if="loading">
			<ProgressBar mode="indeterminate"/>
		</div>
		<div v-if="error" class="error alert alert-danger">
		{{ error }}
		</div>
		<div class="tools" v-if="!loading && !error">
			<div class="p-fluid p-formgrid p-grid">
				<div class="p-field p-col">
					<label for="zoom" class="form-label">Zoom<br><b>{{ zoom }}%</b></label>
					<Slider id="zoom" v-model="zoom" :step="5" :min="20" :max="200" />
				</div>
				<div class="p-field p-col">
					<label for="screen" class="form-label">Screenshot</label>
					<InputSwitch id="screen" v-model="screenshot" />
				</div>
				<div class="p-field p-col">
					<label for="outlines" class="form-label">Show outlines</label>
					<InputSwitch id="outlines" v-model="outlines" title="Show area bounds" />
				</div>
			</div>
		</div>
		<div class="page-contents">
			<Page :pageModel="pageModel" :rectangles="rectangles" :zoom="zoom" :outlines="outlines">
			</Page>
		</div>
	</div>

</template>

<script>
import ProgressBar from 'primevue/progressbar';
import Slider from 'primevue/slider';
import InputSwitch from 'primevue/inputswitch';
import Page from './Page.vue';

import BOX from '@/ontology/BOX.js';
import SEGM from '@/ontology/SEGM.js';
import {Model as BoxModel} from '@/common/boxMappers.js';
import {ApiClient} from '@/common/apiclient.js';

export default {
	name: 'PageView',
	components: {
		ProgressBar,
		Slider,
		InputSwitch,
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
			zoom: 100,
			screenshot: true,
			outlines: false
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
	background-color: var(--surface-b);
	padding: 0.3em 0;
	font-size: 90%;
}
.tools .p-field {
	text-align: center;
	padding: 0 0.3em;
	margin-bottom: 0.1em;
}
.tools .p-field label {
	display: block;
}
.tools .p-field > label, .tools .p-field > .p-component {
	margin-left: auto;
	margin-right: auto;
}
.tools .p-field > .p-component {
	margin-bottom: 0;
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
