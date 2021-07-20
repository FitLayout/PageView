<template>
	<div class="page-view-main">
		<p class="backlink"><router-link :to="{name: 'repo', params: { repoId: this.$route.params.repoId }}">
			<i class="pi pi-arrow-circle-left"></i>
			back to repository</router-link></p>

		<Iri :iri="iri" /><br/>
		<ProgressSpinner v-if="loading" />
		<div v-if="page">
			<img v-if="pngImage" :src="pageImage" class="screenshot" />

			<h1>{{pageTitle}}</h1>
			<table class="info">
				<tr><th>Source URL</th><td>{{page.sourceUrl}}</td></tr>
				<tr><th>Size</th><td>{{page.width}} x {{page.height}} px</td></tr>
				<tr><th>Rendered on</th><td>{{page.createdOn}}</td></tr>
				<tr><th>Renderer</th><td>{{page.creator}}</td></tr>
				<tr><th>Renderer params</th><td>{{page.creatorParams}}</td></tr>
			</table>

			<LinkButton label="Open in Browser" icon="pi pi-globe" 
				:to="{name: 'show', params: { repoId: this.$route.params.repoId, iri: iri }}"
				target="_blank" />
		</div>
	</div>
</template>

<script>
import ProgressSpinner from 'primevue/progressspinner';

import LinkButton from '@/components/LinkButton.vue';
import Iri from '@/components/Iri.vue';
import BOX from '@/ontology/BOX.js';
import SEGM from '@/ontology/SEGM.js';
import IriDecoder from '@/common/iridecoder.js';
import {RepositoryData} from '@/common/repositorydata.js';

export default {
	name: 'PageDetailView',
	components: {
		ProgressSpinner,
		LinkButton,
		Iri
	},
	inject: ['apiClient', 'userInfo', 'repoInfo'],
	data() {
		return {
			iri: null,
			page: null,
			pngImage: null,
			loading: false,
		}
	},
	computed: {
		pageTitle() {
			return this.page.title ? this.page.title : '(no title)';
		},
		pageImage() {
			return this.pngImage ? ('data:image/png;base64,' + this.pngImage) : ''; 
		}
	},
	watch: {
	},
	created () {
		this.iri = this.$route.params.iri;
		this.fetchPageInfo();
		this.fetchPageImage();
	},
	methods: {

		async fetchPageInfo() {
			this.loading = true;
			this.page = await this.apiClient.fetchArtifactInfo(this.iri);
			if (this.page._type !== BOX.Page) {
				// only Page artifacts are supported by this view
				this.page = null;
			}
			this.loading = false;
		},

		async fetchPageImage() {
			try {
				const val = await this.apiClient.getSubjectValue(this.iri, BOX.pngImage);
				this.pngImage = val.value;
			} catch (e) {
				this.pngImage = null;
			}
		}

	}
}
</script>

<style>
.page-view-main {
	margin: 2em;
}
.page-view-main .info {
	margin: 1em 0;
}
.page-view-main .info th, .page-view-main .info td {
	padding: 0.1em 0.3em;
}
.page-view-main .info th {
	text-align: left;
	font-weight: bold;
}
.page-view-main .screenshot {
	float: right;
	max-height: 20em;
	min-width: 10em;
}
</style>
