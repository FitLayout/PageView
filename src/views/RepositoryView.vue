<template>
    <div class="repository-view">
		<!-- Repository menu -->
		<Menubar :model="menuItems" style="font-size:120%">
			<template #start>FitLayout</template>
		</Menubar>
		<!-- Service panels -->
		<div class="panel-row">
			<InvokePanel id="r" :target="pageType" :currentArtifact="currentArtifact" action="Render" class="serv-panel panel-render" :class="panelClass('render')"></InvokePanel>
			<InvokePanel id="s" :source="pageType" :target="areaTreeType" :currentArtifact="currentArtifact" action="Segment" class="serv-panel panel-segm" :class="panelClass('segm')"></InvokePanel>
			<InvokePanel id="p" :source="areaTreeType" :target="areaTreeType" :currentArtifact="currentArtifact" action="Process" class="serv-panel panel-post" :class="panelClass('post')"></InvokePanel>
		</div>
		<!-- Artifact view -->
		<div class="row flex-fill overflow-hidden">
			<div class="view-artifact h-100 row">
				<!-- Sidebar -->
				<div class="sidebar-scroll col-4">
					<div><i class="bi bi-eye-slash-fill"></i></div>
					<div class="sidebar">
						<ArtTree :artifacts="artifacts" :currentIri="iri"
							v-on:select-artifact="selectArtifact"
							v-on:delete-artifact="deleteArtifact">
						</ArtTree>
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
import Menubar from 'primevue/menubar';
//import TabMenu from 'primevue/tabmenu';

import InvokePanel from '@/components/InvokePanel.vue';
import PageView from '@/components/PageView.vue';
import ArtTree from '@/components/ArtTree.vue';
import BOX from '@/ontology/BOX.js';
import SEGM from '@/ontology/SEGM.js';
import IriDecoder from '@/common/iridecoder.js';
import {ApiClient} from '@/common/apiclient.js';

export default {
	name: 'RepositoryView',
	components: {
		Menubar,
		//TabMenu,
		InvokePanel,
		PageView,
		ArtTree
	},
	data () {
		return {
			pageType: BOX.Page,
			areaTreeType: SEGM.AreaTree,
			mode: 'render',
			artifacts: null,
			currentArtifact: null,

			menuItems: [
				{ label: 'Render', command: () => {this.selectMode('render');} },
				{ label: 'Segmentation', command: () => {this.selectMode('segm');} },
				{ label: 'Postprocess', command: () => {this.selectMode('post');} },
			]
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
	watch: {
		'iri': 'update'
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

		async deleteArtifact(iri) {
			let dec = new IriDecoder();
			let shortIri = dec.encodeIri(iri);
			if (window.confirm('Are you sure to delete the artifact ' + shortIri + ' and all derived artifacts?')) {
				const client = new ApiClient();
				try {
					this.artifact = await client.deleteArtifact(this.iri);
				} catch (error) {
					console.error('Couldnt delete artifact!', error);
				}
				this.update();
			}
		},

		findArtifact(iri) {
			for (let art of this.artifacts) {
				if (art._iri === iri) {
					return art;
				}
			}
			return null;
		},

		async fetchArtifacts() {
			console.log('fetch art tree')
			this.error = null;
			this.loading = true;
			
			const client = new ApiClient();
			try {
				this.artifacts = await client.fetchArtifactInfoAll();
				if (this.iri) {
					this.currentArtifact = this.findArtifact(this.iri);
				}
				this.loading = false;
			} catch (error) {
				this.error = error.message;
				this.loading = false;
				console.error('Error while fetching artifact info!', error);
			}
		},

		update() {
			this.fetchArtifacts();
		}

	}
}
</script>

<style>
.serv-panel.hidden {
	display: none;
}
/*.navbar .nav-link.active {
	background-color: rgba(255, 255, 255, 0.2);
}
.sidebar-scroll {
	height: 100%;
	overflow: auto;
}
.sidebar {
	font-size: 80%;
}*/
</style>
