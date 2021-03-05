<template>
	<div class="container-fluid service-panel">
		<form>
			<div class="service">
				<label :for="inputId">Service</label>
				<select class="form-select" v-model="key" v-on:change="update()" :id="inputId">
					<option v-for="serv in selection" :key="serv.id" :value="serv.id">
						{{serv.name}} ({{serv.id}})
					</option>
				</select>
				<button type="button" class="btn btn-primary" v-on:click="invoke">
					{{action}}
				</button>
				<div v-if="loading" class="loading">
					<div class="spinner-border text-primary" role="status">
					</div>
				</div>
			</div>
			<ParamPanel v-if="params" :descr="paramDescr" :values="params"></ParamPanel>
		</form>
	</div>
</template>

<script>
import {ApiClient} from '@/common/apiclient.js';
import ParamPanel from './ParamPanel.vue';

export default {
	name: 'InvokePanel',
	components: {
		ParamPanel
	},
	props: {
		target: null,
		action: null
	},
	data () {
		return {
			loading: false,
			services: null,  //all services
			selection: null, //acceptable services
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

				let sel = {};
				for (let serv of this.services) {
					if (serv.produces === this.target) {
						sel[serv.id] = serv;
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
			console.log(this.params);
			this.loading = true;

			try {
				const client = new ApiClient();
				const iri = await client.createArtifact(this.key, this.params);
				this.$router.push({name: 'show', params: {iri: iri}});
			} catch (e) {
				alert(e);
			} finally {
				this.loading = false;
			}

			return false;
		}
	}
}
</script>

<style>
.service-panel, .service-panel .btn, .service-panel .form-select, .service-panel .form-control {
	font-size: 0.8rem;
}
.service-panel {
	min-width: 50em;
	background-color: #f3f3f3;
	padding: 0.5em 0;
	border: 1px ridge #d0d0d0;
}
.service {
	padding: 0 0 0.5em 0;
}
.service label {
	font-weight: bold;
	width: auto;
	display: inline-block;
	margin-right: 1em;
}
.service select {
	width: auto;
	vertical-align: baseline;
	display: inline-block;
	margin-right: 1em;
}
.service button {
	display: inline-block;
	vertical-align: baseline;
}
.loading {
	display: inline-block;
	vertical-align: middle;
	margin-left: 1em;
}
</style>
