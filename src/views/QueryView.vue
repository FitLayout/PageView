<template>
    <div class="query-view">
        <div class="query-editor">
            <RdfEditor @resultReturn="resultsHandler" @loadingResult="loadingStart" />
        </div>
        <div class="query-results">
            <QueryResults v-if="queryResult && !loading" :result="queryResult">
				<template #value="rdfValue">
                    <ValueInfo :data="getValInfo(rdfValue)" :activeIris="true" 
                        extIcon="pi pi-globe" extTooltip="Show in Browser"
                        structIcon="pi pi-share-alt" 
                        @show-iri="showIri"	@show-ext="showExt" @show-struct="showIri" />
                </template>
            </QueryResults>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';
import { RdfEditor, QueryResults } from '@/rdf4j-vue-components/src';

import type { FLApiClient } from '@/common/apiclient.js';
import type { DisplayValue, QueryResult, RdfValueSpec } from '@/rdf4j-vue-components/src/common/types';

interface ComponentData {
    loading: boolean;
    queryResult: QueryResult | null;
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
        getValInfo(data: RdfValueSpec): DisplayValue {
            return { v: data }; 
        },

        update(): void {
        },

        loadingStart(start: boolean): void {
            this.loading = start;
        },

        resultsHandler(r: QueryResult): void {
            this.queryResult = r;
            console.log(r);
        },

        showIri(iri: string): void {
			let route = this.$router.resolve({name: 'explore', params: { repoId: this.$route.params.repoId, iri: iri }});
			window.open(route.href, '_blank');
		},

		showExt(iri: string): void {
			let route = this.$router.resolve({name: 'show', params: { repoId: this.$route.params.repoId, iri: iri }});
			window.open(route.href, '_blank');
		}

    }
})
</script>

<style>
.query-view .query-editor {
    margin: 0 2em;
}
</style>
