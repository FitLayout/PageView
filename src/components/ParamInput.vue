<template>
    <div :class="paramClass" class="param-field">
        <div v-if="descr.type=='string'" class="field">
            <label :for="inputId" >{{descr.name}}</label>
            <InputText type="text" :id="inputId" :placeholder="descr.name"  class="w-full"
                :minlength="descr.minLength" :data-maxlength="descr.maxLength"
                v-bind:modelValue="modelValue" 
                v-tooltip="paramDescription"
                @update:modelValue="$emit('update:modelValue', $event)" />
        </div>
        <div v-if="descr.type=='int'" class="field">
            <label :for="inputId" >{{descr.name}}</label>
            <InputNumber mode="decimal" showButtons :id="inputId" class="w-full"
                :min="descr.minValue" :max="descr.maxValue"
                v-bind:modelValue="modelValue" 
                v-tooltip="paramDescription"
                @update:modelValue="$emit('update:modelValue', $event)" />
        </div>
        <div v-if="descr.type=='float'" class="field">
            <label :for="inputId" >{{descr.name}}</label>
            <InputNumber mode="decimal" showButtons :minFractionDigits="2" :maxFractionDigits="2" :id="inputId"  class="w-full"
                :min="descr.minValue" :max="descr.maxValue" :step="0.2"
                v-bind:modelValue="modelValue" 
                v-tooltip="paramDescription"
                @update:modelValue="$emit('update:modelValue', $event)" />
        </div>
        <div v-if="descr.type=='boolean'" class="field-checkbox">
            <Checkbox :binary="true" :id="inputId"
                v-bind:modelValue="modelValue" 
                v-tooltip="paramDescription"
                @update:modelValue="$emit('update:modelValue', $event)" />
            <label :for="inputId" class="form-check-label" v-tooltip="paramDescription">{{descr.name}}</label>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Checkbox from 'primevue/checkbox';
import type { ParamDescr } from '@/common/types';


export default defineComponent({
    name: 'ParamInput',
    components: {
        InputText,
        InputNumber,
        Checkbox
    },
    props: {
        descr: {
            type: Object as PropType<ParamDescr>,
            required: true
        },
        modelValue: {
            type: [String, Number, Boolean] as PropType<string | number | boolean | null>,
            default: null
        }
    },
    data () {
        return {
        }
    },
    computed: {
        inputId(): string {
            return 'P' + this.descr.name;
        },
        paramClass(): string {
            return 'p-' + this.descr.type;
        },
        paramDescription(): string {
            return this.descr.description || '';
        }
    },
    created () {
    },
    watch: {
    },
    methods: {
    }
})
</script>

<style>
.p-int, .p-float, .p-boolean, .p-string {
    flex: 0 0 auto;
    vertical-align: bottom;
}
.p-string {
    width: 25em;
    margin-right: 0.5em;
}
.p-int, .p-float {
    width: 6em;
    margin-right: 0.5em;
}
.p-boolean label {
    margin-right: 0.5em;
}
.param-field .field > label {
    word-break: break-all;
    overflow-wrap: anywhere;
}
</style>
