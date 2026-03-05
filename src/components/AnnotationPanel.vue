<template>
    <div class="annotation-panel">
        <div class="annotationGui">
            <Button class="p-button-raised" icon="pi pi-tag" iconPos="right" v-tooltip="'Add tag'" v-on:click="toggleTag" />
            <Popover ref="addTagPanel">
                <div class="annotationType">
                    <h4>Add tag</h4>
                    <Select class="annotDropdown" v-model="selectedTag" :options="tags" optionLabel="name" optionValue="iri" placeholder="Select tag" />
                    <Button class="p-button-raised" icon="pi pi-plus" iconPos="right" v-on:click="addTag" />
                </div>
            </Popover>

            <Button class="p-button-raised" icon="pi pi-comment" iconPos="right" v-tooltip="'Add annotation'" v-on:click="toggleAnnot" />
            <Popover ref="addAnnotationPanel">
                <div class="annotationType">
                    <h4>Add annotation</h4>
                    <Select class="annotDropdown" v-model="selectedLabelType" :options="labelTypes" optionLabel="name" optionValue="id" placeholder="Select type" />
                    <InputText class="descInput" type="text" v-model="labelText" placeholder="Short description" />
                    <Button class="p-button-raised" icon="pi pi-plus" iconPos="right" v-on:click="addLabel" />
                </div>
            </Popover>
        </div>
        <div class="annot-scroll">
            <div class="annot-table" v-if="subjectAnnotations">
                <div class="annotation-item" v-for="item in subjectAnnotations" :key="item.iri">
                    <table id="annotation-item-layout">
                        <tbody>
                            <tr>
                                <td><div class="annotation-item-iri"><Iri :iri="item.iri" /></div></td>
                            </tr>
                            <tr>
                                <td>
                                    <div v-if="!!isAnnotation(item)">
                                        <span class="annotation-item-value" v-for="row in item.row" :key="row.v.value">
                                            <Button class="p-button-annot" icon="pi pi-pencil" iconPos="right" v-tooltip="'Edit annotation'" v-on:click="editToggleAnnot($event,item)" />
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
                        </tbody>
                    </table>
                </div>
                <Popover ref="editAnnotationPanel">
                    <div class="annotationType">
                        <h4>Edit annotation</h4>									
                        <InputText class="descInput" type="text" v-model="labelEditText" placeholder="Short description" />
                        <Button class="p-button-raised" icon="pi pi-plus" iconPos="right" v-on:click="editAnnot(selectedAnnotForEdit)" />
                    </div>
                </Popover>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, inject, type PropType } from 'vue';
import Popover, { type PopoverMethods } from 'primevue/popover';
import Button from 'primevue/button';
import Select from 'primevue/select';
import InputText from 'primevue/inputtext';
import ValueInfo from './ValueInfo.vue';
import Iri from './Iri.vue';

import RDFS from '../ontology/RDFS.js';
import type { FLApiClient, TagInfo } from '@/common/apiclient.js';
import type { AnnotationItem } from '@/common/types';

interface ComponentData {
    selectedTag: string | null;
    tags: TagInfo[];
    selectedLabelType: number | null;
    labelText: string | null;
    labelTypes: Array<{id: number; name: string; property: string}>;
    selectedAnnotForEdit: AnnotationItem | null;
    labelEditText: string | null;
}

export default defineComponent({
    name: 'AnnotationPanel',
    components: {
        Popover,
        Select,
        Button,
        InputText,
        ValueInfo,
        Iri
    },
    setup() {
        return {
            apiClient: inject('apiClient') as FLApiClient
        }
    },
    props: {
        subjectIri: {
            type: String as PropType<string>,
            default: null
        },
        artifactIri: {
            type: String as PropType<string>,
            default: null
        },
        subjectAnnotations: {
            type: Array as PropType<AnnotationItem[]>,
            default: null
        }
    },
    data (): ComponentData {
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
        async fetchTags(): Promise<void> {
            this.tags = await this.apiClient.getTags();
        },

        async addTag() {
            if (this.selectedTag == null)
                return;
            
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
            (this.$refs.addTagPanel as PopoverMethods).hide();
            this.$emit('update');
        },

        async addLabel() {
            if (this.selectedLabelType == null || this.labelText == null) {
                return;
            }

            let descType = this.labelTypes[this.selectedLabelType].property;
            /*if (this.labelTypes[0]['id'] == this.selectedLabelType)
                descType = RDFS.LABEL;
            else {
                descType = RDFS.COMMENT;
            }*/
            await this.apiClient.addValue(this.subjectIri, descType, this.labelText, this.artifactIri);
            this.selectedLabelType = null;
            this.labelText = null;
            (this.$refs.addAnnotationPanel as PopoverMethods).hide();
            this.$emit('update');
        },

        toggleTag(event: Event) {
            (this.$refs.addTagPanel as PopoverMethods).toggle(event);
        }, 

        toggleAnnot(event: Event) {
            (this.$refs.addAnnotationPanel as PopoverMethods).toggle(event);
        }, 

        // decide if item is annotation or tag to be rendered
        isAnnotation(item: AnnotationItem) {
            let itemIri = item.iri;
            let splitIri = itemIri.split('#');
            let hasTagIri = splitIri[splitIri.length - 1];
            if (hasTagIri === "hasTag") {
                return false;
            } else {
                return true;
            }
        },

        //open overlay panel for editation of annotation
        editToggleAnnot(event: Event, item: AnnotationItem) {
            (this.$refs.editAnnotationPanel as PopoverMethods).toggle(event);
            this.selectedAnnotForEdit = item; //pass value of selected annotation
            this.labelEditText = item.value[0]; // open overlay with actual value of annotation
        },  
        //edit annotation
        async editAnnot(item: AnnotationItem) {
            await this.apiClient.deleteValue(this.subjectIri, item.iri, this.artifactIri);
            await this.apiClient.addValue(this.subjectIri, item.iri, this.labelEditText, this.artifactIri);
            (this.$refs.editAnnotationPanel as PopoverMethods).hide();
            this.$emit('update');
        }, 
        //delete annotation
        async deleteAnnot(item: AnnotationItem) {
            await this.apiClient.deleteValue(this.subjectIri, item.iri, this.artifactIri);
            this.$emit('update');
        }, 
        //delete tag
        async deleteTag(tagIri: string) {
            await this.apiClient.deleteTag(this.subjectIri, tagIri, this.artifactIri);
            this.$emit('update');
        }, 
        
    }
})

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
    color: var(--p-primary-color);
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
