<template>
  <div class="post">
    <div v-if="loading" class="loading">
      Loading...
    </div>

	<Page :pageModel="pageModel">
	</Page>

    <div v-if="error" class="error">
      {{ error }}
    </div>

  </div>
</template>

<script>
import Page from './Page.vue';
import BOX from '../ontology/BOX.js';
import RDFModel from '../common/rdfmodel.js';
import BoxCreator from '../common/boxcreator.js';
const N3 = require('n3');

export default {
	name: 'PageView',
	components: {
		Page
	},
	props: {
	},
	data () {
		return {
			loading: false,
			error: null,
			pageModel: null
		}
	},
	created () {
		// fetch the data when the view is created and the data is
		// already being observed
		this.fetchData();
	},
	watch: {
		// call again the method if the route changes
		//'$route': 'fetchData'
	},
	methods: {
		async fetchData() {
			this.error = this.post = null;
			this.loading = true;
			
			const url = 'http://localhost:8080/fitlayout-web/service/artifact/item/r:art261';
			let pageModel = new RDFModel('http://fitlayout.github.io/resource/art261', BOX.Box, new BoxCreator());
			fetch(url, {
				method: 'GET',
				headers: {
					'Accept': 'text/turtle'
				}
			})
				.then(async response => {

					// check for error response
					if (!response.ok) {
						// get error message from body or default to response status
						this.error = response.status;
						return;
					}

					pageModel.parse(await response.text()).then(() => {
						window.flres = pageModel.getResources();
						console.log(pageModel.getElements());
						this.setPage(pageModel);
					});

					this.loading = false;
				})
				.catch(error => {
					this.error = error;
					console.error('There was an error!', error);
				});
		},

		setPage(page) {
			this.pageModel = page;
		}

	}
}
</script>
