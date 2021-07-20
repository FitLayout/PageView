<template>
    <div class="page-view">
		<!-- Repository menu -->
		<div class="menu-row">
			<Menubar id="mainmenu" :model="menuItems" style="font-size:120%">
				<template #start><span class="logo">FitLayout</span></template>
				<template #end>
					<span class="repo-info">Repository: <b>{{repoName}}</b></span>
					<Button icon="pi pi-sign-out" 
							class="p-button-rounded p-button-text" 
							v-tooltip.bottom="'Close repository'" 
							@click="quit()" />&nbsp;
					<UserAvatar :userInfo="userInfo" v-tooltip.bottom="userInfo ? ('User: ' + userInfo.userId) : 'User'" />
            	</template>
			</Menubar>
		</div>
		<div class="page-view-main">
			<Iri :iri="iri" /><br/>
			<ProgressSpinner v-if="loading" />
			<div v-if="page">
				<img v-if="pngImage" :src="pageImage" class="screenshot" />

				<h1>{{pageTitle}}</h1>
				<table class="info">
					<tr><th>Source URL</th><td>{{page.sourceUrl}}</td></tr>
					<tr><th>Size</th><td>{{page.width}} x {{page.height}} px</td></tr>
					<tr><th>Rendered on</th><td>{{page.createdOn}}</td></tr>
					<tr><th>Renderer</th><td>{{page.creator}}</td></tr>
					<tr><th>Renderer params</th><td>{{page.creatorParams}}</td></tr>
				</table>

				<LinkButton label="Open in Browser" icon="pi pi-globe" 
					:to="{name: 'show', params: { repoId: this.$route.params.repoId, iri: iri }}"
					target="_blank" />
			</div>
		</div>
	</div>
</template>

<script>
import Menubar from 'primevue/menubar';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import ProgressSpinner from 'primevue/progressspinner';
import Message from 'primevue/message';

import LinkButton from '@/components/LinkButton.vue';
import UserAvatar from '@/components/UserAvatar.vue';
import ArtTable from '@/components/ArtTable.vue';
import Iri from '@/components/Iri.vue';
import BOX from '@/ontology/BOX.js';
import SEGM from '@/ontology/SEGM.js';
import IriDecoder from '@/common/iridecoder.js';
import {RepositoryData} from '@/common/repositorydata.js';

export default {
	name: 'RepositoryView',
	components: {
		Menubar,
		Button,
		UserAvatar,
		ArtTable,
		InputText,
		InputNumber,
		ProgressSpinner,
		Message,
		LinkButton,
		Iri
	},
	data() {
		return {
			apiClient: this.$root.apiClient,
			userInfo: null,
			repoInfo: null,
			iri: null,
			page: null,
			pngImage: null,
			loading: false,

			menuItems: [
			]
		}
	},
	provide() {
		return {
			apiClient: this.apiClient
		}
	},
	computed: {
		repoId() {
			return this.$route.params.repoId;
		},
		repoName() {
			if (this.repoInfo) {
				return this.repoInfo.description ? this.repoInfo.description : this.repoInfo.id;
			} else {
				return this.$route.params.repoId;
			}
		},
		repoTitle() {
			if (this.repoInfo) {
				return this.repoInfo.description ? this.repoInfo.description : '(no name)';
			} else {
				return '(no name)';
			}
		},
		repoLink() {
			return window.location.href;
		},
		pageTitle() {
			return this.page.title ? this.page.title : '(no title)';
		},
		pageImage() {
			return this.pngImage ? ('data:image/png;base64,' + this.pngImage) : ''; 
		}
	},
	watch: {
	},
	created () {
		this.iri = this.$route.params.iri;
		this.apiClient = this.$root.apiClient;
		this.apiClient.setRepository(this.$route.params.repoId);
		this.apiClient.getRepositoryInfo(this.$route.params.repoId).then((info) => { 
			this.repoInfo = info;
			RepositoryData.addID(info.id); // add the repository to the list of known repositories
		});
		this.fetchUserInfo();
		this.fetchPageInfo();
		this.fetchPageImage();
	},
	methods: {

		async fetchUserInfo() {
			this.error = null;
			this.userInfo = await this.apiClient.getUserInfo();
		},

		async fetchPageInfo() {
			this.loading = true;
			this.page = await this.apiClient.fetchArtifactInfo(this.iri);
			if (this.page._type !== BOX.Page) {
				// only Page artifacts are supported by this view
				this.page = null;
			}
			this.loading = false;
		},

		async fetchPageImage() {
			try {
				const val = await this.apiClient.getSubjectValue(this.iri, BOX.pngImage);
				this.pngImage = val.value;
			} catch (e) {
				this.pngImage = null;
			}
		},

		quit() {
			this.$router.push({name: 'repo', params: { repoId: this.$route.params.repoId }});
		}

	}
}
</script>

<style>
.page-view-main {
	margin: 2em;
}
.page-view-main .info {
	margin: 1em 0;
}
.page-view-main .info th, .page-view-main .info td {
	padding: 0.3em;
}
.page-view-main .info th {
	text-align: left;
	font-weight: bold;
}
.page-view-main .screenshot {
	float: right;
	max-height: 20em;
	min-width: 10em;
}
</style>
