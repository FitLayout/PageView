<template>
	<div class="repository-config">
		<h2>Tags</h2>
		<DataTable :value="tags" tableStyle="min-width: 50rem" class="p-datatable-small"
			v-model:filters="filters" filterDisplay="row"
			scrollable scrollHeight="20em">
			<Column field="iri" header="IRI" sortable>
				<template #body="{ data }">
                    <Iri :iri="data.iri" />
					<i v-tooltip="'Show in RDF explorer'" class="ml-2 pi pi-share-alt" 
						style="cursor: pointer" @click="() => { exploreTag(data.iri) }" />
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter" placeholder="Search by IRI" />
                </template>
			</Column>
			<Column field="name" header="Name" sortable>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter" placeholder="Search by name" />
                </template>
			</Column>
			<Column field="type" header="Type" sortable>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter" placeholder="Search by type" />
                </template>
			</Column>
		</DataTable>

		<h2 class="mt-6">Prefixes</h2>
		<DataTable :value="namespaces" tableStyle="min-width: 50rem" class="p-datatable-small"
			scrollable scrollHeight="30em">
			<Column field="prefix" header="Prefix" sortable></Column>
			<Column field="namespace" header="Namespace" sortable></Column>
		</DataTable>
	</div>
</template>

<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Iri from './Iri.vue';

import { FilterMatchMode } from 'primevue/api';

export default {
	name: 'RepositoryConfig',
	inject: ['apiClient'],
	props: {
	},
	components: {
		DataTable,
		Column,
		InputText,
		Iri
	},
	data () {
		return {
			namespaces: [],
			tags: [],
			filters: {
                iri: { value: null, matchMode: FilterMatchMode.CONTAINS },
                name: { value: null, matchMode: FilterMatchMode.CONTAINS },
                type: { value: null, matchMode: FilterMatchMode.CONTAINS }
            }
		}
	},
	created () {
	},
	mounted () {
		this.fetchNamespaces();
		this.fetchTags();
	},
	methods: {
		async fetchNamespaces() {
			let ns = [];
			let data = await this.apiClient.getNamespaces();
			for (let bind of data.results.bindings) {
				ns.push({prefix: bind.prefix.value, namespace: bind.namespace.value});
			}
			this.namespaces = ns;
		},

		async fetchTags() {
			const data = await this.apiClient.getTags();
			this.tags = data;
		},

		exploreTag(iri) {
			console.log(iri);
			let route = this.$router.resolve({name: 'explore', params: { repoId: this.$route.params.repoId, iri: iri }});
			window.open(route.href, '_blank');
		}
	}
}
</script>

<style>
</style>
