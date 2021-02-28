<template>
	<div class="container-fluid service-panel">
		<form>
			<select class="form-select">
				<option v-for="serv in selection" :key="serv.id" :value="serv.id">
					{{serv.name}} ({{serv.id}})
				</option>
			</select>
		</form>
	</div>
</template>

<script>
import {ApiClient} from '@/common/apiclient.js';

export default {
	name: 'InvokePanel',
	components: {
	},
	props: {
		target: null
	},
	data () {
		return {
			services: null,
			selection: null
		}
	},
	created () {
		this.loadServices();
	},
	watch: {
	},
	methods: {
		async loadServices() {
			const client = new ApiClient();
			try {
				let data = await client.fetchArtifactServices();
				this.services = data.result;

				let sel = {};
				for (let serv of this.services) {
					if (serv.produces === this.target) {
						sel[serv.id] = serv;
					}
				}
				console.log(sel);
				this.selection = sel;

			} catch (error) {
				console.error('Couldnt fetch artifact services!', error);
			}
			this.update();
		},

		update() {
		}
	}
}
</script>

<style>
.service-panel {
	width: 50em !important;
}
</style>
