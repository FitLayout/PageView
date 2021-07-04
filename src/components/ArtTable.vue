<template>
	<div class="art-table">
		<TreeTable :value="nodes" v-if="nodes">
			<Column header="Created" :expander="true">
				<template #body="slotProps">
					{{formatDate(slotProps.node.data.createdOn)}}
				</template>				
			</Column>
			<Column header="Type">
				<template #body="slotProps">
					<TypeBadge :typeIri="slotProps.node.data.type" /> <strong>{{slotProps.node.data.title}}</strong><br/>
					<code v-if="slotProps.node.data.url">{{slotProps.node.data.url}}</code>
				</template>
			</Column>
			<Column header="Actions">
				<template #body="slotProps">
					<LinkButton label="Actions" icon="pi pi-cog" class="p-button-warning"
						:to="{name: 'show', params: { repoId: this.$route.params.repoId, iri: slotProps.node.data.id}}" 
						target="_blank" /> 
					<LinkButton label="Browse" icon="pi pi-globe" style="margin-left: 0.5em"
						:to="{name: 'show', params: { repoId: this.$route.params.repoId, iri: slotProps.node.data.id}}" 
						target="_blank" /> 
				</template>
			</Column>
		</TreeTable>
	</div>
</template>

<script>
import TreeTable from 'primevue/treetable';
import Column from 'primevue/column';

import TypeBadge from '@/components/TypeBadge.vue';
import LinkButton from '@/components/LinkButton.vue';

import BOX from '@/ontology/BOX.js';
import SEGM from '@/ontology/SEGM.js';
import {Model as BoxModel} from '@/common/boxMappers.js';
import {ApiClient} from '@/common/apiclient.js';

export default {
	name: 'ArtTable',
	components: {
		TreeTable,
		Column,
		TypeBadge,
		LinkButton
	},
	props: {
	},
	data () {
		return {
			error: null,
			loading: false,
			apiClient: this.$root.apiClient,
			artifacts: null,
			nodes: null
		}
	},
	computed: {
	},
	watch: {
	},
	created () {
		this.apiClient = this.$root.apiClient;
		this.apiClient.currentRepo = this.$route.params.repoId;
		this.fetchArtifacts();
	},
	methods: {

		async fetchArtifacts() {
			this.error = null;
			this.loading = true;
			
			try {
				this.artifacts = await this.apiClient.fetchArtifactInfoAll();
				this.loading = false;
				this.nodes = this.computeNodes(this.artifacts);
			} catch (error) {
				this.error = error.message;
				this.loading = false;
				console.error('Error while fetching artifact info!', error);
			}
		},

		computeNodes(artifacts) {
			// build an index of artifacts
			let list = [];
			let index = {};
			for (let art of artifacts) {
				let newart = this.computeArtifactNode(art);
				index[art._iri] = newart;
				list.push(newart);
			}
			// build the tree
			let root = [];
			for (let nart of list) {
				if (nart.parent === undefined) {
					root.push(nart);
				} else {
					let part = index[nart.parent];
					part.children.push(nart);
				}
			}
			return root;
		},

		computeArtifactNode(art) {
			const ret = {
				key: art._iri,
				data: {
					id: art._iri,
					createdOn: art.createdOn,
					creator: art.creator,
					title: art._label,
					type: art._type,
				},
				children: []
			};
			if (art.hasParentArtifact !== undefined) {
				ret.parent = art.hasParentArtifact._iri;
			}
			if (art.sourceUrl !== undefined) {
				ret.data.url = art.sourceUrl;
			}
			return ret;
		},

		formatDate(dateString) {
			const date = new Date(dateString);
			const options = {
				year: 'numeric', month: 'numeric', day: 'numeric',
				hour: 'numeric', minute: 'numeric', second: 'numeric'
			};
            return new Intl.DateTimeFormat('default', options).format(date);
		},
		
		browseArtifact(id) {
			const repoId = this.$route.params.repoId;
			const route = this.$router.resolve({name: 'show', params: { repoId: repoId, iri: id }});
			window.open(route.href, '_blank');
		}
	}
}
</script>

<style>
</style>
