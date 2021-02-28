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
					<li class="nav-item dropdown">
						<a class="nav-link dropdown-toggle" href="#" id="renderDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
							Render
						</a>
						<div class="dropdown-menu dropdown-menu-dark" aria-labelledby="renderDropdown">
							<InvokePanel :target="pageType"></InvokePanel>
						</div>
					</li>
				</ul>
			</div>
			</div>
		</nav>
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
			pageType: BOX.Page
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
</style>
