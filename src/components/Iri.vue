<template>
    <a class="iri-link" v-if="active" @click="clicked" @mouseover="hoverIri" @mouseout="leaveIri">
        <span class="iri font-monospace" v-tooltip.bottom="iri">{{ shortForm }}</span>
    </a>
    <span class="iri font-monospace" v-if="!active" v-tooltip.bottom="iri">{{ shortForm }}</span>
</template>

<script lang="ts">
import { defineComponent, inject, type PropType } from 'vue';
import type { FLApiClient } from '@/common/apiclient.js';

interface ComponentData {
    shortForm: string | null;
}

export default defineComponent({
    name: 'Iri',
    props: {
        iri: {
            type: String as PropType<string>,
            required: true
        },
        active: {
            type: Boolean,
            default: false
        }
    },
    emits: ['show-iri', 'hover-iri', 'leave-iri'],
    setup() {
        return {
            apiClient: inject('apiClient') as FLApiClient
        }
    },
    data (): ComponentData {
        return {
            shortForm: null
        }
    },
    created () {
        this.update();
    },
    watch: {
        iri: 'update'
    },
    methods: {
        async update(): Promise<void> {
            const dec = await this.apiClient.getIriDecoder();
            this.shortForm = dec.encodeIri(this.iri);
        },

        clicked(): void {
            this.$emit('show-iri', this.iri);
        },

        hoverIri(): void {
            this.$emit('hover-iri', this.iri);
        },

        leaveIri(): void {
            this.$emit('leave-iri', this.iri);
        }
    }
})
</script>

<style>
.iri-link {
    color: var(--p-blue-500);
    text-decoration: none;
    cursor: pointer;
}
.iri {
    border-bottom: 1px dotted;
}
.iri-link:hover .iri {
    border-bottom: 1px solid;
}
</style>
