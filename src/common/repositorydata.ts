
const STORAGE_KEY_LIST = 'flrepos';

export const RepositoryData = {

    getIDs(): string[] {
        const data = localStorage.getItem(STORAGE_KEY_LIST);
        if (data) {
            return JSON.parse(data);
        } else {
            return [];
        }
    },

    addID(id: string): void {
        let ids = this.getIDs();
        if (!ids.includes(id)) {
            ids.push(id);
            localStorage.setItem(STORAGE_KEY_LIST, JSON.stringify(ids));
        }
    },

    deleteID(id: string): void {
        let ids = this.getIDs();
        const index = ids.indexOf(id);
        if (index !== -1) {
            ids.splice(index, 1);
            localStorage.setItem(STORAGE_KEY_LIST, JSON.stringify(ids));
        }
    }

};
