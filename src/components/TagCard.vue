<template>
	<div class="tag-card">
		<Card>
			<template #title>
				<strong class="tag badge" :style="tagDisplayStyle(tag)">{{ tag.type }}:{{ tag.name }}</strong><br/>
				<Iri :iri="tag.iri" />
				<a target="_blank" :href="exploreTagLink(tag.iri)"><i v-tooltip="'Show in RDF explorer'" class="ml-2 pi pi-share-alt"></i></a>
			</template>
			<template #content>
				Tagger info
			</template>
		</Card>
	</div>
</template>

<script>
import Card from 'primevue/card';
import Iri from './Iri.vue';

import {stringColor} from '../common/utils.js';

export default {
	name: 'TagCard',
	inject: ['apiClient'],
	props: {
		tag: null
	},
	components: {
		Card,
		Iri
	},
	data () {
		return {
			type: null,
			name: null
		}
	},
	created () {
		this.update();
	},
	watch: {
	},
	methods: {
		update() {
		},

		exploreTagLink(iri) {
			let route = this.$router.resolve({name: 'explore', params: { repoId: this.$route.params.repoId, iri: iri }});
			return route.href;
		},

		tagDisplayStyle(tag) {
			return 'background-color:' + stringColor(tag.name);
		}

	}
}
</script>

<style>
.tag-card {
	width: 20em;
	float: left;
	margin: 1em;
}
.tag-card .p-card .p-card-title {
	font-size: 100%;
	font-weight: normal;
	line-height: 1.5;
}
</style>
