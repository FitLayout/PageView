<template>
    <div class="repository-view">
		<!-- Repository menu -->
		<div class="menu-row">
			<Menubar id="mainmenu" :model="menuItems" style="font-size:120%">
				<template #start><span class="logo">FitLayout</span></template>
				<template #end>
					<span class="repo-info">Repository: <b>{{repoId}}</b></span>
					<Button icon="pi pi-sign-out" 
							class="p-button-rounded p-button-text" 
							v-tooltip.bottom="'Close repository'" 
							@click="quit()" />&nbsp;
					<UserAvatar :userInfo="userInfo" v-tooltip.bottom="userInfo ? ('User: ' + userInfo.userId) : 'User'" />
            	</template>
			</Menubar>
		</div>
		<div class="repository-view-main" v-if="repoInfo">
			<h1>Repository: {{repoTitle}}</h1>
			<p>
				<a :href="repoLink">{{repoLink}}</a>
				<span v-if="userInfo && userInfo.anonymous"><br/>Please save this link if you want to
				access this repository from another device or browser.</span>
			</p>
			<Button label="Open in Browser" icon="pi pi-globe" @click="browseRepo()" />
			
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
	</div>
</template>

<script>
import Menubar from 'primevue/menubar';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import ProgressSpinner from 'primevue/progressspinner';
import Message from 'primevue/message';

import UserAvatar from '@/components/UserAvatar.vue';
import ArtTable from '@/components/ArtTable.vue';
import BOX from '@/ontology/BOX.js';
import SEGM from '@/ontology/SEGM.js';
import IriDecoder from '@/common/iridecoder.js';
import {RepositoryData} from '@/common/repositorydata.js';

export default {
	name: 'RepositoryView',
	components: {
		Menubar,
		Button,
		UserAvatar,
		ArtTable,
		InputText,
		InputNumber,
		ProgressSpinner,
		Message
	},
	data() {
		return {
			apiClient: this.$root.apiClient,
			userInfo: null,
			repoInfo: null,

			renderUrl: '',
			renderWidth: 1200,
			renderHeight: 800,
			loading: false,
			error: null,

			menuItems: [
			]
		}
	},
	provide() {
		return {
			apiClient: this.apiClient
		}
	},
	computed: {
		iri() {
			return this.$route.params.iri;
		},
		repoId() {
			if (this.repoInfo) {
				return this.repoInfo.description ? this.repoInfo.description : this.repoInfo.id;
			} else {
				return this.$route.params.repoId;
			}
		},
		repoTitle() {
			if (this.repoInfo) {
				return this.repoInfo.description ? this.repoInfo.description : '(no name)';
			} else {
				return '(no name)';
			}
		},
		repoLink() {
			return window.location.href;
		}
	},
	watch: {
	},
	created () {
		this.loading = false;
		this.apiClient = this.$root.apiClient;
		this.apiClient.currentRepo = this.$route.params.repoId;
		this.apiClient.getRepositoryInfo(this.$route.params.repoId).then((info) => { 
			this.repoInfo = info;
			RepositoryData.addID(info.id); // add the repository to the list of known repositories
		});
		this.fetchUserInfo();
	},
	methods: {

		async fetchUserInfo() {
			this.error = null;
			this.userInfo = await this.apiClient.getUserInfo();
		},

		browseRepo() {
			this.$router.push({name: 'browser', params: { repoId: this.$route.params.repoId }});
		},

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
				this.error = null;
			} catch (e) {
				this.error = e.message;
			} finally {
				this.loading = false;
			}

			return false;
		},

		quit() {
			this.$router.push({name: 'home'});
		}

	}
}
</script>

<style>
.repository-view {
}
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
