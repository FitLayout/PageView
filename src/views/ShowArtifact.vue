<template>
	<div class="view-artifact h-100">
		<!--<p>Show: <code>{{ iri }}</code></p>-->
		<PageView :artifactIri="iri" v-on:select-artifact="selectArtifact" />
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
	},
	methods: {
		selectArtifact(iri) {
			console.log('SEL ' + iri);
			if (iri !== this.iri) {
				this.$router.push({name: 'show', params: {iri: iri}});
			}
		}
	}
}
</script>
