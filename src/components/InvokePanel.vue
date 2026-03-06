<template>
    <div class="service-panel card">
            <div class="service formgroup-inline">
                <div class="field inl">
                    <label :for="inputId" class="inl"><strong>Service</strong></label>
                    <Select v-model="key" v-if="grouped" :options="groupList" optionLabel="name" optionValue="id"
                        optionGroupLabel="label" optionGroupChildren="items">
                        <template #option="opt">
                            <div class="option-cont option-cont-grouped">
                                {{opt.option.name}} ({{opt.option.id}})
                                <div class="option-descr">{{opt.option.description}}</div>
                            </div>
                        </template>
                        <template #value="opt">
                            <div  v-if="selection && opt && opt.value && selection[opt.value]">
                                {{selection[opt.value].name}} ({{selection[opt.value].id}})
                            </div>
                            <div v-else>
                                ---
                            </div>
                        </template>
                    </Select>
                    <Select v-model="key" v-else :options="selList" optionLabel="name" optionValue="id">
                        <template #option="opt">
                            <div class="option-cont">
                                {{opt.option.name}} ({{opt.option.id}})
                                <div class="option-descr">{{opt.option.description}}</div>
                            </div>
                        </template>
                        <template #value="opt">
                            <div  v-if="selection && opt && opt.value && selection[opt.value]">
                                {{selection[opt.value].name}} ({{selection[opt.value].id}})
                            </div>
                            <div v-else>
                                ---
                            </div>
                        </template>
                    </Select>
                </div>
                <Button class="inl" v-on:click="invoke" :label="action" />
                <div v-if="loading" class="loading inl">
                    <ProgressSpinner class="spinner" />
                </div>

                <Message v-if="error" class="error" severity="error" v-on:click="error=null">{{error}}</Message>
            </div>
            <ParamPanel v-if="params" :descr="paramDescr" :values="params"></ParamPanel>
    </div>
</template>

<script lang="ts">
import { defineComponent, inject, type PropType } from 'vue';
import Select from 'primevue/select';
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';
import Message from 'primevue/message';

import ParamPanel from './ParamPanel.vue';
import type { FLApiClient } from '@/common/apiclient.js';
import type { ParamDescr, RdfObject, ServiceGroupItem, ServiceInfo } from '@/common/types';

interface ComponentData {
    loading: boolean;
    error: string | null;
    services: ServiceInfo[];
    selection: Record<string, ServiceInfo>;
    selList: ServiceInfo[];
    groupList: ServiceGroupItem[];
    key: string | null;
    paramDescr: ParamDescr[];
    params: Record<string, string | number | boolean>;
}

export default defineComponent({
    name: 'InvokePanel',
    components: {
        Select,
        Button,
        ProgressSpinner,
        Message,
        ParamPanel
    },
    setup() {
        return {
            apiClient: inject('apiClient') as FLApiClient
        }
    },
    props: {
        id: {
            type: String,
            required: true
        },
        source: { // use <iri> or 'ANY' or 'NONE'
            type: String,
            required: true
        },
        target: { // use <iri> or 'ANY' or 'NONE'
            type: String,
            required: true
        },
        action: {
            type: String,
            required: true
        },
        grouped: {
            type: Boolean,
            default: false
        },
        currentArtifact: {
            type: Object as PropType<RdfObject | null>,
            default: null
        }
    },
    data (): ComponentData {
        return {
            loading: false,
            error: null,
            services: [],  //all services
            selection: {}, //acceptable services
            selList: [],	 //acceptable service list
            groupList: [], //grouped list if grouping is required
            key: null,		 //selected service key

            paramDescr: [], //selected service param description
            params: {}	 //selected service params
        }
    },
    computed: {
        inputId() {
            return 'serv' + this.action;
        },
    },
    async created () {
        await this.loadServices();
        this.restoreService();
        await this.restoreParams();
    },
    watch: {
        'key': 'update'
    },
    methods: {
        async loadServices(): Promise<void> {
            try {
                let data = await this.apiClient.fetchArtifactServices();
                this.services = data;

                this.selList = [];
                let sel: Record<string, ServiceInfo> = {};
                for (let serv of this.services) {
                    if ((this.target === 'ANY' || (this.target === 'NONE' && !serv.produces) || (serv.produces === this.target))
                            && (this.source === 'ANY' || (this.source === 'NONE' && !serv.consumes) || (serv.consumes === this.source))) {
                        sel[serv.id] = serv;
                        this.selList.push(serv);
                        if (this.key == null) {
                            this.key = serv.id;
                        }
                    }
                }
                this.selection = sel;
                console.log('Services selection:', this.selection);
                if (this.grouped) {
                    this.groupList = this.createGroups(this.selList);
                }

            } catch (error) {
                console.error('Couldnt fetch artifact services!', error);
            }
        },

        createGroups(list: ServiceInfo[]): ServiceGroupItem[] {
            // create a map from category to list of services
            let cats: Record<string, ServiceInfo[]> = {};
            for (let serv of list) {
                let cat = serv.category ? serv.category : 'Other';
                let catList = cats[cat];
                if (!catList) {
                    catList = [];
                    cats[cat] = catList;
                }
                catList.push(serv);
            }
            // transform to grouped list for Dropdown
            let groupList: ServiceGroupItem[] = [];
            for (let cat in cats) {
                groupList.push({
                    label: cat,
                    items: cats[cat]
                });
            }
            return groupList;
        },

        async update(): Promise<void> {
            if (this.key) {
                //get the current param values
                await this.restoreParams();
                //choose the service description
                this.paramDescr = this.selection![this.key].params ?? [];
            }
        },

        async invoke(): Promise<boolean> {
            if (!this.key || !this.params) {
                this.error = 'No service selected';
                return false;
            }

            this.saveParams();
            //console.log('invoke');
            //console.log(this.params);
            //console.log(this.selection[this.key]);
            this.loading = true;

            let srcArtifact = null;
            const srcType = this.selection![this.key!].consumes;
            if (srcType) {
                srcArtifact = this.findParentOfType(srcType);
            }
            const srcIri = srcArtifact ? srcArtifact._iri : null;
            //console.log(srcArtifact);

            try {
                const iri = await this.apiClient.createArtifact(this.key, this.params, srcIri);
                if (iri) {
                    this.$emit('created', iri);
                } else {
                    this.$emit('created', srcIri);
                }
                this.error = null;
            } catch (e: any) {
                this.error = e.message;
            } finally {
                this.loading = false;
            }

            return false;
        },

        restoreService(): void {
            let selected = localStorage.getItem('service-' + this.id);
            if (selected && this.selection && this.selection[selected] !== undefined) {
                this.key = selected;
            }
        },

        async restoreParams(): Promise<void> {
            if (this.key) {
                // get the defaults (they may have been changed)
                let params = await this.apiClient.getServiceParams(this.key);
                const str = localStorage.getItem('params-' + this.key);
                if (str === null) {
                    // not yet in local storage, save the defaults
                    this.saveParams();
                } else {
                    // load the saved params and update the values
                    const newparams = JSON.parse(str);
                    for (let key in newparams) {
                        params[key] = newparams[key];
                    }
                }
                // update the param values, do not replace the entire object if it was already passed to the sub-components
                if (!this.params) {
                    this.params = {};
                }
                for (let key in params) {
                    this.params[key] = params[key];
                }
            }
        },

        saveParams(): void {
            if (this.key) {
                localStorage.setItem('service-' + this.id, this.key);
                localStorage.setItem('params-' + this.key, JSON.stringify(this.params));
            }
        },

        findParentOfType(type: string): RdfObject | null {
            let current: RdfObject | null = this.currentArtifact;
            while (current && current._type !== type) {
                if (current.hasParentArtifact)  {
                    current = current.hasParentArtifact as RdfObject;
                } else {
                    current = null;
                }
            }
            return current;
        },


    }
})
</script>

<style>
.service-panel .field {
    margin-bottom: 0.5em;
}
.service-panel .field > label {
    margin-bottom: 0.1em;
}
.service .inl {
    vertical-align: baseline;
    display: inline-block;
    width: auto;
}
.service button.inl {
    width: auto;
    margin-bottom: 0.5em;
}
.loading {
    display: inline-block;
    vertical-align: middle;
    margin-left: 1em;
}
.loading .spinner {
    width: 2em;
    height: 2em;
}
.service-panel .error {
    font-weight: bold;
    margin-left: 1em;
}
.option-cont .option-descr {
    font-size: 80%;
    font-style: italic;
}
.option-cont {
    padding-left: 0.5em;
    border-left: 1px solid var(--p-text-color-secondary)
}
.option-cont.option-cont-grouped {
    margin-left: 0.5em;
}
</style>
