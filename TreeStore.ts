interface Item {
    id: number | string;
    parent: number | string;
    type?: string | null;
}

class TreeStore {
    tree: Item[] = [];
    treeIndexedByIds: Map<Item['id'], Item>;
    childrensByParentId: Map<Item['parent'], Item[]>

    constructor(tree: Item[]) {
        this.tree = tree;
        this.treeIndexedByIds = tree.reduce((acc: Map<Item['id'], Item>, treeIndexedById) => {
            acc.set(treeIndexedById.id, treeIndexedById);
            return acc;
        }, new Map());
        this.childrensByParentId = tree.reduce((acc: Map<Item['parent'], Item[]>, childrenByParentId) => {
            if (acc.has(childrenByParentId.parent)) {
                acc.get(childrenByParentId.parent)?.push(childrenByParentId)
            } else {
                acc.set(childrenByParentId.parent, [childrenByParentId])
            }
            return acc;
        }, new Map())
    }

    // Возвращает исходный массив
    getAll(): Item[] {
        return this.tree;
    }

    // Возвращает элемент по индексу
    getItem(id: Item['id']): Item | undefined {
        return this.treeIndexedByIds.get(id)
    }

    // Возвращает массив потомков элемента с переданным id
    getChildren(id: Item['id']): Item[] {
        return this.childrensByParentId.get(id) ?? []
    }

    // Возвращает массив потомков элемента с переданным id + потомков потомка и т.д.
    getAllChildren(id: Item['id']): Item[] {
        let result = this.getChildren(id);

        for (const children of result) {
            if (this.getChildren(children.id)) {
                result = result.concat(this.getAllChildren(children.id))
            }
        }

        return result;
    }
}

const items = [
    { id: 1, parent: 'root' },
    { id: 2, parent: 1, type: 'test' },
    { id: 3, parent: 1, type: 'test' },

    { id: 4, parent: 2, type: 'test' },
    { id: 5, parent: 2, type: 'test' },
    { id: 6, parent: 2, type: 'test' },

    { id: 7, parent: 4, type: null },
    { id: 8, parent: 4, type: null },
];

const ts = new TreeStore(items);
