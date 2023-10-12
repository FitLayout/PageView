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
								<DataTable :value="tableModel" v-if="tableModel"
									class="p-datatable-sm"
									v-model:selection="selectedTableRow"
									data-key="_iri"
									selectionMode="single"
									@rowSelect="tableRowSelected">
									<Column>
										<template #body="rowdata">
											<span :id="'btr-' + rowdata.data.documentOrder">{{rowdata.data._label}}</span>
										</template>
									</Column>
								</DataTable>
							</div>
						</div>
					</SplitterPanel>
					<SplitterPanel>
						<div class="selected-info" v-if="subjectIri">
							Subject: <Iri :iri="subjectIri" />
							<i class="pi pi-share-alt" v-tooltip="'Show in RDF explorer'" 
								style="margin-left: 0.5em; cursor: pointer" @click="exploreSubject" />
						</div>
						<TabView v-model:activeIndex="activeTab">
							<TabPanel header="Description">
								<div class="descr-scroll">
									<div class="descr-table" v-if="subjectModel">
										<DataTable :value="subjectModel" class="p-datatable-sm"
											v-model:filters="dFilters" filterDisplay="row"
											:resizableColumns="true" columnResizeMode="expand"
											:scrollable="true" scrollHeight="flex"
											showGridlines>
											<Column header="Property" filterField="p.value">
												<template #body="rowdata">
													<Iri :iri="rowdata.data.p.value" />
												</template>
												<template #filter="{filterModel,filterCallback}">
													<InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" :placeholder="`Search by name - `" v-tooltip.top.focus="'Hit enter key to filter'"/>
												</template>												
											</Column>
											<Column header="Value" filterField="v.value">
												<template #body="rowdata">
													<ValueInfo :data="rowdata.data" extIcon="pi pi-share-alt" extTooltip="Show in RDF explorer" 
														:extAll="true" structIcon="pi pi-share-alt"
														@show-iri="showIri"
														@hover-iri="hoverIri"
														@leave-iri="leaveIri"
														@show-ext="showExt"
														@show-struct="showExt" />
												</template>
												<template #filter="{filterModel,filterCallback}">
													<InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" :placeholder="`Search by value - `" v-tooltip.top.focus="'Hit enter key to filter'"/>
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
											v-model:filters="rFilters" filterDisplay="row"
											:resizableColumns="true" columnResizeMode="expand"
											:scrollable="true" scrollHeight="flex" 
											showGridlines>
											<Column header="Subject" filterField="v.value">
												<template #body="rowdata">
													<ValueInfo :data="rowdata.data" extIcon="pi pi-share-alt" extTooltip="Show in RDF explorer"
														:extAll="true" 
														@show-iri="showIri"
														@hover-iri="hoverIri"
														@leave-iri="leaveIri"
														@show-ext="showExt" />
												</template>
												<template #filter="{filterModel,filterCallback}">
													<InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" :placeholder="`Search by name - `" v-tooltip.top.focus="'Hit enter key to filter'"/>
												</template>												
											</Column>
											<Column header="Property" filterField="p.value">
												<template #body="rowdata">
													<Iri :iri="rowdata.data.p.value" />
												</template>
												<template #filter="{filterModel,filterCallback}">
													<InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" :placeholder="`Search by name - `" v-tooltip.top.focus="'Hit enter key to filter'"/>
												</template>												
											</Column>
										</DataTable>
									</div>
								</div>
							</TabPanel>
							<TabPanel>
								<template #header>
									<span class="p-tabview-title">Annotations</span>
									<Badge :value="subjectAnnotations.length" v-if="subjectAnnotations && subjectAnnotations.length > 0"></Badge>
								</template>
								<AnnotationPanel
									@update="fetchData(false)" 
									:subjectIri="subjectIri" 
									:artifactIri="status.artifactIri" 
									:subjectAnnotations="subjectAnnotations" />
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
						<div class="p-fluid formgrid grid">
							<div class="field col">
								<label for="zoom" class="form-label">Zoom<br><b>{{ zoom }}%</b></label>
								<Slider id="zoom" v-model="zoom" :step="5" :min="20" :max="200" />
							</div>
							<div class="field col">
								<label for="screen" class="form-label">Screenshot</label>
								<InputSwitch id="screen" v-model="screenshot" />
							</div>
							<div class="field col">
								<label for="outlines" class="form-label">Show outlines</label>
								<InputSwitch id="outlines" v-model="outlines" title="Show area bounds" />
							</div>
							<div class="field col">
								<label for="selection" class="form-label">Selection</label>
								<InputSwitch id="selection" v-model="rectSelection" title="Selection mode" />
							</div>
							<div class="field col">
								<label for="showTags" class="form-label">Show tags</label>
								<InputSwitch id="showTags" v-model="showTags" title="Highlight tags by colors" />
							</div>
							<div class="field col">
								<label for="showRelations" class="form-label">Show relations</label>
								<InputSwitch id="showRelations" v-model="showRelations" />
							</div>
							<div class="field col">
								<label for="dragSelection" class="form-label">Drag select</label>
								<InputSwitch id="dragSelection" v-model="dragSelection" title="Select tags by dragging" />
							</div>
						</div>
					</div>
					<div class="page-contents">
						<Page ref="page" :pageModel="pageModel" :rectangles="rectangles" :zoom="zoom"
							:screenshot="screenshot"
							:outlines="outlines"
							:rectSelection="rectSelection"
							:showTags="showTags"
							:selectedRect="selectedRect"
							@rect-selected="pageRectSelected">
							<Selection v-if="dragSelection" :pageRectAreas="rectangles" @update="updateTreeView"></Selection>
							<RelationsDisplay v-if="showRelations" :artifactModel="artifactModel" :selectedRect="selectedRect" :pageRectAreas="rectangles" />
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
import InputText from 'primevue/inputtext';
import InputSwitch from 'primevue/inputswitch';
import Tree from 'primevue/tree';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Badge from 'primevue/badge';

import Page from './Page.vue';
import Iri from './Iri.vue';
import ValueInfo from './ValueInfo.vue';
import AnnotationPanel from './AnnotationPanel.vue';
import Selection from './Selection.vue'
import RelationsDisplay from './RelationsDisplay.vue';

import RDFS from '../ontology/RDFS.js';
import SEGM from '../ontology/SEGM.js';
import FL from '../ontology/FL.js';
import ObjectResolver from '../common/resolver.js';
import TreeModel from '../common/treemodel.js';

import {FilterMatchMode} from 'primevue/api';

const MAX_PROPERTY_ITEMS = 1000; // max number of properties displated in subject properties

export default {
	name: 'PageView',
	components: {
		Splitter,
		SplitterPanel,
		ProgressBar,
		Slider,
		InputText,
		InputSwitch,
		Tree,
		TabView,
		TabPanel,
		DataTable,
		Column,
		Badge,
		Page,
		Iri,
		ValueInfo,
		AnnotationPanel,
		Selection,
		RelationsDisplay
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
			showTags: true,
			showRelations: false,
			dragSelection: false,

			// Annotations to show
			annotationIRIs: [RDFS.LABEL, RDFS.COMMENT], //properties to show in annotations (separate)
			annotationGroupIRIs: [SEGM.hasTag], //properties to show in annotations (grouped)
			
			// Displayed data
			status: null, //artifact status (currently displayed artifacts)
			artifactModel: null, //currently displayed artifact model
			pageModel: null, //currently displayed page model
			rectangles: null, //rectangle overlay on the page
			selectedRect: null, //selected rectangle
			activeTab: 0, //active tab in the description
			subjectModel: null, //selected subject model for the Description table
			subjectRefs: null, //selected subject references for the References table
			subjectAnnotations: null, //selected subject annotations for the Annotations table
			
			// Tree
			treeModel: null,
			expandedTreeKeys: null,
			selectedTreeKey: null,

			// Data table for showing chunks
			tableModel: null,
			selectedTableRow: null,

			// Property table filters
			dFilters: {
                'p.value': {value: null, matchMode: FilterMatchMode.CONTAINS},
				'v.value': {value: null, matchMode: FilterMatchMode.CONTAINS}
            },			
			rFilters: {
				'v.value': {value: null, matchMode: FilterMatchMode.CONTAINS},
                'p.value': {value: null, matchMode: FilterMatchMode.CONTAINS}
            },
   
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
			this.fetchData(false);
			//this.activeTab = 0; //switch to the Description tab when the iri changes
		},

		/**
		 * Reloads the artifact info.
		 * @param {boolean} forceReload force reloading the entire artifact (e.g. all areas)
		 */
		async fetchData(forceReload) {
			console.log('UPDATE ' + this.subjectIri)
			if (!this.subjectIri) {
				return;
			}
			this.error = this.post = null;
			this.loading = true;
			
			if (forceReload) {
				this.status.reloadArtifact = true; // force the resolver to reload current artifact 
			}

			const client = this.apiClient;
			try {
				let resolver = new ObjectResolver(client);
				console.log('RESOLVING');
				let deps = await this.resolveArtifact(resolver, this.subjectIri);

				console.log(deps);
				if (deps.type !== 'unknown') {
					if (forceReload || deps.artifactIri !== this.status.artifactIri) {
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
							this.tableModel = null;
						} else if (deps.rectangleType === 'area') {
							this.treeModel = (new TreeModel()).createForAreas(deps.rectangles);
							this.tableModel = null;
						} else if (deps.rectangleType === 'textChunk') {
							this.tableModel = this.createChunksModel(deps.rectangles);
							this.treeModel = null;
						}
					}
					// if the IRI identifies a box or area, highlight the corresponding rectangle
					if (deps.type === 'box' || deps.type === 'area' || deps.type === 'textChunk') {
						if (!this.selectedRect || this.selectedRect._iri !== this.subjectIri || forceReload) {
							const rect = this.findRectangleByIri(this.subjectIri);
							if (deps.type === 'box' || deps.type === 'area') {
								this.showBoxInTree(rect);
							} else if (deps.type === 'textChunk') {
								this.showBoxInTable(rect);
							}
							this.selectedRect = rect;
						}
					} else {
						this.selectedRect = null;
					}
				} else {
					console.error('Unknown artifact type for ' + this.subjectIri)
				}

				this.status = deps;
				this.subjectModel = (deps.description.length <= MAX_PROPERTY_ITEMS) ? deps.description : deps.description.slice(MAX_PROPERTY_ITEMS);
				this.subjectAnnotations = this.getAnnotations(deps.description);
				this.loading = false;

				//fetch references
				this.apiClient.getSubjectReferences(this.subjectIri).then((data) => {
					let refs = data.results.bindings;
					this.subjectRefs = (refs.length <= MAX_PROPERTY_ITEMS) ? refs : refs.slice(MAX_PROPERTY_ITEMS);
				});

				this.$emit('status-update', this.status);
			} catch (error) {
				this.error = error.message;
				this.loading = false;
				console.error('Error while fetching artifact data', error);
			}
		},

		async resolveArtifact(resolver, iri) {
			let baseDeps = await resolver.resolveObjectIRI(iri, this.status);
			let deps = baseDeps;
			let resolved = false;
			while (!resolved) {
				if (deps.type === 'unknown') { //if the type is unknown, repeat the resolution with a parent
					if (deps.objData[FL.hasParentArtifact]) {
						let pIri = deps.objData[FL.hasParentArtifact][0].value;
						deps = await resolver.resolveObjectIRI(pIri, this.status);
					} else {
						resolved = true; //no parent - give up
					}
				} else {
					resolved = true; //a know type found
				}
			}
			deps.description = baseDeps.description;
			deps.artifactIri = baseDeps.artifactIri;
			deps.artifact = baseDeps.artifact;
			return deps;
		},

		// scans the model and filters out the annotations only
		getAnnotations(model) {
			let ret = [];
			for (let iri of this.annotationGroupIRIs) {
				let values = [];
				let rows = [];
				for (let row of model) {
					if (row.p.value === iri) {
						values.push(row.v.value);
						rows.push(row);
					}
				}
				if (values.length > 0) {
					ret.push({iri: iri, value: values, row: rows});
				}
			}
			for (let iri of this.annotationIRIs) {
				for (let row of model) {
					if (row.p.value === iri) {
						ret.push({iri: iri, value: [row.v.value], row: [row]});
					}
				}
			}
			return ret;
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
			this.$nextTick(function() {
				let elem = document.getElementById('btr-' + box.documentOrder);
				if (elem) {
					elem.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
				}
			});
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

		// Table of rectangles

		createChunksModel(rects) {
			const list = [];
			for (let rect of rects) {
				list.push(rect);
			}
			return list;
		},

		tableRowSelected(node) {
			const iri = node.data._iri;
			this.$router.push({name: 'show', params: { iri: iri }});
		},

		showBoxInTable(rect) {
			this.selectedTableRow = rect;
			this.$nextTick(function() {
				let elem = document.getElementById('btr-' + rect.documentOrder);
				if (elem) {
					elem.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
				}
			});
		},

		// ---

		findRectangleByIri(iri) {
			for (let rect of this.rectangles) {
				if (rect._iri === iri) {
					return rect;
				}
			}
			return null;
		},

		//refresh tree view after adding selection
		updateTreeView() {
			this.fetchData(true);
		},

		showIri(iri) {
			this.$router.push({name: 'show', params: { iri: iri }});
		}, 

		showExt(iri) {
			let route = this.$router.resolve({name: 'explore', params: { repoId: this.$route.params.repoId, iri: iri }});
			window.open(route.href, '_blank');
		},

		hoverIri(iri) {
			const page = this.$refs['page'];
			if (page) {
				page.highlightHoveredIri(iri);
			}
		},

		leaveIri(iri) {
			const page = this.$refs['page'];
			if (page) {
				page.unhighlightHoveredIri(iri);
			}
		},

		exploreSubject() {
			this.showExt(this.subjectIri);
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
.col-page .tools .field {
	text-align: center;
	padding: 0 0.3em;
	margin-bottom: 0.1em;
}
.col-page .tools .field label {
	display: block;
}
.tools .field > label, .tools .field > .p-component {
	margin-left: auto;
	margin-right: auto;
}
.col-page .tools .field > .p-component {
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
.descr-table .p-datatable.p-datatable-sm .p-datatable-thead > tr > th.p-filter-column {
	padding: 0.25em 0.5em;
	font-size: 90%;
}
th.p-filter-column .p-inputtext {
	padding: 0.25em 0.5em;
}
.splitter-row .p-tabview .p-tabview-nav li .p-tabview-nav-link .p-badge {
	min-width: 1.5em;
	height: 1.5em;
	line-height: 1.5em;
	margin-top: -0.5em;
	margin-left: 0.5em;
}
.splitter-row .p-tabview .p-tabview-panel {
	position: relative; /* because of annotationGui inside */
}
input.p-inputtext.p-component.descInput {
	margin-right: 0.5em;
}
</style>
