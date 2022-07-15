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
		<router-view></router-view>
	</div>
</template>

<script>
import Menubar from 'primevue/menubar';
import Button from 'primevue/button';

import UserAvatar from '@/components/UserAvatar.vue';
import {RepositoryData} from '@/common/repositorydata.js';
import { computed } from 'vue';

export default {
	name: 'RepositoryView',
	components: {
		Menubar,
		Button,
		UserAvatar,
	},
	data() {
		return {
			apiClient: this.$root.apiClient,
			userInfo: null,
			repoInfo: null,

			menuItems: [
				{label: 'Explore', to: {name: 'explore'}}
			]
		}
	},
	provide() {
		return {
			apiClient: this.apiClient,
			userInfo: computed(() => this.userInfo),
			repoInfo: computed(() => this.repoInfo),
			repoId: computed(() => this.repoId),
			repoTitle: computed(() =>this.repoTitle),
			repoLink: computed(() => this.repoLink)
		}
	},
	computed: {
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
		this.apiClient = this.$root.apiClient;
		this.apiClient.setRepository(this.$route.params.repoId);
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

		quit() {
			this.$router.push({name: 'home'});
		}

	}
}
</script>

<style>
</style>
