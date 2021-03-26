<template>

	<div class="splitter-row">
		<Splitter style="overflow: hidden; height: 100%">
			<SplitterPanel>
				<div class="box-tree-scroll p-card">
					<div class="box-tree">
						<Tree :value="treeModel" v-if="treeModel"
								v-model:expandedKeys="expandedTreeKeys"
								v-model:selectionKeys="selectedTreeKey"
								@node-select="treeNodeSelected" selectionMode="single">
							<template #default="slotProps">
        						<span :id="'btr-' + slotProps.node.key">{{slotProps.node.label}}</span>
    						</template>
							<template #text="slotProps">
        						<i :id="'btr-' + slotProps.node.key">{{slotProps.node.label}}</i>
    						</template>
						</Tree>
					</div>
				</div>
				<div class="selected-info" v-if="selectedRect">
				    Current: <Iri :iri="selectedRect._iri" />
				</div>
			</SplitterPanel>

			<SplitterPanel>
				<div class="col-page">
					<div v-if="loading">
						<ProgressBar mode="indeterminate"/>
					</div>
					<div v-if="error" class="error alert alert-danger">
					{{ error }}
					</div>
					<div class="tools" v-if="!loading && !error">
						<div class="p-fluid p-formgrid p-grid">
							<div class="p-field p-col">
								<label for="zoom" class="form-label">Zoom<br><b>{{ zoom }}%</b></label>
								<Slider id="zoom" v-model="zoom" :step="5" :min="20" :max="200" />
							</div>
							<div class="p-field p-col">
								<label for="screen" class="form-label">Screenshot</label>
								<InputSwitch id="screen" v-model="screenshot" />
							</div>
							<div class="p-field p-col">
								<label for="outlines" class="form-label">Show outlines</label>
								<InputSwitch id="outlines" v-model="outlines" title="Show area bounds" />
							</div>
							<div class="p-field p-col">
								<label for="selection" class="form-label">Selection</label>
								<InputSwitch id="selection" v-model="rectSelection" title="Selection mode" />
							</div>
						</div>
					</div>
					<div class="page-contents">
						<Page :pageModel="pageModel" :rectangles="rectangles" :zoom="zoom" :outlines="outlines"
							:rectSelection="rectSelection"
							:selectedRect="selectedRect"
							@rect-selected="pageRectSelected">
						</Page>
					</div>
				</div>
			</SplitterPanel>
		</Splitter>
	</div>

</template>

<script>
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';
import ProgressBar from 'primevue/progressbar';
import Slider from 'primevue/slider';
import InputSwitch from 'primevue/inputswitch';
import Tree from 'primevue/tree';
import Page from './Page.vue';
import Iri from './Iri.vue';

import BOX from '@/ontology/BOX.js';
import SEGM from '@/ontology/SEGM.js';
import {Model as BoxModel} from '@/common/boxMappers.js';
import {ApiClient} from '@/common/apiclient.js';
import ObjectResolver from '@/common/resolver.js';
import TreeModel from '@/common/treemodel.js';

export default {
	name: 'PageView',
	components: {
		Splitter,
		SplitterPanel,
		ProgressBar,
		Slider,
		InputSwitch,
		Tree,
		Page,
		Iri
	},
	props: {
		artifactIri: null
	},
	data () {
		return {
			loading: false,
			error: null,
			rectangles: null,
			zoom: 100,
			screenshot: true,
			outlines: false,
			rectSelection: false,

			status: null,
			artifactModel: null,
			pageModel: null,
			treeModel: null,
			expandedTreeKeys: null,
			selectedTreeKey: null,
			selectedRect: null
		}
	},
	created () {
		this.status = { type: 'unknown' };
		this.update();
	},
	watch: {
		'artifactIri': 'update'
	},
	methods: {
		update() {
			this.fetchData();
		},

		async fetchData() {
			console.log('UPDATE ' + this.artifactIri)
			if (!this.artifactIri) {
				return;
			}
			this.error = this.post = null;
			this.loading = true;
			
			const client = new ApiClient();
			try {
				let resolver = new ObjectResolver(client);
				console.log('RESOLVING');
				let deps = await resolver.resolveObjectIRI(this.artifactIri, this.status);

				console.log(deps);
				if (deps.type !== 'unknown') {
					if (deps.artifactIri !== this.status.artifactIri) {
						this.setArtifact(deps.artifact);
						if (deps.pageIri !== this.status.pageIri) {
							this.setPage(deps.page, deps.rectangles);
						}
						//update trees for the new artifact
						this.initTree();
						if (deps.rectangleType === 'box') {
							this.treeModel = (new TreeModel()).createForBoxes(deps.rectangles);
						} else if (deps.rectangleType === 'area') {
							this.treeModel = (new TreeModel()).createForAreas(deps.rectangles);
						}
					}
					// if the IRI identifies a box or area, highlight the corresponding rectangle
					if (deps.type === 'box' || deps.type === 'area') {
						if (!this.selectedRect || this.selectedRect._iri !== this.artifactIri) {
							const rect = this.findRectangleByIri(this.artifactIri);
							this.showBoxInTree(rect);
							this.selectedRect = rect;
						}
					}
				} else {
					console.error('Unknown artifact type for ' + this.artifactIri)
				}

				this.status = deps;
				this.loading = false;
			} catch (error) {
				this.error = error.message;
				this.loading = false;
				console.error('Error while fetching artifact data', error);
			}
		},

		setArtifact(artifact) {
			this.artifactModel = artifact;
		},

		setPage(page, rectangles) {
			this.pageModel = page;
			this.rectangles = rectangles;
		},

		//============== Events =============================

		treeNodeSelected(node) {
			this.selectedRect = node.data;
		},

		pageRectSelected(rect) {
			this.showBoxInTree(rect);
			this.selectedRect = rect;
		},

		//============== Tree operations =============================

		initTree() {
			this.expandedTreeKeys = {};
			this.expandedTreeKeys[0] = true;
			this.selectedTreeKey = {};
			this.selectedTreeKey[0] = true;
		},

		showBoxInTree(box) {
			this.expandForBox(box);
			this.selectBox(box);
			//try to scroll into view
			let elem = document.getElementById('btr-' + box.documentOrder);
			if (elem) {
				elem.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
			}
		},

		selectBox(box) {
			this.selectedTreeKey = {};
			this.selectedTreeKey[box.documentOrder] = true;
		},
		
		expandForBox(box) {
			let boxNode = this.findTreeNode(this.treeModel.root, box.documentOrder);
			while (boxNode) {
				this.expandedTreeKeys[boxNode.key] = true;
				boxNode = boxNode.parent;
			}
		},

		findTreeNode(root, key) {
			if (root.key === key) {
				return root;
			} else if (root.children) {
				for (let child of root.children) {
					let sub = this.findTreeNode(child, key);
					if (sub !== null) {
						return sub;
					}
				}
				return null;
			}
			return null;
		},

		findRectangleByIri(iri) {
			for (let rect of this.rectangles) {
				if (rect._iri === iri) {
					return rect;
				}
			}
			return null;
		}

	}
}
</script>

<style>
.splitter-row {
	flex: 1 1 auto;
	overflow: hidden;
}
.col-page {
	height: 100%;
	display: flex;
	flex-direction: column;
}
.tools {
	margin-top: 0;
	background-color: var(--surface-b);
	padding: 0.3em 0;
	font-size: 90%;
}
.tools .p-field {
	text-align: center;
	padding: 0 0.3em;
	margin-bottom: 0.1em;
}
.tools .p-field label {
	display: block;
}
.tools .p-field > label, .tools .p-field > .p-component {
	margin-left: auto;
	margin-right: auto;
}
.tools .p-field > .p-component {
	margin-bottom: 0;
}
.page-contents {
	border: 2px solid lightgray;
	height: 100%;
	width: 100%;
	min-width: 200px;
	overflow: auto;
	position: relative;
}

.box-tree-scroll {
	position: relative;
	width: auto;
	height: 50%;
	min-height: 200px;
	overflow: auto;
}
.box-tree {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
}
.box-tree .p-tree .p-tree-container .p-treenode .p-treenode-content {
	padding: 0;
}
.box-tree .p-tree .p-tree-container .p-treenode .p-treenode-content .p-tree-toggler {
	width: 1.5rem;
	height: 1.5rem;
}
.box-tree .p-treenode-label {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.selected-info {
	padding: 0.5em 1em;
	font-weight: bold;
}
</style>
