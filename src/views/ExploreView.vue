<template>
    <div class="explore-view">
        <div class="subj-selection">
            <Select v-model="selMode" :options="modes" /> 
            <InputText type="text" v-model="destIri" @keydown.enter="changeIri()" style="width: 50em" />
            <Button class="ml-2" label="Explore" @click="changeIri()" />
        </div>
        <SubjectInfo v-if="iri && selMode === 'Subject'" :iri="iri" :activeIris="true" @show-iri="showIri" />
        <SubjectReferences v-if="iri && selMode === 'Object'" :iri="iri" :activeIris="true" @show-iri="showIri" />
    </div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Select from 'primevue/select';

import SubjectInfo from '../components/SubjectInfo.vue';
import SubjectReferences from '../components/SubjectReferences.vue';

import type { FLApiClient } from '@/common/apiclient.ts';

interface ComponentData {
    destIri: string | null;
    selMode: string;
    modes: string[];
}

export default defineComponent({
    name: 'ExploreView',
    components: {
        Button,
        InputText,
        Select,
        SubjectInfo,
        SubjectReferences
    },
    props: {
    },
    setup() {
        return {
            apiClient: inject('apiClient') as FLApiClient
        }
    },
    data (): ComponentData {
        return {
            destIri: null,
            selMode: 'Subject',
            modes: [ 'Subject', 'Object' ]
            //modes: [ { label: 'Subject', value: 'subject' }, { label: 'Object', value: 'object' } ]
        }
    },
    created () {
        this.update();
    },
    computed: {
        iri(): string {
            return this.$route.params.iri.toString();
        },
        repoId(): string {
            return this.$route.params.repoId.toString();
        }
    },
    watch: {
        '$route.params.iri': 'update'
    },
    methods: {
        async update(): Promise<void> {
            if (this.iri) {
                const dec = await this.apiClient.getIriDecoder();
                this.destIri = dec.encodeIri(this.iri as string);
            } else {
                this.destIri = '';
            }
        },

        showIri(iri: string): void {
            this.selMode = 'Subject';
            this.$router.push({name: 'explore', params: { repoId: this.repoId, iri: iri }});
        },

        async changeIri(): Promise<void> {
            const dec = await this.apiClient.getIriDecoder();
            let iri = dec.decodeIri(this.destIri ?? '');
            this.showIri(iri);
        }
    }
})
</script>

<style>
.explore-view .subj-selection {
    padding: 1em;
}
</style>
