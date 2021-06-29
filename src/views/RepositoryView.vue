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
			<h1>{{repoTitle}} <small>({{repoInfo.id}})</small></h1>
			<Button label="Open in Browser" icon="pi pi-globe" @click="browseRepo()" />
		</div>
	</div>
</template>

<script>
import Menubar from 'primevue/menubar';
import Button from 'primevue/button';

import UserAvatar from '@/components/UserAvatar.vue';
import BOX from '@/ontology/BOX.js';
import SEGM from '@/ontology/SEGM.js';
import IriDecoder from '@/common/iridecoder.js';
import {RepositoryData} from '@/common/repositorydata.js';

export default {
	name: 'RepositoryView',
	components: {
		Menubar,
		Button,
		UserAvatar
	},
	data() {
		return {
			apiClient: this.$root.apiClient,
			userInfo: null,
			repoInfo: null,

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
		}
	},
	watch: {
	},
	created () {
		this.apiClient = this.$root.apiClient;
		this.apiClient.currentRepo = this.$route.params.repoId;
		this.apiClient.getRepositoryInfo(this.$route.params.repoId).then((info) => { 
			this.repoInfo = info;
		});
		this.fetchArtifacts();
	},
	methods: {

		async fetchArtifacts() {
			this.error = null;
			this.loading = true;
			this.userInfo = await this.apiClient.getUserInfo();
			
			try {
				this.artifacts = await this.apiClient.fetchArtifactInfoAll();
				this.loading = false;
				RepositoryData.addID(this.$route.params.repoId); // add the repository to the list of known repositories
			} catch (error) {
				this.error = error.message;
				this.loading = false;
				console.error('Error while fetching artifact info!', error);
			}
		},

		browseRepo() {
			this.$router.push({name: 'browser', params: { repoId: this.$route.params.repoId }});
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
</style>
