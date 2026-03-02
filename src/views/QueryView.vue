<template>
	<div class="query-view">
		<div class="query-editor">
			<RdfEditor @resultReturn="resultsHandler" @loadingResult="loadingStart" />
		</div>
		<div class="query-results">
			<QueryResults v-if="queryResult && !loading" :result="queryResult" />
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { RdfEditor, QueryResults } from '@/rdf4j-vue-components/src';

export default defineComponent({
	name: 'QueryView',
	components: {
		RdfEditor,
		QueryResults
	},
	props: {
	},
	inject: ['apiClient'],
	data () {
		return {
			loading: false,
			queryResult: null
		}
	},
	created () {
		this.update();
	},
	computed: {
		repoId() {
			return this.$route.params.repoId;
		}
	},
	watch: {
	},
	methods: {
		update() {
		},

		loadingStart(start) {
			this.loading = start;
		},

		resultsHandler(r) {
			this.queryResult = r;
			console.log(r);
		},

	}
})
</script>

<style>
.query-view .query-editor {
	margin: 0 2em;
}
</style>
