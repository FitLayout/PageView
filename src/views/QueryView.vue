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

<script>
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

import Iri from '@/components/Iri.vue';
import SubjectInfo from '@/components/SubjectInfo.vue';
import RdfEditor from '@/components/querying/RdfEditor';
import QueryResults from "@/components/querying/QueryResults.vue"

import IriDecoder from '@/common/iridecoder.js';


export default {
	name: 'QueryView',
	components: {
		Button,
		InputText,
		Iri,
		SubjectInfo,
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
}
</script>

<style>
.query-view .query-editor {
	margin: 0 2em;
}
</style>
