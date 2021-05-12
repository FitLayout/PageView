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
			this.items = [
				{
					label: this.userInfo ? this.userInfo.userId : 'user',
					class: 'user-id'
				},
				{
					separator: true
				},
				{
					label: 'Logout',
					icon: 'pi pi-fw pi-power-off',
					to: '/',
					command: () => {
						this.$root.apiClient.logout();
					}
				}
			];
		},
		toggle(event) {
    		this.$refs.menu.toggle(event);
		}
	}
}
</script>

<style>
	.p-menu .user-id {
		font-weight: bold;
	}
</style>
