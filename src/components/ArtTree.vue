<template>
	<div class="art-tree">
		<div v-if="loading">Loading artifacts...</div>
		<div v-if="error">{{error}}</div>
		<TreeTable :value="nodes" v-if="nodes"
				:autoLayout="true" :expandedKeys="expandedKeys" selection-mode="single"
				:indentation="1.5" sortMode="single" sortField="timestamp" :sortOrder="-1"
				@node-select="onNodeSelect">
			<Column header="Artifacts" :expander="true" :sortable="true">
				<template #body="slotProps">
					<div class="art-container" 
							:id="(slotProps.node.data._iri === currentIri) ? 'artifact-selected':''"
							:class="(slotProps.node.data._iri === currentIri) ? 'selected':''">
						<ArtInfo :artifact="slotProps.node.data"
							@selectArtifact="selectArtifact"
							@deleteArtifact="deleteArtifact" />
					</div>
				</template>
			</Column>
		</TreeTable>
	</div>
</template>

<script>
import TreeTable from 'primevue/treetable';
import Column from 'primevue/column';
import SplitButton from 'primevue/splitbutton';
import Button from 'primevue/button';

import TypeBadge from '@/components/TypeBadge.vue';
import LinkButton from '@/components/LinkButton.vue';
import Iri from '@/components/Iri.vue';
import ArtInfo from '@/components/ArtInfo.vue';

export default {
	name: 'ArtTree',
	components: {
		TreeTable,
		Column,
		SplitButton,
		Button,
		ArtInfo,
		TypeBadge,
		LinkButton,
		Iri
	},
	props: {
		currentIri: null,
	},
	data () {
		return {
			error: null,
			loading: false,
			apiClient: this.$root.apiClient,
			artifacts: null,
			artifactIndex: null,
			nodes: null,
			expandedKeys: {}
		}
	},
	computed: {
	},
	watch: {
		'currentIri': 'iriChanged'
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
				this.expandSubtreeWithIri(this.currentIri);
				this.scrollToView();
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
					if (part === undefined) {
						console.warn('Artifact ' + nart.key + ' has parent ' + nart.parent
						+ ' but there is no such artifact available.');
						// console.log(nart);
						root.push(nart);
					} else {
						part.children.push(nart);
					}
				}
			}
			this.artifactIndex = index;
			return root;
		},

		computeArtifactNode(art) {
			const ret = {
				key: art._iri,
				data: {
					... art,
					id: art._iri,
					timestamp: (new Date(art.createdOn)).getTime(),
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
		
		iriChanged() {
			console.log('EXPAND ' + this.currentIri);
			this.expandSubtreeWithIri(this.currentIri);
			this.scrollToView();
		},

		onNodeSelect(node) {
			this.selectArtifact(node.key);
		},

		selectArtifact(iri) {
			this.$emit('select-artifact', iri);
		},

		deleteArtifact(iri) {
			this.$emit('delete-artifact', iri);
		},

		/**
		 * Expands the entire subtree that contains the artifact with the given iri.
		 * @param {*} iri 
		 */
		expandSubtreeWithIri(iri) {
			// find the parent
			let cur = this.artifactIndex[iri];
			while (cur.parent) {
				cur = this.artifactIndex[cur.parent];
			}
			this.expandSubtree(cur);
		},

		/**
		 * Expands the subtree with the given root node.
		 * @param {*} root 
		 */
		expandSubtree(root) {
			this.expandedKeys[root.key] = true;
			if (root.children) {
				for (let child of root.children) {
					this.expandSubtree(child);
				}
			}
		},

		collapseAll() {
			this.expandedKeys = {};
		},

		scrollToView() {
			this.$nextTick(function() {
				let elem = document.getElementById('artifact-selected');
				if (elem) {
					elem.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
				}
			});
		},

		rowClass(data) {
			console.log(data);
			return "row";
		}

	}
}
</script>

<style>
.art-tree {
	white-space: nowrap;
}
.art-tree .art-container {
	display: inline-block;
	vertical-align: middle;
	white-space: normal;
	width: 15em;
}
.art-tree .p-treetable .p-treetable-tbody > tr > td {
	padding: 0;
}
</style>
