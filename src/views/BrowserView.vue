<template>
    <div class="browser-view">
		<!-- Repository menu -->
		<div class="menu-row">
			<Menubar id="mainmenu" :model="menuItems" style="font-size:120%">
				<template #start><span class="logo">FitLayout</span></template>
				<template #end>
					<span class="repo-info">Repository: <b>{{repoName}}</b><span v-if="repoReadOnly">[read-only]</span></span>
					<Button icon="pi pi-sign-out" 
							class="p-button-rounded p-button-text" 
							v-tooltip.bottom="'Close browser'" 
							@click="quit()" />&nbsp;
					<UserAvatar :userInfo="userInfo" v-tooltip.bottom="userInfo ? ('User: ' + userInfo.userId) : 'User'" />
				</template>
			</Menubar>
		</div>
		<!-- Service panels -->
		<div class="panel-row">
			<InvokePanel id="r" :source="'ANY'" :target="pageType" 
				:currentArtifact="currentArtifact" action="Render"
				class="serv-panel panel-render" :class="panelClass('render')"
				v-on:created="artifactCreated"></InvokePanel>
			<InvokePanel id="s" :source="pageType" :target="areaTreeType" 
				:currentArtifact="currentArtifact" action="Segment" 
				class="serv-panel panel-segm" :class="panelClass('segm')"
				v-on:created="artifactCreated"></InvokePanel>
			<InvokePanel id="p" :source="areaTreeType" :target="areaTreeType" :grouped="true"
				:currentArtifact="currentArtifact" action="Process" 
				class="serv-panel panel-post" :class="panelClass('post')"
				v-on:created="artifactCreated"></InvokePanel>
			<InvokePanel id="c" :source="areaTreeType" :target="chunkSetType"
				:currentArtifact="currentArtifact" action="Process" 
				class="serv-panel panel-text" :class="panelClass('text')"
				v-on:created="artifactCreated"></InvokePanel>
			<InvokePanel id="rr" :source="'ANY'" :target="'NONE'" :grouped="true"
				:currentArtifact="currentArtifact" action="Process" 
				class="serv-panel panel-rels" :class="panelClass('rels')"
				v-on:created="artifactCreated"></InvokePanel>
		</div>

		<div class="content-row">
			<ConfirmDialog></ConfirmDialog>

			<div class="sidebar" :class="visibleLeft?'visible':'hidden'">
				<Button class="p-button-sm" v-if="!visibleLeft" icon="pi pi-arrow-right" @click="visibleLeft = true" />
				<Button class="p-button-sm" v-if="visibleLeft" icon="pi pi-arrow-left" @click="visibleLeft = false" />
				<div class="sidebar-scroll">
					<div class="sidebar-cont">
						<ArtTree ref="artTree" :currentIri="treeSelectedIri"
							v-on:select-artifact="selectArtifact"
							v-on:delete-artifact="deleteArtifact">
						</ArtTree>
					</div>
				</div>
			</div>

			<PageView :subjectIri="iri" v-if="iri" v-on:status-update="update" />
			<div class="empty-page w-12 flex align-items-center justify-content-center h-100" v-if="!iri">
				<p class="text-center p-text-secondary">No page selected</p>
			</div>

		</div>
	</div>
</template>

<script>
import Menubar from 'primevue/menubar';
import Button from 'primevue/button';
import ConfirmDialog from 'primevue/confirmdialog';

import UserAvatar from '../components/UserAvatar.vue';
import InvokePanel from '../components/InvokePanel.vue';
import PageView from '../components/PageView.vue';
import ArtTree from '../components/ArtTree.vue';
import BOX from '../ontology/BOX.js';
import SEGM from '../ontology/SEGM.js';
import IriDecoder from '../common/iridecoder.js';

export default {
	name: 'BrowserView',
	components: {
		Menubar,
		Button,
		ConfirmDialog,
		UserAvatar,
		InvokePanel,
		PageView,
		ArtTree
	},
	data() {
		return {
			apiClient: this.$root.apiClient,
			repoInfo: null,
			userInfo: null,
			pageType: BOX.Page,
			areaTreeType: SEGM.AreaTree,
			chunkSetType: SEGM.ChunkSet,
			connectionSetType: BOX.ConnectionSet,
			mode: 'render',
			currentArtifact: null,
			currentArtifactIri: null,
			currentPageIri: null,
			selectionStatus: null,
			visibleLeft: true,

			menuItems: [
				{ label: 'Render', class: 'selected', command: () => {this.selectMode('render', 0);} },
				{ label: 'Segmentation', class: 'normal', command: () => {this.selectMode('segm', 1);} },
				{ label: 'Postprocess', class: 'normal', command: () => {this.selectMode('post', 2);} },
				{ label: 'Text', class: 'normal', command: () => {this.selectMode('text', 3);} },
				{ label: 'Enhance', class: 'normal', command: () => {this.selectMode('rels', 4);} },
			]
		}
	},
	provide() {
		return {
			apiClient: this.apiClient
		}
	},
	computed: {
		iri() {
			return this.$route.params.iri;
		},
		treeSelectedIri() {
			if (this.currentArtifactIri) {
				return this.currentArtifactIri; //obtained by resolving
			} else {
				return this.$route.params.iri; //nothing obtained yet; use the URL-specified iri 
			}
		},
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
		repoReadOnly() {
			return this.repoInfo && this.repoInfo.readOnly;
		} 
	},
	watch: {
		'pageStatus': 'update'
	},
	created () {
		this.apiClient = this.$root.apiClient;
		this.apiClient.setRepository(this.$route.params.repoId);
		this.apiClient.getRepositoryInfo(this.$route.params.repoId).then((info) => { 
			this.repoInfo = info;
		});
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
			this.$confirm.require({
                message: 'Are you sure to delete the artifact ' + shortIri + ' and all derived artifacts?',
                header: 'Artifact deletion',
                icon: 'pi pi-exclamation-triangle',
                accept: async () => {
					try {
						this.artifact = await this.apiClient.deleteArtifact(iri);
					} catch (error) {
						console.error('Couldnt delete artifact!', error);
					}
					this.$refs.artTree.fetchArtifacts();
					// if the deleted artifact was selected try to select another one
					if (this.currentArtifactIri === iri) {
						if (this.currentArtifact.hasParentArtifact) {
							const parentIri = this.currentArtifact.hasParentArtifact._iri;
							this.$router.push({name: 'show', params: {repoId: this.repoId, iri: parentIri}});
						} else {
							this.$router.push({name: 'browser', params: {repoId: this.repoId }});
						}
					}
                },
                reject: () => {
                }
            });
		},

		update(status) {
			this.selectionStatus = status;
			this.currentArtifact = status.artifact;
			if (status.artifact) {
				this.currentArtifactIri = status.artifact._iri;
				// check if the source page has changed in order to reload the artifact list
				let newPageIri = status.artifact._iri;
				if (status.artifact.hasSourcePage) {
					newPageIri = status.artifact.hasSourcePage._iri;
				}
				if (newPageIri !== this.currentPageIri) {
					this.currentPageIri = newPageIri;
					this.$refs.artTree.fetchArtifacts();
				}
			}
		},

		artifactCreated(iri) {
			this.$refs.artTree.fetchArtifacts();
			this.selectArtifact(iri);
		},

		quit() {
			//this.$router.push({name: 'home'});
			this.$router.push({name: 'repo', params: { repoId: this.$route.params.repoId }});
		}

	}
}
</script>

<style>
.browser-view {
	height: 100vh;
	overflow: hidden;
	display: flex;
	flex-direction: column;
}
.serv-panel.hidden {
	display: none;
}
.menu-row, .panel-row {
	flex: 0 0 auto;
}
.menu-row .repo-info {
	font-size: 80%;
	vertical-align: 50%;
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
