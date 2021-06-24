
const STORAGE_KEY_LIST = 'flrepos';

export let RepositoryData = {

	getIDs: function() {
		const data = localStorage.getItem(STORAGE_KEY_LIST);
		if (data) {
			return JSON.parse(data);
		} else {
			return [];
		}
	},

	addID: function(id) {
		let ids = this.getIDs();
		if (!ids.includes(id)) {
			ids.push(id);
			localStorage.setItem(STORAGE_KEY_LIST, JSON.stringify(ids));
		}
	},

	deleteID: function(id) {
		let ids = this.getIDs();
		const index = ids.indexOf(id);
		if (index !== -1) {
			ids.splice(index, 1);
			localStorage.setItem(STORAGE_KEY_LIST, JSON.stringify(ids));
		}
	}

};
