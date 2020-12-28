<template>
	<div class="view-home">
		<p>Welcome home.</p>
		<p>
		<router-link
            :to="{ name: 'show', params: { iri: 'http://fitlayout.github.io/resource/art261' } }"
            class="nav-link"
            active-class="active">
            	Show artifact
		</router-link>
		</p>
	</div>
</template>

<script>
export default {
	name: 'home'
}
</script>
