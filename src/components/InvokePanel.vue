<template>
	<div class="container-fluid service-panel">
		<form>
			<div class="service">
				<label :for="inputId" class="inl">Service</label>
				<select class="form-select inl" v-model="key" v-on:change="update()" :id="inputId">
					<option v-for="serv in selection" :key="serv.id" :value="serv.id">
						{{serv.name}} ({{serv.id}})
					</option>
				</select>
				<button type="button" class="btn btn-primary inl" v-on:click="invoke">
					{{action}}
				</button>
				<div v-if="loading" class="loading inl">
					<div class="spinner-border spinner-border-sm text-primary" role="status">
					</div>
				</div>
				<div v-if="error" class="error inl text-danger">
					<i class="bi bi-x-circle-fill" v-on:click="error=null"></i><span>{{error}}</span>
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
			error: null,
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
				this.error = null;
			} catch (e) {
				this.error = e.message;
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
}
</style>
