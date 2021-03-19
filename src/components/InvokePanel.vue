<template>
	<div class="service-panel card">
			<div class="service p-formgroup-inline">
				<div class="p-field inl">
					<label :for="inputId" class="inl"><strong>Service</strong></label>
					<Dropdown v-model="key" :options="selList" optionLabel="name" optionValue="id">
						<template #option="opt">{{opt.option.name}} ({{opt.option.id}})</template>
						<template #value="opt" v-if="selection">{{selection[opt.value].name}} ({{selection[opt.value].id}})</template>
					</Dropdown>
				</div>
				<Button class="inl" v-on:click="invoke" :label="action" />
				<div v-if="loading" class="loading inl">
					<ProgressSpinner class="spinner" />
				</div>

				<InlineMessage v-if="error" class="error" severity="error" v-on:click="error=null">{{error}}</InlineMessage>
			</div>
			<ParamPanel v-if="params" :descr="paramDescr" :values="params"></ParamPanel>
	</div>
</template>

<script>
import Dropdown from 'primevue/dropdown';
import Panel from 'primevue/panel';
import Card from 'primevue/card';
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';
import InlineMessage from 'primevue/inlinemessage';

import ParamPanel from './ParamPanel.vue';

import {ApiClient} from '@/common/apiclient.js';


export default {
	name: 'InvokePanel',
	components: {
		Panel,
		Card,
		Dropdown,
		Button,
		ProgressSpinner,
		InlineMessage,
		ParamPanel
	},
	props: {
		source: null,
		target: null,
		action: null,
		currentArtifact: null
	},
	data () {
		return {
			loading: false,
			error: null,
			services: null,  //all services
			selection: null, //acceptable services
			selList: null,	 //acceptable service list
			key: null,		 //selected service key
			paramDescr: null, //selected service param description
			params: null	 //selected service params
		}
	},
	computed: {
		inputId() {
			return 'serv' + this.action;
		},
	},
	created () {
		this.loadServices();
		this.update();
	},
	watch: {
	},
	methods: {
		async loadServices() {
			const client = new ApiClient();
			try {
				let data = await client.fetchArtifactServices();
				this.services = data;

				this.selList = [];
				let sel = {};
				for (let serv of this.services) {
					if (serv.produces === this.target
							&& (!this.source || serv.consumes === this.source)) {
						sel[serv.id] = serv;
						this.selList.push(serv);
						if (this.key == null) {
							this.key = serv.id;
						}
					}
				}
				console.log(sel);
				this.selection = sel;

			} catch (error) {
				console.error('Couldnt fetch artifact services!', error);
			}
			this.update();
		},

		async update() {
			if (this.key) {
				//choose the service description
				this.paramDescr = this.selection[this.key].params;
				//get the current param values
				const client = new ApiClient();
				this.params = await client.getServiceParams(this.key);
			}
		},

		async invoke() {
			console.log('invoke');
			console.log(this.selection[this.key]);
			let src = this.findParentOfType()
			this.loading = true;

			let srcArtifact = null;
			const srcType = this.selection[this.key].consumes;
			if (srcType) {
				srcArtifact = this.findParentOfType(srcType);
			}
			const srcIri = srcArtifact ? srcArtifact._iri : null;
			console.log('src');
			console.log(srcArtifact);

			try {
				const client = new ApiClient();
				const iri = await client.createArtifact(this.key, this.params, srcIri);
				this.$router.push({name: 'show', params: {iri: iri}});
				this.error = null;
			} catch (e) {
				this.error = e.message;
			} finally {
				this.loading = false;
			}

			return false;
		},

		findParentOfType(type) {
			let current = this.currentArtifact;
			while (current && current._type !== type) {
				if (current.hasParentArtifact)  {
					current = current.hasParentArtifact;
				} else {
					current = null;
				}
			}
			return current;
		},


	}
}
</script>

<style>
.service-panel .p-field {
	margin-bottom: 0.5em;
}
.service-panel .p-field > label {
	margin-bottom: 0.1em;
}
.service .inl {
	vertical-align: baseline;
	display: inline-block;
	width: auto;
}
.service button.inl {
	width: auto;
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

/*.service-panel, .service-panel .btn, .service-panel .form-select, .service-panel .form-control {
	font-size: 0.8rem;
}
.service-panel {
	min-width: 50em;
	background-color: #f3f3f3;
	padding-top: 0.5em;
	padding-bottom: 0.5em;
	border: 1px ridge #d0d0d0;
}
.service {
	padding: 0 0 0.5em 0;
}
.service .inl {
	vertical-align: baseline;
	display: inline-block;
}
.service label {
	font-weight: bold;
	width: auto;
	display: inline-block;
	margin-right: 1em;
}
.service select {
	width: auto;
	margin-right: 1em;
}
.loading {
	display: inline-block;
	vertical-align: middle;
	margin-left: 1em;
}
.error {
	font-weight: bold;
	margin-left: 1em;
}
.error i {
	margin-right: 0.5em;
	font-size: 135%;
}*/
</style>
