<template>
	<div class="view-users">

	<h1>Repository administration</h1>
	<div class="user-list">
		<DataTable :value="repos" editMode="row" dataKey="username" v-model:editingRows="editingRows"
                @rowEditInit="onRowEditInit" @rowEditSave="onRowEditSave" @rowEditCancel="onRowEditCancel" responsiveLayout="scroll">
			<Column field="id" header="ID"></Column>
			<Column field="owner" header="Owner"></Column>
			<Column field="email" header="E-mail">
				<template #editor="slotProps">
					<InputText v-model="slotProps.data[slotProps.column.props.field]" autofocus />
				</template>			
			</Column>
			<Column field="description" header="Description">
				<template #editor="slotProps">
					<InputText v-model="slotProps.data[slotProps.column.props.field]" autofocus />
				</template>			
			</Column>
			<Column :rowEditor="true" style="width: 10%; min-width:8rem" bodyStyle="text-align:center"></Column>			
		</DataTable>
	</div>

	</div>
</template>

<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Checkbox from 'primevue/checkbox';

export default {
	name: 'home',
	components: {
		DataTable,
		Column,
		InputText,
		Checkbox
	},
	//inject: ['apiClient'],
	data() {
		return {
			apiClient: null,
			repos: [],
			editingRows: []
		}
	},
	originalRows: null,
	created () {
		this.apiClient = this.$root.apiClient;
		this.originalRows = {};
	},
	mounted() {
        this.apiClient.listAllRepositories().then(data => this.repos = data);
    },	
	methods: {
		onRowEditInit(event) {
            this.originalRows[event.index] = {...this.repos[event.index]};
		},
        onRowEditSave(event) {
			const userdata = this.repos[event.index];
			this.apiClient.updateUser(userdata);
        },
        onRowEditCancel(event) {
            this.repos[event.index] = this.originalRows[event.index];
        }
	}
}
</script>

<style>
.view-users {
	margin: 2em;
}
</style>
