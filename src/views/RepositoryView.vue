<template>
	<div class="view-artifact h-100">
		<!--<p>Show: <code>{{ iri }}</code></p>-->
		<PageView :artifactIri="iri" v-on:select-artifact="selectArtifact" />
	</div>
</template>

<script>
import PageView from '@/components/PageView.vue';

export default {
	name: 'RepositoryView',
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
		},
		repoId() {
			return this.$route.params.repoId;
		}
	},
	methods: {
		selectArtifact(iri) {
			if (iri !== this.iri) {
				this.$router.push({name: 'show', params: {repoId: this.repoId, iri: iri}});
			}
		}
	}
}
</script>
