import type { TreeNode } from 'primevue/treenode';
import type { RdfObject } from './types';

export type { TreeNode };

export default class TreeModel {

    root: TreeNode = { // initial root node for an empty tree
        key: '0'
    }

    constructor() {
    }

    createForBoxes(boxlist: RdfObject[]): this {
        this.root = this.createModel(boxlist, this.createBoxItem);
        return this;
    }

    createForAreas(boxlist: RdfObject[]): this {
        this.root = this.createModel(boxlist, this.createAreaItem);
        return this;
    }

    //============================================================================

    createModel(boxlist: RdfObject[], createItem: (box: RdfObject) => TreeNode): TreeNode {
        let root!: TreeNode;
        let rootBox!: RdfObject;
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

    addChildren(curbox: RdfObject, target: TreeNode, boxlist: RdfObject[], createItem: (box: RdfObject) => TreeNode): void {
        for (let box of boxlist) {
            if (box.isChildOf === curbox) {
                const child = createItem(box);
                child.parent = target;
                target.children!.push(child);
                this.addChildren(box, child, boxlist, createItem);
            }
        }
    }

    createBoxItem(box: RdfObject): TreeNode {
        const ret: TreeNode = { key: String(box.documentOrder), data: box, children: [] };

        let label: string;
        if (box.text !== undefined) {
            label = box.text as string;
            ret.icon = 'pi pi-fw pi-file';
            ret.type = 'text';
        } else if (box.htmlTagName !== undefined) {
            label = '<' + (box.htmlTagName as string);
            if (box.hasAttribute) {
                for (let attr of (box.hasAttribute as RdfObject[])) {
                    let val = attr._value as string;
                    if (val.length > 15) {
                        val = val.substring(0, 12) + '...';
                    }
                    label += ' ' + (attr._label as string) + '=' + val;
                }
            }
            label += '>';
            ret.icon = 'pi pi-fw pi-clone';
        } else {
            label = '(box)';
            ret.icon = 'pi pi-fw pi-file';
        }
        ret.label = label;
        return ret;
    }

    createAreaItem(box: RdfObject): TreeNode {
        const ret: TreeNode = { key: String(box.documentOrder), data: box, children: [] };

        let label: string;
        if (box._label !== undefined) {
            label = box._label as string;
            ret.icon = 'pi pi-fw pi-file';
        } else {
            label = '<area>';
            ret.icon = 'pi pi-fw pi-clone';
        }
        ret.label = label;
        return ret;
    }


}
