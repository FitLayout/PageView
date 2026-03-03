<template>
	<div class="view-home">
		<!-- Main menu -->
		<div class="menu-row">
			<Menubar id="mainmenu" :model="menuItems" style="font-size:120%">
				<template #start><router-link to="/"><span class="logo">FitLayout</span></router-link></template>
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

		<RepositoryList v-if="repositoryList !== null && error === null"
			style="margin:auto"
			:repositoryList="repositoryList"
			:createAvailable="storageStatus && storageStatus.createAvailable"
			:anonymous="userInfo && userInfo.anonymous"
			v-on:created="repositoryCreated" />

		<div class="error" v-if="error">
			<h3>We're sorry</h3>
			<p>The FitLayout backend seems to be down in the moment. Please try again later.</p>
		</div>

	</div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';
import Menubar from 'primevue/menubar';
import type { MenuItem } from 'primevue/menuitem';

import UserAvatar from '../components/UserAvatar.vue';
import RepositoryList from '../components/RepositoryList.vue';

import {RepositoryData} from '../common/repositorydata.js';
import type { FLApiClient, StorageStatus, UserInfo } from '@/common/apiclient.js';
import type { RdfObject } from '@/common/types';
import type { RepositoryInfo } from '@/rdf4j-vue-components/src/index.js';

interface ComponentData {
    error: string | null;
    userInfo: UserInfo | null;
    storageStatus: StorageStatus | null;
    repositoryList: RepositoryInfo[] | null;
    menuItems: MenuItem[];
}

export default defineComponent({
	name: 'home',
	components: {
		Menubar,
		UserAvatar,
		RepositoryList
	},
	setup() {
		return {
			apiClient: inject('apiClient') as FLApiClient
		}
	},
	data(): ComponentData {
		return {
			error: null,
			userInfo: null,
			storageStatus: null,
			repositoryList: null,

			menuItems: []
		}
	},
	created () {
		this.apiClient = (this.$root as any).apiClient;
		this.loadRepositoryInfo();
	},
	methods: {
		async loadRepositoryInfo() {
			this.error = null;
			try {
				this.userInfo = await this.apiClient.getUserInfo();
				this.storageStatus = await this.apiClient.getStorageStatus();
				if (this.userInfo.anonymous) {
					// anonymous user - no list available. Use local storage for recent repos.
					const ids = RepositoryData.getIDs();
					let todelete: string[] = [];
					console.log(ids);
					if (ids && ids.length > 0) {
						this.repositoryList = await this.apiClient.getRepositoryInfos(ids, function(id, e) {
							todelete.push(id);
						});
						console.log(this.repositoryList);
					}
					// if some repos have been fetched and other not, delete the failed ones (they probably don't exist anymore)
					if (todelete.length > 0 && todelete.length < ids.length) {
						for (let id of todelete) {
							console.log('Removing ' + id);
							RepositoryData.deleteID(id);
						}
					}
					console.log('done');
				} else {
					// non-anonymous user - use the API endpoind for getting the repository list
					this.repositoryList = await this.apiClient.listRepositories();
				}
			} catch (e: any) {
				this.error = e.message;
			}
			if (this.repositoryList === null) {
				this.repositoryList = []; //use an empty list when some fetch failed
			}
		},
		async repositoryCreated(rdata: RepositoryInfo) {
			console.log('created');
			console.log(rdata);
			if (rdata && rdata.id) {
				RepositoryData.addID(rdata.id);
			}
			this.loadRepositoryInfo();
		}
	}
})
</script>

<style>
.view-home {
	text-align: center;
}
.logo {
	padding: 0.5em 1em;
	color: var(--p-text-color);
	background: var(--p-surface-300);
	display: inline-block;
	border-radius: 5px;
	font-weight: bold;
}
#mainmenu .selected .p-menubar-item-link {
	background-color: var(--p-primary-color);
}
#mainmenu .selected .p-menubar-item-link .p-menubar-item-label {
	color: var(--p-primary-contrast-color);
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
	border: 1px solid var(--p-surface-300);
	padding: 1em 1em;
}
.repo-list .repo-id {
	font-weight: bold;
}
</style>
