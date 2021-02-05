<template>
	<div class="view-artifact h-100">
		<!--<p>Show: <code>{{ iri }}</code></p>-->
		<PageView :artifactIri="iri" />
	</div>
</template>

<script>
import PageView from '@/components/PageView.vue';

export default {
	name: 'show',
	components: {
		PageView
	},
	data () {
		return {
		}
	},
	computed: {
		iri() {
			return this.$route.params.iri;
		}
	}
}
</script>
