<template>
	<div class="repository-view-main">
		<h1>Repository: {{repoTitle}}</h1>
		<p>
			<a :href="repoLink">{{repoLink}}</a>
			<span v-if="userInfo && userInfo.anonymous"><br/>
			Please bookmark this link if you want to access this repository later
			(e.g. from another device or browser).</span>
		</p>
		<p v-if="isReadOnly"><strong>This is a read-only repository.</strong> All write operations such as creating new
		artifacts will lead to an error. Feel free to create a new repository of your own for experiments.</p> 

		<div class="render-panel" v-if="!isReadOnly">
			<h2>Render new page</h2>
			<div class="p-fluid formgrid grid">
				<div class="field col-12">
					<label for="url">URL</label>
					<InputText id="url" class="w-full" type="text" placeholder="http://" v-model="renderUrl" />
				</div>
				<div class="field col-4">
					<label for="width">Page width</label>
					<InputNumber id="width" class="w-full" type="decimal" v-model="renderWidth" showButtons :min="10" :max="10000" :step="10" />
				</div>
				<div class="field col-4">
					<label for="height">Height</label>
					<InputNumber id="height" class="w-full" type="decimal" v-model="renderHeight" showButtons :min="10" :max="10000" :step="10" />
				</div>
				<div class="field col-12">
					<Button @click="renderPage()" class="justify-content-center w-full" :disabled="loading">
						<span class="font-bold">Render</span>
						<ProgressSpinner v-if="loading" style="width:1.5em;height:1.5em;margin:0" />
					</Button>
				</div>
				<div class="col-12">
					<div class="text-center">Use the <router-link :to="{name: 'browser', params: {repoId: $route.params.repoId}}" target="_blank">repository browser</router-link> for advanced rendering options</div>
				</div>
			</div>
			<Message severity="error" v-if="error">{{error}}</Message>

		</div>

		<TabView>
			<TabPanel>
				<template #header>
					<i class="pi pi-fw pi-sitemap"></i>
					<span>Artifacts</span>
				</template>
				<div class="artifact-view">
					<ArtTable />
				</div>
			</TabPanel>
			<TabPanel>
				<template #header>
					<i class="pi pi-fw pi-database"></i>
					<span>Contexts</span>
				</template>
				<div class="context-view">
					<ContextTable />
				</div>
			</TabPanel>
		</TabView>

	</div>
</template>

<script>
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import ProgressSpinner from 'primevue/progressspinner';
import Message from 'primevue/message';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';

import ArtTable from '../components/ArtTable.vue';
import ContextTable from '../components/ContextTable.vue';

export default {
	name: 'RepositoryContentView',
	components: {
		Button,
		ArtTable,
		ContextTable,
		InputText,
		InputNumber,
		ProgressSpinner,
		Message,
		TabView,
		TabPanel
	},
	inject: ['apiClient', 'userInfo', 'repoInfo', 'repoTitle', 'repoLink'],
	data() {
		return {
			renderUrl: '',
			renderWidth: 1200,
			renderHeight: 800,
			loading: false,
			error: null
		}
	},
	computed: {
		isReadOnly() {
			return this.repoInfo && this.repoInfo.readOnly;
		},
		
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
