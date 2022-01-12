<template>
	<div class="context-table">
		<ConfirmDialog></ConfirmDialog>
		<Dialog header="Edit context" v-model:visible="displayEditor"
		      :maximizable=true :modal=true >
			<p><b>Editing context</b> <code>{{editIri}}</code></p>
			<Textarea v-model="editorText" rows="30" cols="100" />
			<template #footer>
		        <Button label="Cancel" icon="pi pi-times" class="p-button-text"
			        @click="closeEditor()" />
                <Button label="Save" icon="pi pi-check" autofocus
					@click="saveEditor()" />
	        </template>
		</Dialog>		
		<DataTable :value="contexts">
			<Column field="iri" header="IRI"></Column>
			<Column header="Actions">
				<template #body="slotProps">
					<div class="repository-actions">
						<Button icon="pi pi-pencil" class="p-button-default" style="margin-left: 0.2em"
							v-tooltip.top="'Edit context'"
							@click="editContext(slotProps.data.iri)" />
						<SplitButton icon="pi pi-download" class="p-button-secondary" style="margin-left: 0.2em"
							v-tooltip.top="'Export context'"
							@click="exportDefault(slotProps.data.iri)" 
							:model="createExportMenu(slotProps.data.iri)" />
						<Button icon="pi pi-trash" class="p-button-danger" style="margin-left: 0.2em"
							v-tooltip.top="'Delete context'"
							@click="deleteContext(slotProps.data.iri)" />
					</div> 
				</template>
			</Column>
		</DataTable>
	</div>
</template>

<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import SplitButton from 'primevue/splitbutton';
import Button from 'primevue/button';
import ConfirmDialog from 'primevue/confirmdialog';
import Dialog from 'primevue/dialog';
import Textarea from 'primevue/textarea';

import IriDecoder from '@/common/iridecoder.js';

export default {
	name: 'ContextTable',
	components: {
		DataTable,
		Column,
		SplitButton,
		Button,
		ConfirmDialog,
		Dialog,
		Textarea
	},
	props: {
	},
	data () {
		return {
			apiClient: this.$root.apiClient,
			contexts: null,
			displayEditor: false,
			editorText: null,
			editIri: null
		}
	},
	created () {
		this.editorText = '';
		this.update();
	},
	watch: {
		iri: 'update'
	},
	methods: {
		async update() {
			this.contexts = await this.apiClient.getContexts();
		},

		exportDefault(iri) {
			this.exportContext(iri, 'application/rdf+xml', '.rdf');
		},

		createExportMenu(iri) {
			let items = [];
			// add standard RDF serializations
			items.push(
				{
					label: 'RDF XML',
					command: () => {
						this.exportContext(iri, 'application/rdf+xml', '.rdf');
					}
				},
				{
					label: 'JSON-LD',
					command: () => {
						this.exportContext(iri, 'application/ld+json', '.jsonld');
					}
				},
				{
					label: 'Turtle',
					command: () => {
						this.exportContext(iri, 'text/turtle', '.ttl');
					}
				}
			);
			return items;
		},

		editContext(iri) {
			let me = this;
			this.editIri = iri;
			this.apiClient.exportContext(iri, 'text/turtle', async function(blob) {
				me.editorText = await blob.text();
				me.displayEditor = true;
			});
		},
		closeEditor() {
			this.displayEditor = false;
		},
		saveEditor() {
			this.apiClient.replaceContext(this.editIri, 'text/turtle', this.editorText);
			this.displayEditor = false;
		},

		exportContext(iri, mime, ext) {
			this.apiClient.exportContext(iri, mime, function(blob) {
				const link = document.createElement('a');
        		link.href = URL.createObjectURL(blob);
        		link.download = 'export' + ext;
        		link.click();
        		URL.revokeObjectURL(link.href);
			});
		},

		deleteContext(iri) {
			let dec = new IriDecoder();
			let shortIri = dec.encodeIri(iri);
			this.$confirm.require({
                message: 'Are you sure to delete the context ' + shortIri + '?',
                header: 'Context deletion',
                icon: 'pi pi-exclamation-triangle',
                accept: async () => {
					try {
						//this.artifact = await this.apiClient.deleteArtifact(iri);
					} catch (error) {
						console.error('Couldnt delete context!', error);
					}
					this.update();
                },
                reject: () => {
                }
            });
		}

	}
}
</script>

<style>
</style>
