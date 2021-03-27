<template>
	<span class="value-info" v-if="valueType">
		<span v-if="valueType==='literal'">{{data.v.value}}</span>
		<span v-if="valueType==='uri'" :class='typeInfo.type'>
			<Iri :iri="data.v.value" :active="active" />
			<span v-if="typeInfo.name" class="badge">{{typeInfo.name}}</span>
		</span>
	</span>
</template>

<script>
import Iri from './Iri.vue';
import BOX from '@/ontology/BOX.js';
import SEGM from '@/ontology/SEGM.js';
import IriDecoder from '@/common/iridecoder.js';

const knownTypes = {};
knownTypes[BOX.Page] = { name: 'BoxTree', type: 'boxtree' }
knownTypes[BOX.Box] = { name: 'Box', type: 'box' }
knownTypes[SEGM.AreaTree] = { name: 'AreaTree', type: 'areatree' }
knownTypes[SEGM.Area] = { name: 'Area', type: 'area' }

export default {
	name: 'ValueInfo',
	components: {
		Iri
	},
	inject: ['apiClient'],
	props: {
		data: null,
	},
	data () {
		return {
			valueType: null,
			iri: null,
			active: false,
			typeIri: null,
		}
	},
	computed: {
		typeInfo() {
			if (this.typeIri) {
				let ret = knownTypes[this.typeIri];
				if (ret) {
					return ret;
				}
			}
			return { type: 'unknown' };
		}
	},
	created () {
		this.update();
	},
	watch: {
		data: 'update',
		typeIri: 'updateType'
	},
	methods: {
		update() {
			this.valueType = this.data.v.type;
			if (this.valueType === 'uri') {
				this.iri = this.data.v.value;
				this.apiClient.getTypeByIRI(this.iri).then(typeIri => this.typeIri = typeIri);
			}
		},
		updateType() {
			console.log('TYPE changed: ' + this.typeIri);
			if (knownTypes[this.typeIri]) {
				this.active = true;
			}
		}
	}
}
</script>

<style>
.value-info .badge {
	margin-left: 0.5em;
	vertical-align: top;
}
</style>
