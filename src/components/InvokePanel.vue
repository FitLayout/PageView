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
	inject: ['apiClient'],
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
		'key': 'update'
	},
	methods: {
		async loadServices() {
			try {
				let data = await this.apiClient.fetchArtifactServices();
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
				//get the current param values
				this.params = await this.apiClient.getServiceParams(this.key);
				//choose the service description
				this.paramDescr = this.selection[this.key].params;
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
				const iri = await this.apiClient.createArtifact(this.key, this.params, srcIri);
				this.$emit('created', iri);
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
</style>
