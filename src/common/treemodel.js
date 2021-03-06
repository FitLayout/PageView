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
		if (box.text !== undefined) {
			label = box.text;
			ret.icon = 'pi pi-fw pi-file';
			ret.type = 'text';
		} else if (box.htmlTagName !== undefined) {
			label = '<' + box.htmlTagName
			if (box.hasAttribute) {
				for (let attr of box.hasAttribute) {
					let val = attr._value;
					if (val.length > 15) {
						val = val.substring(0, 12) + '...';
					}
					label += ' ' + attr._label + '=' + val;
				}
			} 
			label += '>';
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