<template>
	<Card style="width: 50em; margin: 1em;">
		<!-- <template #header>
			<img alt="user header" src="demo/images/usercard.png">
		</template> -->
		<template #title>
			Recent Repositories
		</template>
		<template #content>
			<table class="repo-list" v-if="repositoryList && repositoryList.length > 0">
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
			<p v-if="!(repositoryList && repositoryList.length > 0)">
				You have not used any repositories recently. Please start with creating a new repository.
			</p>
		</template>
		<template #footer>

			<div v-if="createAvailable">
				<Button type="button" icon="pi pi-plus" :label="'New workspace'" @click="toggleCreate" aria:haspopup="true" aria-controls="overlay_panel" />

				<OverlayPanel ref="op" appendTo="body" :showCloseIcon="true" id="overlay_panel" style="width: 450px" :breakpoints="{'960px': '75vw'}">
					<div class="p-fluid">
						<div class="p-field">
							<label for="repo-descr">Name</label>
							<InputText id="repo-descr" type="text" placeholder="Enter the repository name" v-model="newDescr" ref="inputDescr" />
						</div>
						<div class="p-field" v-if="anonymous">
							<label for="repo-email">E-mail</label>
							<InputText id="repo-email" type="text" placeholder="Your e-mail" v-model="newEmail" />
							<small id="repo-email-help">Your e-mail is optional. If provided, we will be able to e-mail you the links to your repositories.</small>
						</div>
						<Button type="button" icon="pi pi-check" label="Create" v-on:click="createRepository" />
						<InlineMessage v-if="error" v-on:click="error = null">{{error}}</InlineMessage>
					</div>
				</OverlayPanel>

			</div>

		</template>
	</Card>
</template>

<script>
import Card from 'primevue/card';
import Button from 'primevue/button';
import OverlayPanel from 'primevue/overlaypanel';
import InputText from 'primevue/inputtext';
import InlineMessage from 'primevue/inlinemessage';

export default {
	name: 'RepositoryList',
	components: {
		Card,
		Button,
		OverlayPanel,
		InputText,
		InlineMessage
	},
	props: {
		repositoryList: {
			type: Array
		},
		createAvailable: null,
		anonymous: null
	},
	data() {
		return {
			apiClient: null,

			menuItems: [],
			newDescr: '',
			newEmail: '',
			error: null
		}
	},
	created () {
		this.apiClient = this.$root.apiClient;
		this.newDescr = "Default repository";
	},
	methods: {
		async createRepository() {
			try {
				const rdata = await this.apiClient.createRepository({description: this.newDescr, email: this.newEmail});
				this.$emit('created', rdata);
				this.error = null;
			} catch (e) {
				this.error = e.message;
			}
		},
		toggleCreate(event) {
			this.$refs.op.toggle(event);
			//this.$refs.inputDescr.focus(); //TODO this should be done later
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
