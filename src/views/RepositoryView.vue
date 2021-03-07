<template>
    <div class="repository-view container-fluid vh-100 d-flex flex-column">
		<!-- Repository menu -->
		<div class="row">
			<nav class="navbar navbar-expand-sm navbar-dark bg-dark">
				<a class="navbar-brand mb-0 h1" href="#/">FitLayout</a>
				<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
					<span class="navbar-toggler-icon"></span>
				</button>
				<div class="collapse navbar-collapse" id="navbarNav">
					<ul class="navbar-nav">
						<li class="nav-item">
							<a class="nav-link" :class="mode=='render' ? 'active' : ''" href="#" id="renderItem" role="button" v-on:click="selectMode('render')">Render</a>
						</li>
						<li class="nav-item">
							<a class="nav-link" :class="mode=='segm' ? 'active' : ''" href="#" id="segmentItem" role="button" v-on:click="selectMode('segm')">Segmentation</a>
						</li>
					</ul>
				</div>
			</nav>
		</div>
		<!-- Service panels -->
		<div class="row">
			<InvokePanel id="r" :target="pageType" action="Render" class="serv-panel panel-render" :class="panelClass('render')"></InvokePanel>
			<InvokePanel id="s" :target="areaTreeType" action="Segment" class="serv-panel panel-segm" :class="panelClass('segm')"></InvokePanel>
		</div>
		<!-- Artifact view -->
		<div class="row flex-fill overflow-hidden">
			<div class="view-artifact h-100 row">
				<!-- Sidebar -->
				<div class="sidebar-scroll col-4">
					<div><i class="bi bi-eye-slash-fill"></i></div>
					<div class="sidebar">
						<ArtTree :artifacts="artifacts" :currentIri="iri" v-on:select-artifact="selectArtifact"></ArtTree>
					</div>
				</div>
				<!-- Page view -->
				<PageView :artifactIri="iri" v-on:select-artifact="selectArtifact" v-if="iri" />
				<div class="empty-page h-100 col-8 d-flex align-items-center" v-if="!iri">
					<p class="flex-fill text-center text-secondary">No page selected</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import InvokePanel from '@/components/InvokePanel.vue';
import PageView from '@/components/PageView.vue';
import ArtTree from '@/components/ArtTree.vue';
import BOX from '@/ontology/BOX.js';
import SEGM from '@/ontology/SEGM.js';
import {ApiClient} from '@/common/apiclient.js';

export default {
	name: 'RepositoryView',
	components: {
		InvokePanel,
		PageView,
		ArtTree
	},
	data () {
		return {
			pageType: BOX.Page,
			areaTreeType: SEGM.AreaTree,
			mode: 'render',
			artifacts: null
		}
	},
	computed: {
		iri() {
			return this.$route.params.iri;
		},
		repoId() {
			return this.$route.params.repoId;
		}
	},
	created () {
		this.fetchArtifacts();
	},
	methods: {
		selectMode(mode) {
			if (mode == this.mode) {
				this.mode = 'off';
			} else {
				this.mode = mode;
			}
		},
		panelClass(mode) {
			return (mode === this.mode) ? 'visible' : 'hidden';
		},

		selectArtifact(iri) {
			if (iri !== this.iri) {
				this.$router.push({name: 'show', params: {repoId: this.repoId, iri: iri}});
			}
		},

		findArtifact(iri) {

		},

		async fetchArtifacts() {
			console.log('fetch art tree')
			this.error = null;
			this.loading = true;
			
			const client = new ApiClient();
			try {
				this.artifacts = await client.fetchArtifactInfoAll();
						console.log(this.artifacts);

				this.loading = false;
			} catch (error) {
				this.error = error.message;
				this.loading = false;
				console.error('Error while fetching artifact info!', error);
			}
		}

	}
}
</script>

<style>
.serv-panel.hidden {
	display: none;
}
.navbar .nav-link.active {
	background-color: rgba(255, 255, 255, 0.2);

}
.sidebar-scroll {
	height: 100%;
	overflow: auto;
}
.sidebar {
	font-size: 80%;
}
</style>
