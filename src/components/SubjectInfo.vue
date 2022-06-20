<template>
	<div class="subject-info" v-if="iri">
		<DataTable :value="subjectModel" class="p-datatable-sm"
			v-model:filters="dFilters" filterDisplay="row"
			:resizableColumns="true" columnResizeMode="expand"
			:scrollable="true" scrollHeight="flex"
			showGridlines>
			<Column header="Property" filterField="p.value">
				<template #body="rowdata">
					<Iri :iri="rowdata.data.p.value" :active="activeIris" @show-iri="showIri"/>
				</template>
				<template #filter="{filterModel,filterCallback}">
					<InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" :placeholder="`Search by name - `" v-tooltip.top.focus="'Hit enter key to filter'"/>
				</template>												
			</Column>
			<Column header="Value" filterField="v.value">
				<template #body="rowdata">
					<ValueInfo :data="rowdata.data" :activeIris="activeIris" @show-iri="showIri" />
				</template>
				<template #filter="{filterModel,filterCallback}">
					<InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" :placeholder="`Search by value - `" v-tooltip.top.focus="'Hit enter key to filter'"/>
				</template>												
			</Column>
		</DataTable>
	</div>
</template>

<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';

import Iri from './Iri.vue';
import ValueInfo from './ValueInfo.vue';

import {FilterMatchMode,FilterOperator} from 'primevue/api';

const MAX_PROPERTY_ITEMS = 1000; // max number of properties displated in subject properties

export default {
	name: 'SubjectInfo',
	components: {
		InputText,
		DataTable,
		Column,
		Iri,
		ValueInfo,
	},
	emits: ['show-iri'],
	inject: ['apiClient'],
	props: {
		iri: null,
		activeIris: null
	},
	data () {
		return {
			subjectModel: null,
			dFilters: {
				'p.value': {value: null, matchMode: FilterMatchMode.CONTAINS},
				'v.value': {value: null, matchMode: FilterMatchMode.CONTAINS}
			}			
		}
	},
	created () {
		this.update();
	},
	watch: {
		iri: 'update'
	},
	methods: {
		async update() {
			if (this.iri) {
				const data = await this.apiClient.getSubjectDescription(this.iri);
				this.subjectModel = data.results.bindings;
				// fill missing values
				for (let item of this.subjectModel) {
					if (!item.v) {
						item.v = { type:'literal', value:'' };
					}
				}
			}
		},

		showIri(iri) {
			this.$emit('show-iri', iri);
		}
	}
}
</script>

<style>
</style>
