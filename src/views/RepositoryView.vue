<template>
    <div class="repository-view container-fluid vh-100 d-flex flex-column">
		<!-- Repository menu -->
		<div class="row">
			<nav class="navbar navbar-expand-sm navbar-dark bg-dark">
				<a class="navbar-brand mb-0 h1" href="#">FitLayout</a>
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
			<div class="view-artifact h-100">
				<PageView :artifactIri="iri" v-on:select-artifact="selectArtifact" />
			</div>
		</div>
	</div>
</template>

<script>
import PageView from '@/components/PageView.vue';
import InvokePanel from '@/components/InvokePanel.vue';
import BOX from '@/ontology/BOX.js';
import SEGM from '@/ontology/SEGM.js';

export default {
	name: 'RepositoryView',
	components: {
		PageView,
		InvokePanel
	},
	data () {
		return {
			pageType: BOX.Page,
			areaTreeType: SEGM.AreaTree,
			mode: 'render'
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
</style>
