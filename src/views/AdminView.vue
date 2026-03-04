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
				<template #item="{ item, props, hasSubmenu }">
					<router-link v-if="item.to" v-slot="{ href, navigate }" :to="item.to" custom>
						<a :href="href" v-bind="props.action" @click="navigate">
							<span :class="item.icon" />
							<span class="ml-2">{{ item.label }}</span>
						</a>
					</router-link>
					<a v-else :href="item.url" :target="item.target" v-bind="props.action">
						<span :class="item.icon" />
						<span class="ml-2">{{ item.label }}</span>
						<span v-if="hasSubmenu" class="pi pi-fw pi-angle-down ml-2" />
					</a>
				</template>
			</Menubar>
		</div>
		<router-view></router-view>
	</div>
</template>

<script lang="ts">
import { defineComponent, inject, computed } from 'vue';
import Menubar from 'primevue/menubar';
import Button from 'primevue/button';
import type { MenuItem } from 'primevue/menuitem';

import UserAvatar from '../components/UserAvatar.vue';
import type { FLApiClient, UserInfo } from '@/common/apiclient.js';

interface ComponentData {
	userInfo: UserInfo | null;
	menuItems: MenuItem[];
}

export default defineComponent({
	name: 'AdminView',
	components: {
		Menubar,
		Button,
		UserAvatar,
	},
	setup() {
		return {
			apiClient: inject('apiClient') as FLApiClient
		}
	},
	data(): ComponentData {
		return {
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
		this.fetchUserInfo();
	},
	methods: {

		async fetchUserInfo(): Promise<void> {
			//this.error = null;
			this.userInfo = await this.apiClient.getUserInfo();
		},

		quit(): void {
			this.$router.push({name: 'home'});
		}

	}
})
</script>

<style>
</style>
