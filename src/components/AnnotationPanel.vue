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
					<div class="annotation-item-iri"><Iri :iri="item.iri" /></div>
					<span class="annotation-item-value" v-for="row in item.row" :key="row.v.value">
						<ValueInfo :data="row" />
					</span>
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
			]
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
					tagDesc = tag['name'];
					break;
				}
			}

			if (tagDesc == null) {
				console.log('A new tag has not been added, an internal error has occured!');
				return;
			}
			this.apiClient.addTag(this.subjectIri, tagDesc, this.artifactIri);
			this.selectedTag = null;
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
			this.apiClient.addValue(this.subjectIri, descType, this.labelText, this.artifactIri);
			this.selectedLabelType = null;
			this.labelText = null;
			this.$emit('update');
		},

		toggleTag(event) {
    		this.$refs.addTagPanel.toggle(event);
		}, 

		toggleAnnot(event) {
    		this.$refs.addAnnotationPanel.toggle(event);
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
}
.annotDropdown {
	min-width: 8em;
	margin-right: 0.5em;
}
</style>
