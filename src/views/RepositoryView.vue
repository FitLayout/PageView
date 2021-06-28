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
		<p>{{repoId}}</p>
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
			return this.$route.params.repoId;
		}
	},
	watch: {
	},
	created () {
		this.apiClient = this.$root.apiClient;
		this.apiClient.currentRepo = this.$route.params.repoId;
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

		quit() {
			this.$router.push({name: 'home'});
		}

	}
}
</script>

<style>
.repository-view {
}
</style>
