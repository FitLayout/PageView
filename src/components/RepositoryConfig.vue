<template>
	<div class="repository-config">
		<h2>Tagger-assigned tags</h2>
		<div class="tag-cards">
			<TagCard v-for="tag in assignedTags" :tag="tag" v-bind:key="tag.iri" />
		</div>

		<h2>All declared tags</h2>
		<DataTable :value="tags" tableStyle="min-width: 50rem" class="p-datatable-small"
			v-model:filters="filters" filterDisplay="row"
			scrollable scrollHeight="30em">
			<Column field="iri" header="IRI" sortable>
				<template #body="{ data }">
					<span class="tag badge" :style="tagDisplayStyle(data)" v-tooltip.bottom="data.iri">{{ data.type }}:{{ data.name }}</span>
					<a target="_blank" :href="exploreTagLink(data.iri)"><i v-tooltip="'Show in RDF explorer'" class="ml-2 pi pi-share-alt"></i></a>
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
			<Column field="context" header="Context" sortable>
				<template #body="{ data }">
                    <Iri :iri="data.context" />
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter" placeholder="Search by Context" />
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
import TagCard from './TagCard.vue';

import { FilterMatchMode } from 'primevue/api';

import {stringColor} from '../common/utils.js';


export default {
	name: 'RepositoryConfig',
	inject: ['apiClient'],
	props: {
	},
	components: {
		DataTable,
		Column,
		InputText,
		Iri,
		TagCard
	},
	data () {
		return {
			namespaces: [],
			tags: [],
			assignedTags: [],
			filters: {
                iri: { value: null, matchMode: FilterMatchMode.CONTAINS },
                name: { value: null, matchMode: FilterMatchMode.CONTAINS },
                type: { value: null, matchMode: FilterMatchMode.CONTAINS },
                context: { value: null, matchMode: FilterMatchMode.CONTAINS }
            }
		}
	},
	created () {
	},
	mounted () {
		this.fetchAssignedTags();
		this.fetchTags();
		this.fetchNamespaces();
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

		async fetchAssignedTags() {
			const query = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
				PREFIX segm: <http://fitlayout.github.io/ontology/segmentation.owl#>
				SELECT ?tag ?name ?type ?tagger ?context WHERE {
 				 	GRAPH ?context { 
						?tag rdf:type segm:Tag . 
						?tag segm:name ?name .
						?tag segm:type ?type .
						?tag segm:tagger ?tagger 
					} 
				}`;
			let resp = await this.apiClient.selectQuery(query);
            let tags = [];
            if (resp && resp.results && resp.results.bindings) {
                for (let binding of resp.results.bindings) {
                    const iri = binding.tag.value;
                    const name = binding.name.value;
                    const type = binding.type.value;
					const tagger = binding.tagger.value;
					const context = binding.context.value;
                    tags.push({iri, name, type, tagger, context});
                }
            }
			this.assignedTags = tags;
		},

		exploreTagLink(iri) {
			let route = this.$router.resolve({name: 'explore', params: { repoId: this.$route.params.repoId, iri: iri }});
			return route.href;
		},

		tagDisplayStyle(tag) {
			return 'background-color:' + stringColor(tag.name);
		}
	}
}
</script>

<style>
.tag-cards {
	overflow: hidden;
}
.repository-config .badge {
	font-size: 100%;
}
</style>
