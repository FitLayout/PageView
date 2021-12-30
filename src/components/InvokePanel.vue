<template>
	<div class="service-panel card">
			<div class="service p-formgroup-inline">
				<div class="p-field inl">
					<label :for="inputId" class="inl"><strong>Service</strong></label>
					<Dropdown v-model="key" v-if="grouped" :options="groupList" optionLabel="name" optionValue="id"
						optionGroupLabel="label" optionGroupChildren="items">
						<template #option="opt">
							<div class="option-cont option-cont-grouped">
								{{opt.option.name}} ({{opt.option.id}})
								<div class="option-descr">{{opt.option.description}}</div>
							</div>
						</template>
						<template #value="opt" v-if="selection">{{selection[opt.value].name}} ({{selection[opt.value].id}})</template>
					</Dropdown>
					<Dropdown v-model="key" v-else :options="selList" optionLabel="name" optionValue="id">
						<template #option="opt">
							<div class="option-cont">
								{{opt.option.name}} ({{opt.option.id}})
								<div class="option-descr">{{opt.option.description}}</div>
							</div>
						</template>
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
		id: null,
		source: null,
		target: null,
		action: null,
		grouped: null, 
		currentArtifact: null
	},
	data () {
		return {
			loading: false,
			error: null,
			services: null,  //all services
			selection: null, //acceptable services
			selList: null,	 //acceptable service list
			groupList: null, //grouped list if grouping is required
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
	async created () {
		await this.loadServices();
		this.restoreService();
		await this.restoreParams();
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
				this.selection = sel;
				if (this.grouped) {
					this.groupList = this.createGroups(this.selList);
					console.log(this.groupList);
				}

			} catch (error) {
				console.error('Couldnt fetch artifact services!', error);
			}
		},

		createGroups(list) {
			// create a map from category to list of services
			let cats = {};
			for (let serv of list) {
				let cat = serv.category ? serv.category : 'Other';
				let list = cats[cat];
				if (!list) {
					list = [];
					cats[cat] = list;
				}
				list.push(serv);
			}
			// transform to grouped list for Dropdown
			let groupList = [];
			for (let cat in cats) {
				groupList.push({
					label: cat,
					items: cats[cat]
				});
			}
			return groupList;
		},

		async update() {
			if (this.key) {
				//get the current param values
				await this.restoreParams();
				//choose the service description
				this.paramDescr = this.selection[this.key].params;
			}
		},

		async invoke() {
			this.saveParams();
			console.log('invoke');
			console.log(this.selection[this.key]);
			this.loading = true;

			let srcArtifact = null;
			const srcType = this.selection[this.key].consumes;
			if (srcType) {
				srcArtifact = this.findParentOfType(srcType);
			}
			const srcIri = srcArtifact ? srcArtifact._iri : null;
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

		restoreService() {
			let selected = localStorage.getItem('service-' + this.id);
			if (selected && this.selection[selected] !== undefined) {
				this.key = selected;
			}
		},

		async restoreParams() {
			if (this.key) {
				const str = localStorage.getItem('params-' + this.key);
				if (str === null) { //not yet in local storage, use defaults from server
					this.params = await this.apiClient.getServiceParams(this.key);
					this.saveParams();
				} else {
					this.params = JSON.parse(str);
				}
			}
		},

		saveParams() {
			if (this.key) {
				localStorage.setItem('service-' + this.id, this.key);
				localStorage.setItem('params-' + this.key, JSON.stringify(this.params));
			}
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
.option-cont .option-descr {
	font-size: 80%;
	font-style: italic;
}
.option-cont {
	padding-left: 0.5em;
	border-left: 1px solid var(--text-color-secondary)
}
.option-cont.option-cont-grouped {
	margin-left: 0.5em;
}
</style>
