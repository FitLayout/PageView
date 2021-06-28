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

		<header class="jumbotron">
			<h1>FitLayout</h1>
			<p>An extensible web page segmentation and analysis framework.</p>
			<p><a href="https://github.com/FitLayout/FitLayout"><i class="pi pi-github"></i> GitHub page</a></p>
		</header>

		<RepositoryList v-if="repositoryList !== null"
			style="margin:auto"
			:repositoryList="repositoryList"
			:createAvailable="storageStatus && storageStatus.createAvailable"
			:anonymous="userInfo && userInfo.anonymous"
			v-on:created="repositoryCreated" />

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

import {RepositoryData} from '@/common/repositorydata.js';

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

			menuItems: []
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
			if (this.userInfo.anonymous) {
				// anonymous user - no list available. Use local storage for recent repos.
				const ids = RepositoryData.getIDs();
				console.log(ids);
				if (ids && ids.length > 0) {
					this.repositoryList = await this.apiClient.getRepositoryInfos(ids);
					console.log(this.repositoryList);
				}
				console.log('done');
			} else {
				// non-anonymous user - use the API endpoind for getting the repository list
				this.repositoryList = await this.apiClient.listRepositories();
			}
			if (this.repositoryList === null) {
				this.repositoryList = []; //use an empty list when some fetch failed
			}
		},
		async repositoryCreated(rdata) {
			console.log('created');
			console.log(rdata);
			if (rdata && rdata.id) {
				RepositoryData.addID(rdata.id);
			}
			this.loadRepositoryInfo();
		}
	}
}
</script>

<style>
.view-home {
	text-align: center;
}
.logo {
	padding: 0.5em 1em;
	background: var(--surface-d);
	display: inline-block;
	border-radius: 5px;
	font-weight: bold;
}
#mainmenu .selected .p-menuitem-link {
	background-color: var(--primary-color);
}
#mainmenu .selected .p-menuitem-link .p-menuitem-text {
	color: var(--primary-color-text);
}
.jumbotron {
	margin: 10em 0 15em 0;
}
.jumbotron h1 {
	font-size: 500%;
	font-variant: small-caps;
}
.jumbotron a {
	text-decoration: none;
}
.repo-list td {
	border: 1px solid var(--surface-d);
	padding: 1em 1em;
}
.repo-list .repo-id {
	font-weight: bold;
}
</style>
