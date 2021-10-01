<template>
    <div class="repository-view">
		<!-- Admin menu -->
		<div class="menu-row">
			<Menubar id="mainmenu" :model="menuItems" style="font-size:120%">
				<template #start><span class="logo">FitLayout</span> [Admin] </template>
				<template #end>
					<Button icon="pi pi-sign-out" 
							class="p-button-rounded p-button-text" 
							v-tooltip.bottom="'Close administration'" 
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
	name: 'AdminView',
	components: {
		Menubar,
		Button,
		UserAvatar,
	},
	data() {
		return {
			apiClient: this.$root.apiClient,
			userInfo: null,

			menuItems: [
				{label: 'Repositories', icon: 'pi pi-fw pi-file-o', to: '/admin/repos'},
				{label: 'Authorization', icon: 'pi pi-fw pi-users', url: '/auth/'}
			]
		}
	},
	provide() {
		return {
			apiClient: this.apiClient,
			userInfo: computed(() => this.userInfo),
		}
	},
	computed: {
	},
	watch: {
	},
	created () {
		this.apiClient = this.$root.apiClient;
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
