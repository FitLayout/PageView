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

		<p>Welcome home.</p>
		<p>
			<router-link
				:to="{ name: 'repo', params: { repoId: 'default' } }"
				class="nav-link"
				active-class="active">
					Show default repository
			</router-link>
		</p>
	</div>
</template>

<script>
export default {
	name: 'home'
}
</script>
