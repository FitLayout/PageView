<template>
	<span class="user-avatar">
       	<Button icon="pi pi-user" class="p-button-rounded p-button-info" @click="toggle" />
		<Menu ref="menu" :model="items" :popup="true" />
	</span>
</template>

<script>
import Button from 'primevue/button';
import Menu from 'primevue/menu';

export default {
	name: 'UserAvatar',
	components: {
		Button,
		Menu
	},
	props: {
		userInfo: null
	},
	data () {
		return {
			items: []
		}
	},
	created () {
		this.createMenu();
	},
	watch: {
		userInfo: 'createMenu'
	},
	methods: {
		createMenu() {
			this.items = [];
			if (this.userInfo) {
				if (this.userInfo.anonymous) {
					this.items.push({
						label: 'Anonymous user',
						class: 'user-id'
					});
					this.items.push({
						separator: true
					});
					this.items.push({
						label: 'Sign in',
						icon: 'pi pi-fw pi-sign-in',
						to: '/',
						command: () => {
							window.localStorage.setItem('redirect', '/browser/');
							location.assign('/auth/#/login');
						}
					});
				} else {
					this.items.push({
						label: this.userInfo.userId,
						class: 'user-id',
						url: '/auth/#/profile'
					});
					if (this.isAdmin()) {
						this.items.push({
							label: 'Administration',
							icon: 'pi pi-fw pi-file-o',
							to: '/admin'
						});
					}
					this.items.push({
						separator: true
					});
					this.items.push({
						label: 'Sign out',
						icon: 'pi pi-fw pi-sign-out',
						to: '/',
						command: () => {
							this.$root.apiClient.logout();
							location.reload();
						}
					});
				}
			}
		},
		toggle(event) {
    		this.$refs.menu.toggle(event);
		},
		isAdmin() {
			return this.userInfo && this.userInfo.roles && this.userInfo.roles.includes('admin');
		}
	}
}
</script>

<style>
	.p-menu .user-id {
		font-weight: bold;
	}
</style>
