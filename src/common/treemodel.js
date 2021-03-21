export default class TreeModel {

	root = null;

	constructor(boxlist, createItem) {
		console.log(boxlist);
		if (createItem === undefined) {
			createItem = this.createItem;
		}
		this.root = this.createModel(boxlist, createItem);
	}

	createModel(boxlist, createItem) {
		let root = null;
		let rootBox = null;
		// find the root
		for (let box of boxlist) {
			if (box.isChildOf === undefined) {
				rootBox = box;
				root = createItem(rootBox);
				break;
			}
		}
		// recursively add children
		this.addChildren(rootBox, root, boxlist, createItem);
		console.log(root);
		return root;
	}

	addChildren(curbox, target, boxlist, createItem) {
		for (let box of boxlist) {
			if (box.isChildOf === curbox) {
				const child = createItem(box);
				child.parent = target;
				target.children.push(child);
				this.addChildren(box, child, boxlist, createItem);
			}
		}
	} 

	createItem(box) {
		let ret = {};
		ret.key = box.documentOrder;
		ret.data = box;

		let label = box.documentOrder;
		if (box.hasText !== undefined) {
			label = box.hasText;
			ret.icon = 'pi pi-fw pi-file';
		} else if (box.htmlTagName !== undefined) {
			label = '<' + box.htmlTagName + '>';
			ret.icon = 'pi pi-fw pi-clone';
		} else {
			label = '(box)';
			ret.icon = 'pi pi-fw pi-file';
		}
		ret.label = label;
		ret.children = [];
		return ret;
	}


}