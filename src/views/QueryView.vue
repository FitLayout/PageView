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
import { defineComponent, inject } from 'vue';
import { RdfEditor, QueryResults } from '@/rdf4j-vue-components/src';

import type { FLApiClient } from '@/common/apiclient.js';
import type { SelectQueryResult } from '@/rdf4j-vue-components/src/common/types';

interface ComponentData {
	loading: boolean;
	queryResult: SelectQueryResult | null;
}

export default defineComponent({
	name: 'QueryView',
	components: {
		RdfEditor,
		QueryResults
	},
	props: {
	},
	setup() {
		return {
			apiClient: inject('apiClient') as FLApiClient
		}
	},
	data (): ComponentData {
		return {
			loading: false,
			queryResult: null
		}
	},
	created () {
		this.update();
	},
	computed: {
		repoId(): string | string[] {
			return this.$route.params.repoId;
		}
	},
	watch: {
	},
	methods: {
		update(): void {
		},

		loadingStart(start: boolean): void {
			this.loading = start;
		},

		resultsHandler(r: SelectQueryResult): void {
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
