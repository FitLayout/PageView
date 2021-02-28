<template>
	<div :class="typeClass" v-on:click="$emit('select-artifact', iri)">
		<p><strong class="badge">{{ typeName }}</strong>&nbsp;<Iri :iri="iri"></Iri></p>
		<div v-if="artifact">
			<p class="alabel text-truncate" :title="artifact._label" v-if="artifact._label">{{ artifact._label }}</p>
			<div v-if="expand">
				<div v-if="typeName === 'Page'">
					<p class="url">{{ artifact.sourceUrl }}</p>
				</div>
				<p class="creator" :title="artifact.creatorParams">{{ artifact.creator }}</p>
				<p class="createdOn">{{ artifact.createdOn }}</p>
			</div>
		</div>
	</div>
</template>

<style>
.artifact {
	margin: 1em;
	padding: 0.5em 1em;
	background-color: var(--bs-light);
}
.boxtree .badge {
	background-color: var(--bs-green);
}
.areatree .badge {
	background-color: var(--bs-orange);
}
.artifact p {
	margin: 0;
}
.artifact .alabel {
	font-weight: bold;
	font-size: 115%;
}
.artifact .creator, .artifact .url {
	font-size: 80%;
}
.artifact .createdOn {
	font-size: 80%;
	font-style: italic;
}

</style>

<script>
import Iri from './Iri.vue';
import BOX from '@/ontology/BOX.js';
import SEGM from '@/ontology/SEGM.js';
import IriDecoder from '@/common/iridecoder.js';
import {ApiClient} from '../common/apiclient.js';

export default {
	name: 'ArtInfo',
	components: {
		Iri
	},
	props: {
		iri: null,
		expand: null
	},
	data () {
		return {
			artifact: null,
			typeName: null,
			typeClass: null
		}
	},
	created () {
		this.reload();
	},
	watch: {
		iri: 'reload'
	},
	methods: {
		async reload() {
			const client = new ApiClient();
			try {
				this.artifact = await client.fetchArtifactInfo(this.iri);
			} catch (error) {
				console.error('Couldnt fetch artifact!', error);
			}
			this.update();
		},

		update() {
			//console.log(this.artifact);
			switch (this.artifact._type) {
				case BOX.Page:
					this.typeName = 'Page';
					this.typeClass = 'artifact boxtree';
					break;
				case SEGM.AreaTree:
					this.typeName = 'Area Tree';
					this.typeClass = 'artifact areatree';
					break;
				default:
					this.type = 'unknown';
					this.typeClass = 'artifact unknown';
					break;
			}
		}
	}
}
</script>

