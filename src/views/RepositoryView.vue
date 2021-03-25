<template>
    <div class="repository-view">
		<!-- Repository menu -->
		<div class="menu-row">
			<Menubar id="mainmenu" :model="menuItems" style="font-size:120%">
				<template #start><span class="logo">FitLayout</span></template>
			</Menubar>
		</div>
		<!-- Service panels -->
		<div class="panel-row">
			<InvokePanel id="r" :target="pageType" :currentArtifact="currentArtifact" action="Render" class="serv-panel panel-render" :class="panelClass('render')"></InvokePanel>
			<InvokePanel id="s" :source="pageType" :target="areaTreeType" :currentArtifact="currentArtifact" action="Segment" class="serv-panel panel-segm" :class="panelClass('segm')"></InvokePanel>
			<InvokePanel id="p" :source="areaTreeType" :target="areaTreeType" :currentArtifact="currentArtifact" action="Process" class="serv-panel panel-post" :class="panelClass('post')"></InvokePanel>
		</div>

		<div class="content-row">

			<div class="sidebar" :class="visibleLeft?'visible':'hidden'">
				<Button class="p-button-sm" v-if="!visibleLeft" icon="pi pi-arrow-right" @click="visibleLeft = true" />
				<Button class="p-button-sm" v-if="visibleLeft" icon="pi pi-arrow-left" @click="visibleLeft = false" />
				<div class="sidebar-scroll">
					<div class="sidebar-cont">
						<ArtTree :artifacts="artifacts" :currentIri="iri"
							v-on:select-artifact="selectArtifact"
							v-on:delete-artifact="deleteArtifact">
						</ArtTree>
					</div>
				</div>
			</div>

			<PageView :artifactIri="iri" v-on:select-artifact="selectArtifact" v-if="iri" />
			<div class="empty-page p-col-12 p-d-flex p-ai-center p-jc-center h-100" v-if="!iri">
				<p class="flex-fill p-text-center p-text-secondary">No page selected</p>
			</div>

		</div>
	</div>
</template>

<script>
import Menubar from 'primevue/menubar';
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';
import Sidebar from 'primevue/sidebar';
import Button from 'primevue/button';

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
		Splitter,
		SplitterPanel,
		Sidebar,
		Button,
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
			visibleLeft: null,

			menuItems: [
				{ label: 'Render', class: 'selected', command: () => {this.selectMode('render', 0);} },
				{ label: 'Segmentation', class: 'normal', command: () => {this.selectMode('segm', 1);} },
				{ label: 'Postprocess', class: 'normal', command: () => {this.selectMode('post', 2);} },
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
		selectMode(mode, index) {
			if (mode == this.mode) {
				this.mode = 'off';
			} else {
				this.mode = mode;
			}
			for (let i = 0; i < this.menuItems.length; i++) {
				if (i === index) {
					this.menuItems[i].class = 'selected';
				} else {
					this.menuItems[i].class = 'normal';
				}
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
.repository-view {
	height: 100vh;
	overflow: hidden;
	display: flex;
	flex-direction: column;
}
.logo {
	padding: 0.5em 1em;
	background: var(--surface-d);
	display: inline-block;
	border-radius: 5px;
	font-weight: bold;
}
#mainmenu .selected .p-menuitem-link {
	background-color: var(--primary-color);
}
#mainmenu .selected .p-menuitem-link .p-menuitem-text {
	color: var(--primary-color-text);
}
.serv-panel.hidden {
	display: none;
}
.menu-row, .panel-row {
	flex: 0 0 auto;
}
.panel-row {
	padding: 0.5em 1em 0 1em;
}
.content-row {
	flex: 1 1 auto;
	overflow: hidden;
	display: flex;
	flex-direction: row;
}
.sidebar .p-button {
	position: absolute;
	left: 0;
	top: 0;
	z-index: 100;
}
.sidebar {
	flex: 0 0 auto;
	position: relative;
	padding-left: 1em;
	width: 22em;
	transition: all 0.3s;
}
.sidebar-scroll {
	height: 100%;
	overflow: auto;
	position: relative;
	width: calc(100% - 0.5em);
	opacity: 1;
	transition: all 0.5s;
}
.sidebar-cont {
	position: absolute;
	width: 100%;
	height: 100%;
	padding: 0 0.5em 0 0.5em;
	top: 0;
	left: 0;
}
.sidebar.hidden {
	width: 1.5em;
	transition: all 0.3s;
}
.sidebar.hidden .sidebar-scroll {
	opacity: 0;
	transition: all 0.5s;
}
</style>
