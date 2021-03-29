<template>
	<span class="value-info" v-if="valueType">
		<span v-if="valueType==='literal'">{{data.v.value}}</span>
		<span v-if="valueType==='uri'" :class='typeInfo.type'>
			<Iri :iri="data.v.value" :active="active" />
			<span v-if="typeInfo.name" class="badge">{{typeInfo.name}}</span>
		</span>
		<span v-if="valueType==='rectangle'" title="rectangle[x1, y1, x2, y2]">{{displayValue}}</span>
		<span v-if="valueType==='attribute'">{{displayValue}}</span>
	</span>
</template>

<script>
import Iri from './Iri.vue';
import BOX from '@/ontology/BOX.js';
import SEGM from '@/ontology/SEGM.js';
import RDF from '@/ontology/RDF.js';
import RDFS from '@/ontology/RDFS.js';
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
			displayValue: null
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
		data: 'update'
	},
	methods: {
		update() {
			this.valueType = this.data.v.type;
			if (this.valueType === 'uri') {
				this.iri = this.data.v.value;
				this.apiClient.getTypeByIRI(this.iri).then(typeIri => { 
					this.typeIri = typeIri;
					this.updateType();
				});
			}
		},
		updateType() {
			//console.log('TYPE changed: ' + this.typeIri);
			// undefined type - try to guess
			if (this.typeIri === 'unknown') {
				// guess by contents
				this.apiClient.getSubjectDescriptionObj(this.iri).then(descr => {
					// attributes
					if (this.data.p.value === BOX.hasAttribute) {
						this.valueType = 'attribute';
						this.displayValue = descr[RDFS.LABEL][0].value + '="' + descr[RDF.VALUE][0].value + '"';
					}
					// rectangles
					else if (descr[BOX.positionX] && descr[BOX.positionY]
						&& descr[BOX.width] && descr[BOX.height])
					{
						//it is a rectangle
						this.valueType = 'rectangle';
						this.displayValue = '['
							+ descr[BOX.positionX][0].value + ', '
							+ descr[BOX.positionY][0].value + ', '
							+ (parseInt(descr[BOX.positionX][0].value) + parseInt(descr[BOX.width][0].value) - 1) + ', '
							+ (parseInt(descr[BOX.positionY][0].value) + parseInt(descr[BOX.height][0].value) - 1) + ']';
					}
					else
					{
						console.log('Unknown type' + this.iri);
						console.log(descr);
					}
				});
			}
			// check known types
			else if (knownTypes[this.typeIri]) {
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
