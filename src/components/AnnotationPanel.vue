<template>
	<div class="annotation-panel">
		<div class="annotationGui">
			<Button class="p-button-raised" icon="pi pi-tag" iconPos="right" v-tooltip="'Add tag'" v-on:click="toggleTag" />
			<OverlayPanel ref="addTagPanel">
				<div class="annotationType">
					<h4>Add tag</h4>
					<Dropdown class="annotDropdown" v-model="selectedTag" :options="tags" optionLabel="name" optionValue="iri" placeholder="Select tag" />
					<Button class="p-button-raised" icon="pi pi-plus" iconPos="right" v-on:click="addTag" />
				</div>
			</OverlayPanel>

			<Button class="p-button-raised" icon="pi pi-comment" iconPos="right" v-tooltip="'Add annotation'" v-on:click="toggleAnnot" />
			<OverlayPanel ref="addAnnotationPanel">
				<div class="annotationType">
					<h4>Add annotation</h4>
					<Dropdown class="annotDropdown" v-model="selectedLabelType" :options="labelTypes" optionLabel="name" optionValue="id" placeholder="Select type" />
					<InputText class="descInput" type="text" v-model="labelText" placeholder="Short description" />
					<Button class="p-button-raised" icon="pi pi-plus" iconPos="right" v-on:click="addLabel" />
				</div>
			</OverlayPanel>
		</div>
		<div class="annot-scroll">
			<div class="annot-table" v-if="subjectAnnotations">
				<div class="annotation-item" v-for="item in subjectAnnotations" :key="item.iri">
					<table id="annotation-item-layout">
						<tr>
							<td><div class="annotation-item-iri"><Iri :iri="item.iri" /></div></td>
						</tr>
						<tr>
							<td>
								<div v-if="!!compareAnnotationOrTag(item)">
									<span class="annotation-item-value" v-for="row in item.row" :key="row.v.value">
										<Button class="p-button-annot" icon="pi pi-pencil" iconPos="right" v-tooltip="'Edit annotation'" v-on:click="editToggleAnnot($event,item)" />
										<OverlayPanel ref="editAnnotationPanel">
											<div class="annotationType">
												<h4>Edit annotation</h4>									
												<InputText class="descInput" type="text" v-model="labelEditText" placeholder="Short description" />
												<Button class="p-button-raised" icon="pi pi-plus" iconPos="right" v-on:click="editAnnot(selectedAnnotForEdit)" />
											</div>
										</OverlayPanel>
										<Button class="p-button-annot" icon="pi pi-trash" iconPos="right" v-tooltip="'Delete annotation'" v-on:click="deleteAnnot(item)" />
										<ValueInfo :data="row" />	
									</span>
								</div>
								<div v-else>
									<span class="annotation-item-value" v-for="row in item.row" :key="row.v.value">
										<Button class="p-button-annot" icon="pi pi-trash" iconPos="right" v-tooltip="'Delete tag'" v-on:click="deleteTag(row.v.value)" />
										<ValueInfo :data="row" />	
									</span>
								</div>
							</td>
						</tr>
					</table>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import OverlayPanel from 'primevue/overlaypanel';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import ValueInfo from './ValueInfo.vue';
import Iri from './Iri.vue';

import RDFS from '@/ontology/RDFS.js';
import BOX from '@/ontology/BOX.js';
import SEGM from '@/ontology/SEGM.js';

export default {
	name: 'AnnotationPanel',
	components: {
		OverlayPanel,
		Dropdown,
		Button,
		InputText,
		ValueInfo,
		Iri
	},
	inject: ['apiClient'],
	props: {
		subjectIri: null,
		artifactIri: null,
		subjectAnnotations: null
	},
	data () {
		return {
			// Tags and labels addition
			selectedTag: null,
			tags: [],
			selectedLabelType: null,
			labelText: null,
			labelTypes: [
				{id:0, name: 'rdfs:label', property: RDFS.LABEL},
				{id:1, name: 'rdfs:comment', property: RDFS.COMMENT}
			],
			selectedAnnotForEdit: null, //annot name for editation
			labelEditText: null, //annot content for editation
		}
	},
	created () {
		this.fetchTags();
	},
	methods: {
		async fetchTags() {
			this.tags = await this.apiClient.getTags();
		},

		async addTag() {
			if (this.selectedTag == null)
				return;
			
			console.log('Adding a tag!');

			var tagDesc = null;
			for (var tag of this.tags) {
				if (tag['iri'] == this.selectedTag) {
					tagDesc = tag['iri'];
					break;
				}
			}

			if (tagDesc == null) {
				console.log('A new tag has not been added, an internal error has occured!');
				return;
			}
			this.apiClient.addTag(this.subjectIri, tagDesc, this.artifactIri);
			this.selectedTag = null;
			this.$refs.addTagPanel.hide();
			this.$emit('update');
		},

		async addLabel() {
			if (this.selectedLabelType == null || this.labelText == null) {
				return;
			}
			console.log('Adding a label! ' + this.selectedLabelType + this.labelText);

			let descType = this.labelTypes[this.selectedLabelType].property;
			/*if (this.labelTypes[0]['id'] == this.selectedLabelType)
				descType = RDFS.LABEL;
			else {
				descType = RDFS.COMMENT;
			}*/
			await this.apiClient.addValue(this.subjectIri, descType, this.labelText, this.artifactIri);
			this.selectedLabelType = null;
			this.labelText = null;
			this.$refs.addAnnotationPanel.hide();
			this.$emit('update');
		},

		toggleTag(event) {
    		this.$refs.addTagPanel.toggle(event);
		}, 

		toggleAnnot(event) {
    		this.$refs.addAnnotationPanel.toggle(event);
		}, 

		//compare if item is annotation or tag to be rendered
		compareAnnotationOrTag(item) {
			let itemIri = item.iri;
			//console.log(itemIri);
			let splitIri = itemIri.split('#');
			let hasTagIri = splitIri[splitIri.length - 1];
			if (hasTagIri == "hasTag"){
				console.log("has tag")
				return false;
			} else {
				console.log("has annotation")
				return true;
			}
			
		},

		//TODO FUNCTIONS
		//open overlay panel for editation of annotation
		editToggleAnnot(event,item) {
    		this.$refs.editAnnotationPanel.toggle(event);
			this.selectedAnnotForEdit = item; //pass value of selected annotation
			this.labelEditText = item.value[0]; // open overlay with actual value of annotation
		},  
		//edit annotation
		async editAnnot(item) {
			console.log("edit annotation");
			console.log(item.iri);
			console.log(this.labelEditText);
			await this.apiClient.deleteValue(this.subjectIri, item.iri, this.artifactIri);
			await this.apiClient.addValue(this.subjectIri, item.iri, this.labelEditText, this.artifactIri);
			this.$refs.editAnnotationPanel.hide();
			this.$emit('update');
		}, 
		//delete annotation
		async deleteAnnot(item) {
			console.log("delete annotation");
			console.log(item.iri);
			await this.apiClient.deleteValue(this.subjectIri, item.iri, this.artifactIri);
			this.$emit('update');
		}, 
		//delete tag
		async deleteTag(item) {
			console.log("delete tag");
			console.log(item);
			await this.apiClient.deleteTag(this.subjectIri, item, this.artifactIri);
			this.$emit('update');
		}, 
		
	}
}

</script>

<style>
.annotationGui {
	margin: 1em;
	position: absolute;
	top: 0;
	right: 0;
	width: 3rem;
	z-index: 10;
}
.annotationGui button {
	margin-bottom: 0.5em;
}
.annotationGui .annotation-panel {
	margin: 1em;
	position: absolute;
	top: 0;
	right: 0;
	width: 3rem;
	z-index: 10;
}
.annotationType {
	margin-bottom: 1em;
}
.annotationType h4 {
	margin: 0;
	margin-bottom: 0.3em;
}
.annotation-panel {
	height: 100%;
}
.annot-scroll {
	height: 100%;
	min-height: 100px;
	position: relative;
}
.annot-scroll {
	overflow: auto;
}
.annot-table {
	position: absolute;
	top: 0;
	left: 0;
}
.annotation-item {
	margin: 1em;
}
.annotation-item-value::after {
	content: ' ';
}
.annotation-item-iri {
	font-weight: bold;
	color: var(--primary-color);
	margin-bottom: 0.5em;
	width:80%;
	margin-right:2%;
	float: left;
}
.annotDropdown {
	min-width: 8em;
	margin-right: 0.5em;
}

.p-button-annot {
	width: 1.5em!important;
	height: 1.5em !important;
	/* float:right !important; */
	margin: 0 0.1em 0 0 !important;
}

.annotation-item-buttons {
	width: 15% !important;
    	float: left !important;
}

#annotation-item-layout {
	text-align: left;
	vertical-align: bottom;
}

</style>
