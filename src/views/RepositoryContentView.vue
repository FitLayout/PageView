<template>
	<div class="repository-view-main">
		<h1>Repository: {{repoTitle.value}}</h1>
		<p>
			<a :href="repoLink.value">{{repoLink.value}}</a>
			<span v-if="userInfo && userInfo.anonymous"><br/>Please save this link if you want to
			access this repository from another device or browser.</span>
		</p>

		<LinkButton label="Open in Browser" icon="pi pi-globe" 
			:to="{name: 'browser', params: { repoId: this.$route.params.repoId }}"
			target="_blank" />
		
		<div class="render-panel">
			<h2>Render new page</h2>
			<div class="p-fluid p-formgrid p-grid">
				<div class="p-field p-col-12">
					<label for="url">URL</label>
					<InputText id="url" type="text" placeholder="http://" v-model="renderUrl" />
				</div>
				<div class="p-field p-col-3">
					<label for="width">Page width</label>
					<InputNumber id="width" type="decimal" v-model="renderWidth" showButtons :min="10" :max="10000" :step="10" />
				</div>
				<div class="p-field p-col-3">
					<label for="height">Height</label>
					<InputNumber id="height" type="decimal" v-model="renderHeight" showButtons :min="10" :max="10000" :step="10" />
				</div>
				<div class="p-field p-col-12">
					<Button @click="renderPage()" class="p-jc-center" :disabled="loading">
						<span class="p-text-bold">Render</span>
						<ProgressSpinner v-if="loading" style="width:1.5em;height:1.5em;margin:0" />
					</Button>
				</div>
			</div>
			<Message severity="error" v-if="error">{{error}}</Message>

		</div>

		<div class="artifact-view">
			<ArtTable />
		</div>
	</div>
</template>

<script>
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import ProgressSpinner from 'primevue/progressspinner';
import Message from 'primevue/message';

import LinkButton from '@/components/LinkButton.vue';
import ArtTable from '@/components/ArtTable.vue';
import BOX from '@/ontology/BOX.js';
import SEGM from '@/ontology/SEGM.js';
import IriDecoder from '@/common/iridecoder.js';

export default {
	name: 'RepositoryContentView',
	components: {
		Button,
		ArtTable,
		InputText,
		InputNumber,
		ProgressSpinner,
		Message,
		LinkButton
	},
	inject: ['apiClient', 'userInfo', 'repoInfo', 'repoTitle', 'repoLink'],
	data() {
		return {
			renderUrl: '',
			renderWidth: 1200,
			renderHeight: 800,
			loading: false,
			error: null,
		}
	},
	computed: {
	},
	watch: {
	},
	created () {
		this.loading = false;
		console.log('R');
		console.log(this.repoInfo);
	},
	methods: {

		async renderPage() {
			console.log('invoke');
			this.loading = true;

			const serviceId = 'FitLayout.Puppeteer';
			const params = {
				"acquireImages": false,
				"width": this.renderWidth,
				"height": this.renderHeight,
				"persist": 3,
				"includeScreenshot": true,
				"url": this.renderUrl
			}

			try {
				const iri = await this.apiClient.createArtifact(serviceId, params, null);
				this.$router.push({name: 'page', params: { repoId: this.$route.params.repoId, iri: iri}});
				this.error = null;
			} catch (e) {
				this.error = e.message;
			} finally {
				this.loading = false;
			}

			return false;
		},

	}
}
</script>

<style>
.repository-view-main {
	margin: 2em;
}
.repository-view h1 small {
	font-size: 50%;
	font-weight: normal;
}
.render-panel {
	margin: 5em auto;
	width: 50em;
}
.render-panel h2 {
	text-align: center;
	font-size: 100%;
}
.artifact-view {
	margin-top: 2em;
}
</style>
