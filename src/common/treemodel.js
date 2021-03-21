export default class TreeModel {

	root = null;

	constructor() {
	}

	createForBoxes(boxlist) {
		this.root = this.createModel(boxlist, this.createBoxItem);
		return this;
	}

	createForAreas(boxlist) {
		this.root = this.createModel(boxlist, this.createAreaItem);
		return this;
	}

	//============================================================================

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

	createBoxItem(box) {
		let ret = {};
		ret.key = box.documentOrder;
		ret.data = box;

		let label = box.documentOrder;
		if (box.hasText !== undefined) {
			label = box.hasText;
			ret.icon = 'pi pi-fw pi-file';
			ret.type = 'text';
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

	createAreaItem(box) {
		let ret = {};
		ret.key = box.documentOrder;
		ret.data = box;

		let label = box.documentOrder;
		if (box._label !== undefined) {
			label = box._label;
			ret.icon = 'pi pi-fw pi-file';
		} else {
			label = '<area>';
			ret.icon = 'pi pi-fw pi-clone';
		}
		ret.label = label;
		ret.children = [];
		return ret;
	}


}