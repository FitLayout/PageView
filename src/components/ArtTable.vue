<template>
	<div class="art-table">
		<ConfirmDialog group="confirmDeleteArtifact"></ConfirmDialog>
		<div v-if="loading">Loading artifacts...</div>
		<div v-if="error">{{error}}</div>
		<TreeTable :value="nodes" v-if="nodes" :autoLayout="true" sortMode="single" sortField="timestamp" :sortOrder="-1">
			<Column header="Created" field="timestamp" :expander="true" :sortable="true" headerStyle="width: 15em">
				<template #body="slotProps">
					{{formatDate(slotProps.node.data.createdOn)}}
				</template>				
			</Column>
			<Column header="IRI" headerStyle="width: 8em">
				<template #body="slotProps">
					<Iri :iri="slotProps.node.data.id" />
				</template>				
			</Column>
			<Column header="Details">
				<template #body="slotProps">
					<div class="art-table-art-details">
						<TypeBadge :typeIri="slotProps.node.data.type" /> <strong>{{slotProps.node.data.title}}</strong><br/>
						<code v-if="slotProps.node.data.url">{{slotProps.node.data.url}}</code>
					</div>
				</template>
			</Column>
			<Column header="Actions">
				<template #body="slotProps">
					<div class="repository-actions">
						<LinkButton icon="pi pi-cog" class="p-button-warn"
							v-tooltip.top="'Details and Actions'"
							v-if="actionsAvailable(slotProps.node)"
							:to="{name: 'page', params: { repoId: (this.$route.params.repoId as string), iri: slotProps.node.data.id}}" /> 
						<LinkButton icon="pi pi-globe" style="margin-left: 0.2em"
							v-tooltip.top="'Open in Browser'"
							:to="{name: 'show', params: { repoId: (this.$route.params.repoId as string), iri: slotProps.node.data.id}}" 
							target="_blank" /> 
						<SplitButton icon="pi pi-download" severity="secondary" style="margin-left: 0.2em"
							v-tooltip.top="'Export artifact'"
							@click="exportDefault(slotProps.node)" 
							:model="createExportMenu(slotProps.node)" />
						<Button icon="pi pi-trash" class="p-button-danger" style="margin-left: 0.2em"
							v-tooltip.top="'Delete artifact'"
							@click="deleteArtifact(slotProps.node.key)" />
					</div> 
				</template>
			</Column>
		</TreeTable>
	</div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';
import TreeTable from 'primevue/treetable';
import Column from 'primevue/column';
import SplitButton from 'primevue/splitbutton';
import Button from 'primevue/button';
import ConfirmDialog from 'primevue/confirmdialog';

import TypeBadge from '../components/TypeBadge.vue';
import LinkButton from '@/rdf4j-vue-components/src/components/LinkButton.vue';
import Iri from '../components/Iri.vue';

import BOX from '../ontology/BOX.js';
import SEGM from '../ontology/SEGM.js';
import { IriDecoder } from '@/rdf4j-vue-components/src';
import type { MenuItem } from 'primevue/menuitem';
import type { FLApiClient } from '@/common/apiclient.js';
import type { RdfObject } from '@/common/types';

interface ArtTableData {
	id: string;
	timestamp: number;
	createdOn: unknown;
	creator: unknown;
	title: unknown;
	type: string;
	url?: unknown;
}

interface ArtTableNode {
	key: string;
	data: ArtTableData;
	children: ArtTableNode[];
	parent?: string;
}

interface ComponentData {
	error: string | null;
	loading: boolean;
	artifacts: RdfObject[] | null;
	nodes: ArtTableNode[] | null;
}

export default defineComponent({
	name: 'ArtTable',
	components: {
		TreeTable,
		Column,
		SplitButton,
		Button,
		TypeBadge,
		LinkButton,
		Iri,
		ConfirmDialog
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
			error: null,
			loading: false,
			artifacts: null,
			nodes: null
		}
	},
	computed: {
	},
	watch: {
	},
	created () {
		this.apiClient.currentRepo = this.$route.params.repoId;
		this.fetchArtifacts();
	},
	methods: {

		async fetchArtifacts(): Promise<void> {
			this.error = null;
			this.loading = true;

			try {
				this.artifacts = await this.apiClient.fetchArtifactInfoAll();
				this.loading = false;
				this.nodes = this.computeNodes(this.artifacts);
			} catch (error: any) {
				this.error = error.message;
				this.loading = false;
				console.error('Error while fetching artifact info!', error);
			}
		},

		computeNodes(artifacts: RdfObject[]): ArtTableNode[] {
			// build an index of artifacts
			let list: ArtTableNode[] = [];
			let index: Record<string, ArtTableNode> = {};
			for (let art of artifacts) {
				let newart = this.computeArtifactNode(art);
				index[art._iri] = newart;
				list.push(newart);
			}
			// build the tree
			let root: ArtTableNode[] = [];
			for (let nart of list) {
				if (nart.parent === undefined) {
					root.push(nart);
				} else {
					let part = index[nart.parent];
					if (part === undefined) {
						console.warn('Artifact ' + nart.key + ' has parent ' + nart.parent
						+ ' but there is no such artifact available.');
						root.push(nart);
					} else {
						part.children.push(nart);
					}
				}
			}
			return root;
		},

		computeArtifactNode(art: RdfObject): ArtTableNode {
			const ret: ArtTableNode = {
				key: art._iri,
				data: {
					id: art._iri,
					timestamp: (new Date(art.createdOn as string)).getTime(),
					createdOn: art.createdOn,
					creator: art.creator,
					title: art._label,
					type: art._type,
				},
				children: []
			};
			if (art.hasParentArtifact !== undefined) {
				ret.parent = (art.hasParentArtifact as RdfObject)._iri;
			}
			if (art.sourceUrl !== undefined) {
				ret.data.url = art.sourceUrl;
			}
			return ret;
		},

		formatDate(dateString: string): string {
			const date = new Date(dateString);
			const options: Intl.DateTimeFormatOptions = {
				year: 'numeric', month: 'numeric', day: 'numeric',
				hour: 'numeric', minute: 'numeric', second: 'numeric'
			};
            return new Intl.DateTimeFormat('default', options).format(date);
		},

		browseArtifact(id: string): void {
			const repoId = this.$route.params.repoId;
			const route = this.$router.resolve({name: 'show', params: { repoId: repoId, iri: id }});
			window.open(route.href, '_blank');
		},

		actionsAvailable(art: ArtTableNode): boolean {
			return (art.data.type === BOX.Page); //currently, actions are only available for Pages
		},

		exportDefault(art: ArtTableNode): void {
			if (art.data.type === BOX.Page || art.data.type === SEGM.AreaTree) {
				this.exportArtifact(art, 'text/xml', '.xml');
			} else {
				this.exportArtifact(art, 'application/rdf+xml', '.rdf');
			}
		},

		createExportMenu(art: ArtTableNode): MenuItem[] {
			let items: MenuItem[] = [];
			// for pages and area trees, add the specific serializations
			if (art.data.type === BOX.Page || art.data.type === SEGM.AreaTree) {
				items.push(
					{
						label: 'XML',
						command: () => {
							this.exportArtifact(art, 'text/xml', '.xml');
						}
					},
					{
						label: 'HTML',
						command: () => {
							this.exportArtifact(art, 'text/html', '.html');
						}
					},
					{
						label: 'PNG',
						command: () => {
							this.exportArtifact(art, 'image/png', '.png');
						}
					},
					{
						label: 'PNG',
						separator: true
					}
				);
			}
			// add standard RDF serializations
			items.push(
				{
					label: 'RDF XML',
					command: () => {
						this.exportArtifact(art, 'application/rdf+xml', '.rdf');
					}
				},
				{
					label: 'JSON-LD',
					command: () => {
						this.exportArtifact(art, 'application/ld+json', '.jsonld');
					}
				},
				{
					label: 'Turtle',
					command: () => {
						this.exportArtifact(art, 'text/turtle', '.ttl');
					}
				}
			);
			return items;
		},

		exportArtifact(art: ArtTableNode, mime: string, ext: string): void {
			this.apiClient.exportArtifact(art.data.id, mime, function(blob: Blob) {
				const link = document.createElement('a');
				link.href = URL.createObjectURL(blob);
				link.download = 'export' + ext;
				link.click();
				URL.revokeObjectURL(link.href);
			});
		},

		deleteArtifact(iri: string): void {
			let dec = new IriDecoder({});
			let shortIri = dec.encodeIri(iri);
			this.$confirm.require({
				group: 'confirmDeleteArtifact',
                message: 'Are you sure to delete the artifact ' + shortIri + ' and all derived artifacts?',
                header: 'Artifact deletion',
                icon: 'pi pi-exclamation-triangle',
                accept: async () => {
					try {
						this.artifacts = await this.apiClient.deleteArtifact(iri);
					} catch (error) {
						console.error('Couldnt delete artifact!', error);
					}
					this.fetchArtifacts();
                },
                reject: () => {
                }
            });
		}

	}
})
</script>

<style>
.repository-actions {
	white-space: nowrap;
}
</style>
