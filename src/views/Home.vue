<template>
	<div class="view-home container-fluid">
		<!-- Repository menu -->
		<div class="row">
			<nav class="navbar navbar-expand-sm navbar-dark bg-dark">
				<a class="navbar-brand mb-0 h1" href="#/">FitLayout</a>
				<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
					<span class="navbar-toggler-icon"></span>
				</button>
				<div class="collapse navbar-collapse" id="navbarNav">
					<ul class="navbar-nav">
					</ul>
				</div>
			</nav>
		</div>

		<h2>Repository list</h2>
		<ul>
			<li v-for="repo in repositoryList" :key="repo.id">
				<router-link
					:to="{ name: 'repo', params: { repoId: repo.id } }"
					class="nav-link"
					active-class="active">
						{{repo.id}}
				</router-link>
				{{repo.description}}
			</li>
		</ul>
	</div>
</template>

<script>
import {ApiClient} from '@/common/apiclient.js';

export default {
	name: 'home',
	data() {
		return {
			apiClient: null,
			storageStatus: null,
			repositoryList: null
		}
	},
	created () {
		this.apiClient = new ApiClient();
		this.loadRepositoryInfo();
	},
	methods: {
		async loadRepositoryInfo() {
			this.storageStatus = await this.apiClient.getStorageStatus();
			this.repositoryList = await this.apiClient.listRepositories();
		}
	}
}
</script>
