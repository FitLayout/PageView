<template>
	<div class="art-tree">
		<div v-if="loading">Loading artifacts...</div>
		<div v-if="error">{{error}}</div>
		<TreeTable :value="nodes" v-if="nodes"
				:autoLayout="true" :expandedKeys="expandedKeys" selection-mode="single"
				:indentation="1.5" sortMode="single" sortField="timestamp" :sortOrder="-1"
				@node-select="onNodeSelect">
			<Column header="Artifacts" :expander="true" :sortable="true" sortField="timestamp">
				<template #body="slotProps">
					<div class="art-container" 
							:id="(slotProps.node.data._iri === currentIri) ? 'artifact-selected':''"
							:class="(slotProps.node.data._iri === currentIri) ? 'selected':''">
						<ArtInfo :artifact="slotProps.node.data" :focus="focusedArt != null"
							@selectArtifact="selectArtifact"
							@deleteArtifact="deleteArtifact"
							@toggleFocus="toggleFocus" />
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
			started: false,
			apiClient: this.$root.apiClient,
			artifacts: null,
			artifactIndex: null,
			nodes: null, // nodes after filtering (if applied)
			allNodes: null, // all nodes
			expandedKeys: {},
			focusedArt: null
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
		this.started = true;
		this.fetchArtifacts();
	},
	methods: {

		async fetchArtifacts() {
			this.error = null;
			this.loading = true;
			
			try {
				this.artifacts = await this.apiClient.fetchArtifactInfoAll();
				this.loading = false;
				this.allNodes = this.computeNodes(this.artifacts);

				// focus on current page by default after startup
				if (this.started && this.currentIri) {
					let root = this.findRootForIri(this.currentIri);
					if (root) {
						this.focusedArt = root.data;
					}
				}
				this.started = false;

				this.applyFilter();
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
			this.artifactIndex = index;
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
			return root;
		},

		applyFilter() {
			// filter the tree if a page was focused
			if (this.focusedArt) {
				let filtered = [];
				for (let node of this.allNodes) {
					if (node.key === this.focusedArt._iri) {
						filtered.push(node);
					}
				}
				if (filtered.length > 0) {
					this.nodes = filtered;
				} else {
					// empty list after filtering - something went wrong
					// cancel the filter and use the entire list
					this.focusedArt = null;
					this.nodes = this.allNodes;
				}
			} else {
				this.nodes = this.allNodes;
			}
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

		iriChanged() {
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

		toggleFocus(art) {
			this.focusedArt = art;
			this.applyFilter();
			this.scrollToView();
		},

		/**
		 * Expands the entire subtree that contains the artifact with the given iri.
		 * @param {*} iri 
		 */
		expandSubtreeWithIri(iri) {
			// expand to the parent
			this.expandToRootFrom(iri);
			// expand current subtree
			let cur = this.artifactIndex[iri];
			if (cur) {
				this.expandSubtree(cur);
			}
			// refresh the tree state
			this.expandedKeys = {...this.expandedKeys};
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

		/**
		 * Expands the tree nodes from a given IRI node to the root.
		 * @param {*} iri 
		 */
		expandToRootFrom(iri) {
			let cur = this.artifactIndex[iri];
			while (cur && cur.parent) {
				this.expandedKeys[cur.key] = true;
				cur = this.artifactIndex[cur.parent];
			}
			if (cur) {
				this.expandedKeys[cur.key] = true;
			}
			return cur;
		},

		findRootForIri(iri) {
			let cur = this.artifactIndex[iri];
			while (cur && cur.parent) {
				cur = this.artifactIndex[cur.parent];
			}
			return cur;
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
