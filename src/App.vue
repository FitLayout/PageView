<template>
  <div id="app" class="container-fluid vh-100 d-flex flex-column">

	<div class="row">
		<nav class="navbar navbar-expand-sm navbar-dark bg-dark">
			<div class="container-fluid">
				<a class="navbar-brand" href="#">FitLayout</a>
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
			</div>
		</nav>
	</div>
	<div class="row">
		<InvokePanel id="r" :target="pageType" action="Render" class="serv-panel panel-render" :class="panelClass('render')"></InvokePanel>
		<InvokePanel id="s" :target="areaTreeType" action="Segment" class="serv-panel panel-segm" :class="panelClass('segm')"></InvokePanel>
	</div>

	<div class="row flex-fill overflow-hidden">
		<router-view></router-view>
	</div>
  </div>
</template>

<script>
import InvokePanel from '@/components/InvokePanel.vue';
import BOX from '@/ontology/BOX.js';
import SEGM from '@/ontology/SEGM.js';

export default {
    name: 'app',
	data () {
		return {
			pageType: BOX.Page,
			areaTreeType: SEGM.AreaTree,
			mode: 'render',
			hidePanels: false
		}
	},
	methods: {
		selectMode(mode) {
			if (mode == this.mode) {
				this.hidePanels = !this.hidePanels;
			} else {
				this.mode = mode;
				this.hidePanels = false;
			}
		},
		panelClass(mode) {
			return (mode === this.mode && !this.hidePanels) ? 'visible' : 'hidden';
		}
	},
	components: {
		InvokePanel
	}
}
</script>

<style>
#app {
  /*font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;*/
}
.serv-panel.hidden {
	display: none;
}
</style>
