<template>
	<div class="container-fluid service-panel">
		<form v-on:submit="invoke">
			<label for="sel-service">Service</label>
			<select class="form-select form-select-lg" v-model="key" v-on:change="update()" id="sel-service">
				<option v-for="serv in selection" :key="serv.id" :value="serv.id">
					{{serv.name}} ({{serv.id}})
				</option>
			</select>
			<ParamPanel v-if="params" :descr="paramDescr" :values="params"></ParamPanel>
			<div class="buttons">
				<div v-if="loading" class="loading">
					<div class="spinner-border text-primary" role="status">
					</div>
				</div>
				<button type="submit" class="btn btn-primary">
					{{action}}
				</button>
			</div>
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
.service-panel {
	min-width: 50em;
}
.buttons {
	margin: 1em 0;
	text-align: right;
}
.loading {
	float: left;
}
</style>
