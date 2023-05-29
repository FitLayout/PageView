<template>
	<div class="query-list" v-if="queries">
		<DataTable :value="queries" 
			v-model:filters="dFilters" filterDisplay="row"
			:scrollable="true" scrollHeight="flex"
            selectionMode="single" dataKey="id"
            @rowSelect="selectRow" @rowDblclick="useRow"
			showGridlines>
            <Column header="ID" field="id" sortable>
            </Column>
			<Column header="Title" filterField="title" field="title" sortable>
				<template #filter="{filterModel,filterCallback}">
					<InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" :placeholder="`Search by title - `" v-tooltip.top.focus="'Hit enter key to filter'"/>
				</template>												
			</Column>
		</DataTable>
	</div>
</template>

<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';

import {FilterMatchMode} from 'primevue/api';

export default {
	name: 'QueryList',
	components: {
		InputText,
		DataTable,
		Column
	},
	inject: ['apiClient'],
    emits: ['select-query', 'use-query'],
	props: {
	},
	data () {
		return {
			queries: null,
            selectedRow: null,
			dFilters: {
				'title': {value: null, matchMode: FilterMatchMode.CONTAINS},
			}			
		}
	},
	created () {
		this.update();
	},
	methods: {
		async update() {
            const data = await this.apiClient.getSavedQueries();
            this.queries = data.result;
		},

        selectRow(ev) {
            this.$emit('select-query', ev.data);
        },

        useRow(ev) {
            this.$emit('use-query', ev.data);
        }

	}
}
</script>

<style>
</style>
