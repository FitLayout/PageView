<template>
	<div class="view-home">
		<!-- Main menu -->
		<div class="menu-row">
			<Menubar id="mainmenu" :model="menuItems" style="font-size:120%">
				<template #start><span class="logo">FitLayout</span></template>
				<template #end>
					<UserAvatar :userInfo="userInfo" />
            	</template>
			</Menubar>
		</div>

		<RepositoryList 
			:repositoryList="repositoryList"
			:createAvailable="storageStatus && storageStatus.createAvailable"
			:anonymous="userInfo && userInfo.anonymous"
			v-on:created="loadRepositoryInfo" />

	</div>
</template>

<script>
import Menubar from 'primevue/menubar';
import Card from 'primevue/card';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InlineMessage from 'primevue/inlinemessage';

import UserAvatar from '@/components/UserAvatar.vue';
import RepositoryList from '@/components/RepositoryList.vue';

export default {
	name: 'home',
	components: {
		Menubar,
		UserAvatar,
		RepositoryList
	},
	//inject: ['apiClient'],
	data() {
		return {
			apiClient: null,
			userInfo: null,
			storageStatus: null,
			repositoryList: null,

			menuItems: [],
			newId: '',
			newDescr: '',
			error: null
		}
	},
	created () {
		this.apiClient = this.$root.apiClient;
		this.loadRepositoryInfo();
	},
	methods: {
		async loadRepositoryInfo() {
			this.userInfo = await this.apiClient.getUserInfo();
			this.storageStatus = await this.apiClient.getStorageStatus();
			this.repositoryList = await this.apiClient.listRepositories();
		},
		async createRepository() {
			try {
				await this.apiClient.createRepository({id: this.newId, description: this.newDescr});
				this.loadRepositoryInfo();
				this.error = null;
			} catch (e) {
				this.error = e.message;
			}
		}
	}
}
</script>

<style>
.repo-list td {
	border: 1px solid var(--surface-d);
	padding: 1em 1em;
}
.repo-list .repo-id {
	font-weight: bold;
}

</style>
