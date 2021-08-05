<template>
	<div :class="typeClass" v-on:click="$emit('select-artifact', iri)">
		<div class="icons">
			<i class="pi pi-trash" title="Delete artifact" v-on:click="deleteArtifact"></i>
		</div>
		<p>
			<strong class="badge">{{ typeName }}</strong>&nbsp;
			<Iri :iri="iri"></Iri>
			<i class="pi pi-eye" title="Focus on this page" v-if="typeName === 'Page'"></i>
		</p>
		<div v-if="artifact">
			<p class="alabel text-truncate" :title="artifact._label" v-if="artifact._label">{{ artifact._label }}</p>
			<div class="ainfo">
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
	margin: 1em 0;
	padding: 0.5em 1em;
	background-color: var(--surface-b);
	border-radius: 5px;
	border: 1px solid var(--surface-400);
	/*box-shadow: 0 6px 6px -6px black;*/
}
.artifact .icons {
	float: right;
}
.artifact i.pi {
	margin-left: 0.5em;
	cursor: pointer;
	font-size: 120%;
}
.artifact .pi-eye {
	color: var(--primary-color);
}
.artifact .pi-trash:hover {
	color: #D32F2F;
}
.artifact .ainfo {
	display: block;
	font-size: 0;
}
.selected > .artifact {
	border: 2px solid var(--primary-color);
	/*box-shadow: 0 2px 6px -6px black;*/
}
.selected > .artifact .ainfo {
	display: block;
	font-size: 1em;
}
.artifact:hover .ainfo {
	display: block;
	font-size: 1em;
	transition: all 0.2s 0.3s;
}
.artifact p {
	margin: 0;
}
.artifact .alabel {
	font-weight: bold;
	font-size: 100%;
	margin: 0.25em 0;
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

export default {
	name: 'ArtInfo',
	components: {
		Iri
	},
	inject: ['apiClient'],
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
			try {
				this.artifact = await this.apiClient.fetchArtifactInfo(this.iri);
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
				case SEGM.ChunkSet:
					this.typeName = 'Chunk Set';
					this.typeClass = 'artifact chunkset';
					break;
				default:
					this.type = 'unknown';
					this.typeClass = 'artifact unknown';
					break;
			}
		},

		async deleteArtifact() {
			this.$emit('delete-artifact', this.iri);
		}
		
	}
}
</script>

