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

		<Card style="width: 50em; margin: 1em;">
			<!-- <template #header>
				<img alt="user header" src="demo/images/usercard.png">
			</template> -->
			<template #title>
				Your Repositories
			</template>
			<template #content>
				<table class="repo-list">
					<tr v-for="repo in repositoryList" :key="repo.id">
						<td class="repo-id">{{repo.id}}</td>
						<td class="repo-descr">{{repo.description}}</td>
						<td class="repo-actions">
							<router-link
								:to="{ name: 'repo', params: { repoId: repo.id } }"
								active-class="active">
									browse
							</router-link>
						</td>
						<td class="repo-actions">
							<router-link
								:to="{ name: 'repo', params: { repoId: repo.id } }"
								active-class="active">
									query
							</router-link>
						</td>
					</tr>
				</table>
			</template>
			<template #footer>

				<div class="p-formgroup-inline" v-if="storageStatus && storageStatus.createAvailable">
					<div class="p-field">
						<label for="repo-id" class="p-sr-only">Repository ID</label>
						<InputText id="repo-id" type="text" placeholder="Repository ID" v-model="newId" />
					</div>
					<div class="p-field">
						<label for="repo-descr" class="p-sr-only">Description</label>
						<InputText id="repo-descr" type="text" placeholder="Description" v-model="newDescr" />
					</div>
					<Button type="button" icon="pi pi-check" label="Create" v-on:click="createRepository" />
					<InlineMessage v-if="error" v-on:click="error = null">{{error}}</InlineMessage>
				</div>
			</template>
		</Card>

	</div>
</template>

<script>
import Menubar from 'primevue/menubar';
import Card from 'primevue/card';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InlineMessage from 'primevue/inlinemessage';

import UserAvatar from '@/components/UserAvatar.vue';

export default {
	name: 'home',
	components: {
		Menubar,
		UserAvatar,
		Card,
		Button,
		InputText,
		InlineMessage
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
