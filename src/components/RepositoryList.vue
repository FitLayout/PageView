<template>
	<Card style="width: 50em; margin: 1em;">
		<!-- <template #header>
			<img alt="user header" src="demo/images/usercard.png">
		</template> -->
		<template #title>
			Your Recent Repositories
		</template>
		<template #content>
			<table class="repo-list" v-if="repositoryList && repositoryList.length > 0">
				<tr v-for="repo in repositoryList" :key="repo.id">
					<td class="repo-id">
						<span v-if="repo.description">{{repo.description}}</span>
						<em v-if="!repo.description">{{repo.id}}</em>
					</td>
					<td class="repo-actions">
						<LinkButton label="Open" icon="pi pi-folder-open" class="p-button-warning"
							:to="{name: 'repo', params: { repoId: repo.id }}" />
						<LinkButton label="Browser" icon="pi pi-globe" style="margin-left: 0.5em"
							:to="{name: 'browser', params: { repoId: repo.id }}" />
						<Button label="Share" icon="pi pi-share-alt" style="margin-left: 0.5em" class="p-button-success"
							@click="toggleShare" />
						<OverlayPanel ref="opsh" appendTo="body" :showCloseIcon="true" id="overlay_sh" style="width: 450px" :breakpoints="{'960px': '75vw'}">
							<div class="p-fluid">
								<div class="p-field">
									<label for="fieldId">Shareable link</label>
									<InputText id="fieldId" type="text" :value="getRepoUrl(repo.id)" readonly="true" />
								</div>
							</div>
						</OverlayPanel>
					</td>
				</tr>
			</table>
			<p v-if="!(repositoryList && repositoryList.length > 0)">
				You have not used any repositories recently. Please start with creating a new repository.
			</p>
		</template>
		<template #footer>

			<div v-if="createAvailable">
				<Button type="button" icon="pi pi-plus" :label="'New repository'" @click="toggleCreate" aria:haspopup="true" aria-controls="overlay_panel" />

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

			<div class="repo-missing">
				<a href="#" @click="toggleMissing">Missing some repositories?</a>

				<OverlayPanel ref="opMissing" appendTo="body" :showCloseIcon="true" id="op_missing" style="width: 500px" :breakpoints="{'960px': '75vw'}">
					<p>If you think there are some repositories missing in the list, we may <a href="#" @click="toggleRemind">e-mail you the links
					to your repositories</a> associated with your e-mail. 
					<!-- If you have created your account previously,
					it may be also a good idea to <a href="/auth/#/login">sign in</a>.--></p>
				</OverlayPanel>
				<OverlayPanel ref="opRemind" appendTo="body" :showCloseIcon="true" id="op_remind" style="width: 450px" :breakpoints="{'960px': '75vw'}">
					<div class="p-fluid">
						<div class="p-field">
							<label for="remind-email">Your e-mail</label>
							<InputText id="remind-email" type="email" placeholder="Your e-mail" v-model="remindEmail" />
							<small id="repo-email-help">We will e-mail you the links to all repositories associated with the given e-mail (if any).</small>
						</div>
						<Button type="button" icon="pi pi-check" label="Send reminder" v-on:click="sendReminder" />
						<InlineMessage v-if="remindError" :severity="remindSeverity" v-on:click="remindError = null">{{remindError}}</InlineMessage>
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

import LinkButton from '../components/LinkButton.vue';

export default {
	name: 'RepositoryList',
	components: {
		Card,
		Button,
		OverlayPanel,
		InputText,
		InlineMessage,
		LinkButton
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
			error: null,

			remindEmail: '',
			remindError: null,
			remindSeverity: 'error'
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
		async sendReminder() {
			if (this.remindEmail) {
				try {
					await this.apiClient.sendReminder(this.remindEmail);
					this.remindSeverity = 'success';
					this.remindError = 'Done.';
				} catch (e) {
					this.remindSeverity = 'error';
					this.remindError = e.message;
				}
			}
		},
		toggleCreate(event) {
			this.$refs.op.toggle(event);
			//this.$refs.inputDescr.focus(); //TODO this should be done later
		},
		toggleMissing(event) {
			this.$refs.opMissing.toggle(event);
		},
		toggleRemind(event) {
			this.$refs.opMissing.toggle(event);
			this.$refs.opRemind.toggle(event);
		},
		toggleShare(event) {
			this.$refs.opsh.toggle(event);
		},
		openRepo(id) {
			this.$router.push({name: 'repo', params: { repoId: id }});
		},
		browseRepo(id) {
			this.$router.push({name: 'browser', params: { repoId: id }});
		},
		getRepoUrl(id) {
			const res = this.$router.resolve({name: 'repo', params: { repoId: id }});
			const ret = window.location.origin + this.$router.options.history.base + res.fullPath;
			return ret;
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
	text-align: left;
}
.repo-list .repo-id span {
	font-weight: bold;
}
.repo-list .repo-id em {
	font-weight: normal;
}
.repo-missing {
	margin: 1em 0 0 0;
}
</style>
