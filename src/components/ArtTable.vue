<template>
	<div class="art-table">
		<TreeTable :value="nodes" v-if="nodes">
			<Column field="createdOn" header="Created" :expander="true"></Column>
			<Column field="type" header="Type"></Column>
			<Column field="title" header="Title"></Column>
		</TreeTable>
	</div>
</template>

<script>
import TreeTable from 'primevue/treetable';
import Column from 'primevue/column';

import BOX from '@/ontology/BOX.js';
import SEGM from '@/ontology/SEGM.js';
import {Model as BoxModel} from '@/common/boxMappers.js';
import {ApiClient} from '@/common/apiclient.js';

export default {
	name: 'ArtTable',
	components: {
		TreeTable,
		Column
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
		// call again the method if the route changes
		//'$route': 'fetchData'
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
				console.log(this.artifacts);
				this.loading = false;
				this.nodes = this.computeNodes(this.artifacts);
				console.log(JSON.stringify(this.nodes));
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
					createdOn: art.createdOn,
					creator: art.creator,
					title: art.hasTitle,
					type: art._type
				},
				children: []
			};
			if (art.hasParentArtifact !== undefined) {
				ret.parent = art.hasParentArtifact._iri;
			}
			return ret;
		}

	}
}
</script>

<style>
</style>
