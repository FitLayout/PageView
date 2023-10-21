<template>
	<div class="tag-card">
		<Card>
			<template #title>
				<strong class="tag badge" :style="tagDisplayStyle(tag)">{{ tag.type }}:{{ tag.name }}</strong><br/>
				<Iri :iri="tag.iri" />
				<a target="_blank" :href="exploreTagLink(tag.iri)"><i v-tooltip="'Show in RDF explorer'" class="ml-2 pi pi-share-alt"></i></a>
			</template>
			<template #content>
				<p><strong>Tagger: </strong><Iri :iri="tag.tagger" /></p>
				<div v-if="tag.service" class="service-descr">
					<strong>Service:</strong> <code v-tooltip="serviceTooltip">{{ tag.service }}</code>
				</div>
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
			name: null,
			params: []
		}
	},
	computed: {
		serviceTooltip() {
			let pdescr = '';
			if (this.params.length === 0) {
				pdescr = 'No additional params';
			} else {
				for (let param of this.params) {
					if (pdescr != '') {
						pdescr += '<br/>';
					}
					pdescr += `<b>${param.name}</b>=${param.value}`;
				}
			}
			return { value: pdescr, escape: true, autoHide: false };
		}
	},
	mounted () {
		this.fetchParams();
	},
	watch: {
	},
	methods: {
		async fetchParams() {
			const query = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
				PREFIX segm: <http://fitlayout.github.io/ontology/segmentation.owl#>
				PREFIX fl: <http://fitlayout.github.io/ontology/fitlayout.owl#>
				SELECT ?name ?value WHERE {
					<${this.tag.tagger}> fl:param ?param .
					?param fl:paramName ?name .
					?param fl:paramValue ?value
				}`;
			let resp = await this.apiClient.selectQuery(query);
            let params = [];
			if (resp && resp.results && resp.results.bindings) {
                for (let binding of resp.results.bindings) {
                    const name = binding.name.value;
                    const value = binding.value.value;
                    params.push({name, value});
                }
            }
			this.params = params;
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
	line-height: 1.8;
}
.tag-card p {
	margin-bottom: 0.2em;
}
.tag-card .service-descr code {
	word-wrap: break-word;
	border-bottom: 1px dotted;
}
</style>
