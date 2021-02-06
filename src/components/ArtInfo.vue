<template>
	<div :class="typeClass">
		<p><strong>{{ typeName }}</strong>&nbsp;<Iri :iri="iri"></Iri></p>
		<div v-if="artifact">
			<p class="alabel" v-if="artifact._label">{{ artifact._label }}</p>
			<div v-if="typeName === 'Box Tree'">
			    <p class="url">{{ artifact.sourceUrl }}</p>
			</div>
			<p class="creator" :title="artifact.creatorParams">{{ artifact.creator }}</p>
			<p class="createdOn">{{ artifact.createdOn }}</p>
		</div>
	</div>
</template>

<style>
.artifact {
	border: 1px dotted var(--bs-gray);
	border-radius: 5px;
	margin: 1em;
	padding: 0.5em 1em;
	background-color: var(--bs-light);
}
.boxtree {
	background-color: #e1ffe1;
}
.areatree {
	background-color: #ffe1e1;
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
import IriDecoder from '@/common/iridecoder.js';
import {ApiClient} from '../common/apiclient.js';

export default {
	name: 'ArtInfo',
	components: {
		Iri
	},
	props: {
		iri: null
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
			console.log(this.artifact);
			switch (this.artifact._type) {
				case 'http://fitlayout.github.io/ontology/render.owl#Page':
					this.typeName = 'Box Tree';
					this.typeClass = 'artifact boxtree';
					break;
				case 'http://fitlayout.github.io/ontology/segmentation.owl#AreaTree':
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

