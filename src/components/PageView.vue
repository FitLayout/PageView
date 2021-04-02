<template>

	<div class="splitter-row">
		<Splitter style="overflow: hidden; height: 100%">
			<SplitterPanel>
				<Splitter layout="vertical" style="overflow: hidden; width: 100%">
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
					</SplitterPanel>
					<SplitterPanel>
						<div class="selected-info" v-if="subjectIri">
							Subject: <Iri :iri="subjectIri" />
						</div>
						<TabView v-model:activeIndex="activeTab">
							<TabPanel header="Description">
								<div class="descr-scroll">
									<div class="descr-table" v-if="subjectModel">
										<DataTable :value="subjectModel" class="p-datatable-sm" 
											:resizableColumns="true" columnResizeMode="expand"
											:scrollable="true" scrollHeight="flex"
											showGridlines>
											<Column header="Property">
												<template #body="rowdata">
													<Iri :iri="rowdata.data.p.value" />
												</template>
											</Column>
											<Column header="Value">
												<template #body="rowdata">
													<ValueInfo :data="rowdata.data" />
												</template>
											</Column>
										</DataTable>
									</div>
								</div>
							</TabPanel>
							<TabPanel header="References">
								<div class="descr-scroll">
									<div class="descr-table" v-if="subjectRefs">
										<DataTable :value="subjectRefs" class="p-datatable-sm" 
											:resizableColumns="true" columnResizeMode="expand"
											:scrollable="true" scrollHeight="flex" 
											showGridlines>
											<Column header="Subject">
												<template #body="rowdata">
													<ValueInfo :data="rowdata.data" />
												</template>
											</Column>
											<Column header="Property">
												<template #body="rowdata">
													<Iri :iri="rowdata.data.p.value" />
												</template>
											</Column>
										</DataTable>
									</div>
								</div>
							</TabPanel>
						</TabView>
					</SplitterPanel>
				</Splitter>
			</SplitterPanel>

			<SplitterPanel>
				<div class="col-page">
					<div v-if="loading" class="loading">
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
							<div class="p-field p-col">
								<label for="showTags" class="form-label">Show tags</label>
								<InputSwitch id="showTags" v-model="showTags" title="Highlight tags by colors" />
							</div>
						</div>
					</div>
					<div class="page-contents">
						<Page :pageModel="pageModel" :rectangles="rectangles" :zoom="zoom" :outlines="outlines"
							:rectSelection="rectSelection"
							:showTags="showTags"
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
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Page from './Page.vue';
import Iri from './Iri.vue';
import ValueInfo from './ValueInfo.vue';

import BOX from '@/ontology/BOX.js';
import SEGM from '@/ontology/SEGM.js';
import {Model as BoxModel} from '@/common/boxMappers.js';
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
		TabView,
		TabPanel,
		DataTable,
		Column,
		Page,
		Iri,
		ValueInfo
	},
	inject: ['apiClient'],
	props: {
		subjectIri: null
	},
	data () {
		return {
			// UI
			loading: false,
			error: null,
			zoom: 100,
			screenshot: true,
			outlines: false,
			rectSelection: false,
			showTags: false,

			// Displayed data
			status: null, //artifact status (currently displayed artifacts)
			artifactModel: null, //currently displayed artifact model
			pageModel: null, //currently displayed page model
			rectangles: null, //rectangle overlay on the page
			selectedRect: null, //selected rectangle
			activeTab: 0, //active tab in the description
			subjectModel: null, //selected subject model for the Description table
			subjectRefs: null, //selected subject references for the References table
			
			// Tree
			treeModel: null,
			expandedTreeKeys: null,
			selectedTreeKey: null
		}
	},
	created () {
		this.status = { type: 'unknown' };
		this.update();
	},
	watch: {
		'subjectIri': 'update'
	},
	methods: {
		update() {
			this.fetchData();
			this.activeTab = 0; //switch to the Description tab when the iri changes
		},

		async fetchData() {
			console.log('UPDATE ' + this.subjectIri)
			if (!this.subjectIri) {
				return;
			}
			this.error = this.post = null;
			this.loading = true;
			
			const client = this.apiClient;
			try {
				let resolver = new ObjectResolver(client);
				console.log('RESOLVING');
				let deps = await resolver.resolveObjectIRI(this.subjectIri, this.status);

				console.log(deps);
				if (deps.type !== 'unknown') {
					if (deps.artifactIri !== this.status.artifactIri) {
						console.log('SET artifact')
						this.artifactModel = deps.artifact;
						this.rectangles = deps.rectangles;
						if (deps.pageIri !== this.status.pageIri) {
							console.log('SET page')
							this.pageModel = deps.page;
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
						if (!this.selectedRect || this.selectedRect._iri !== this.subjectIri) {
							const rect = this.findRectangleByIri(this.subjectIri);
							this.showBoxInTree(rect);
							this.selectedRect = rect;
						}
					} else {
						this.selectedRect = null;
					}
				} else {
					console.error('Unknown artifact type for ' + this.subjectIri)
				}

				this.status = deps;
				this.subjectModel = (deps.description.length <= 50) ? deps.description : deps.description.slice(50);
				this.loading = false;

				//fetch references
				this.apiClient.getSubjectReferences(this.subjectIri).then((data) => {
					let refs = data.results.bindings;
					this.subjectRefs = (refs.length <= 50) ? refs : refs.slice(50);
				});

				this.$emit('status-update', this.status);
			} catch (error) {
				this.error = error.message;
				this.loading = false;
				console.error('Error while fetching artifact data', error);
			}
		},

		//============== Events =============================

		treeNodeSelected(node) {
			const iri = node.data._iri;
			this.$router.push({name: 'show', params: { iri: iri }});
		},

		pageRectSelected(rect) {
			const iri = rect._iri;
			this.$router.push({name: 'show', params: { iri: iri }});
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
.col-page .loading {
	margin: 20px 5px;
	height: 23px;
	box-sizing: border-box;
}
.col-page .tools {
	margin-top: 0;
	background-color: var(--surface-b);
	padding: 0.3rem 0;
	font-size: 90%;
	height: 65px;
	box-sizing: border-box;
}
.col-page .tools .p-field {
	text-align: center;
	padding: 0 0.3em;
	margin-bottom: 0.1em;
}
.col-page .tools .p-field label {
	display: block;
}
.tools .p-field > label, .tools .p-field > .p-component {
	margin-left: auto;
	margin-right: auto;
}
.col-page .tools .p-field > .p-component {
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
	height: 100%;
	min-height: 100px;
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
	padding: 0.2em 0.5em;
	font-weight: bold;
	height: 2em;
}
.splitter-row .p-tabview {
	height: calc(100% - 2em);
}
.splitter-row .p-tabview .p-tabview-nav {
	height: 2em;
}
.splitter-row .p-tabview .p-tabview-nav li .p-tabview-nav-link {
	padding: 0.2em 1em 0.2em 1em;
}
.splitter-row .p-tabview .p-tabview-panels {
	height: calc(100% - 2em);
	padding: 0;
}
.splitter-row .p-tabview .p-tabview-panel {
	height: 100%;
}
.descr-scroll {
	height: 100%;
	min-height: 100px;
	position: relative;
}
.descr-table {
	height: 100%;
	width: 100%;
	position: absolute;
	top: 0;
	left: 0;
}
.descr-table .p-datatable.p-datatable-sm .p-datatable-tbody > tr > td {
	padding: 0.25em 0.5em;
	font-size: 90%;
}
</style>
