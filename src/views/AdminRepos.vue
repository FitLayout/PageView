<template>
    <div class="view-users">

    <h1>Repository administration</h1>
    <div class="user-list">
        <DataTable :value="repos" editMode="row" dataKey="id" v-model:editingRows="editingRows"
                @rowEditInit="onRowEditInit" @rowEditSave="onRowEditSave" @rowEditCancel="onRowEditCancel" responsiveLayout="scroll">
            <Column field="id" header="ID">
                <template #body="slotProps">
                    <routerLink :to="{name: 'repo', params: { repoId: slotProps.data.id }}" target="_blank">{{slotProps.data.id}}</routerLink>
                </template>			
            </Column>
            <Column field="owner" header="Owner" :sortable="true"></Column>
            <Column field="email" header="E-mail">
                <template #editor="slotProps">
                    <InputText v-model="slotProps.data.email" autofocus />
                </template>			
            </Column>
            <Column field="description" header="Description">
                <template #editor="slotProps">
                    <InputText v-model="slotProps.data.email" autofocus />
                </template>			
            </Column>
            <Column field="readOnly" header="R/O">
                <template #body="slotProps">
                    <span v-if="slotProps.data.readOnly"><strong>yes</strong></span>
                </template>
                <template #editor="slotProps">
                    <Checkbox v-model="slotProps.data.readOnly" :binary="true" />
                </template>			
            </Column>
            <Column field="createdOn" header="Created" :sortable="true"></Column>
            <Column field="accessedOn" header="Accessed" :sortable="true"></Column>
            <Column :rowEditor="true" style="width: 10%; min-width:8rem" bodyStyle="text-align:center"></Column>			
        </DataTable>
    </div>

    </div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Checkbox from 'primevue/checkbox';

import type { DataTableRowEditInitEvent, DataTableRowEditSaveEvent, DataTableRowEditCancelEvent } from 'primevue/datatable';
import type { FLApiClient, FLRepositoryInfo } from '@/common/apiclient.js';

interface ComponentData {
    repos: FLRepositoryInfo[];
    editingRows: FLRepositoryInfo[];
}

export default defineComponent({
    name: 'AdminRepos',
    components: {
        DataTable,
        Column,
        InputText,
        Checkbox
    },
    setup(): {
        apiClient: FLApiClient;
        originalRows: FLRepositoryInfo[];
    } {
        return {
            apiClient: inject('apiClient') as FLApiClient,
            originalRows: []
        }
    },
    data(): ComponentData {
        return {
            repos: [],
            editingRows: []
        }
    },
    originalRows: null,
    created () {
    },
    mounted() {
        this.apiClient.listAllRepositories().then(data => this.repos = data);
    },	
    methods: {
        onRowEditInit(event: DataTableRowEditInitEvent): void {
            this.originalRows[event.index] = {...this.repos[event.index]};
        },
        onRowEditSave(event: DataTableRowEditSaveEvent): void {
            const rdata = this.repos[event.index];
            this.apiClient.updateRepositoryInfo(rdata.id, rdata);
        },
        onRowEditCancel(event: DataTableRowEditCancelEvent): void {
            this.repos[event.index] = this.originalRows[event.index];
        }
    }
})
</script>

<style>
.view-users {
    margin: 2em;
}
</style>
