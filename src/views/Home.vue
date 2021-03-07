<template>
	<div class="view-home">
		<p>Welcome home.</p>
		<p>
			<router-link
				:to="{ name: 'show', params: { repoId: 'default', iri: 'http://fitlayout.github.io/resource/art1' } }"
				class="nav-link"
				active-class="active">
					Show page
			</router-link>
		</p>
	</div>
</template>

<script>
export default {
	name: 'home'
}
</script>
