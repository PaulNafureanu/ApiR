import structuredClone from "@ungap/structured-clone";

export interface TreeNode {
  id: string;
  parentId: string;
  layer: number;
  children: TreeNode[];
}

export function getTreeNodeClone(target: TreeNode, source: TreeNode): TreeNode {
  target.id = source.id;
  target.parentId = source.parentId;
  target.layer = source.layer;
  target.children = structuredClone(source.children);
  return target;
}

export class Tree {
  /**Private properties */
  private _root: TreeNode;
  private _idList: string[];

  constructor() {
    this._root = { id: "0", parentId: "0", layer: 0, children: [] };
    this._idList = ["0"];
  }

  /** Accessors */
  public getTreeClone(): Tree {
    let newTree = new Tree();
    newTree._idList = structuredClone(this._idList);
    newTree._root = structuredClone(this._root);
    return newTree;
  }
  public get root() {
    return this._root;
  }

  /** Private methods */
  private static _createNode(
    id: string,
    targetId: string,
    root: TreeNode
  ): TreeNode | false {
    const rootCopy: TreeNode = structuredClone(root);
    if (rootCopy.id === targetId) {
      rootCopy.children.push({
        id: id,
        parentId: rootCopy.id,
        layer: rootCopy.layer + 1,
        children: [],
      });
      return rootCopy;
    } else {
      const len = rootCopy.children.length;
      if (len) {
        let result;
        for (let i = 0; i < len; i++) {
          result = Tree._createNode(id, targetId, rootCopy.children[i]);
          if (result) {
            rootCopy.children[i] = result;
            break;
          }
        }
        if (result) {
          return rootCopy;
        } else {
          return false;
        }
      }
      {
        return false;
      }
    }
  }
  private static _deleteNode(id: string, root: TreeNode): TreeNode | false {
    if (id === "0") {
      return false;
    }

    const rootCopy: TreeNode = structuredClone(root);
    const children = rootCopy.children;
    const len = children.length;

    if (len) {
      let result;
      for (let i = 0; i < len; i++) {
        if (children[i].id === id) {
          children.splice(i, 1);
          rootCopy.children = children;
          return rootCopy;
        }

        result = Tree._deleteNode(id, children[i]);
        if (result) {
          children[i] = structuredClone(result);
          rootCopy.children[i] = children[i];
          return rootCopy;
        }
      }
    }

    return false;
  }
  private static _cleanUpIds(
    id: string,
    root: TreeNode,
    idList: string[],
    isChild: boolean
  ): string[] | false {
    const rootCopy: TreeNode = structuredClone(root);
    let idListCopy: string[] = structuredClone(idList);

    if ((rootCopy.id === id || isChild) && id !== "0") {
      const index = idListCopy.indexOf(rootCopy.id);
      if (index > -1) {
        idListCopy.splice(index, 1);
      } else {
        console.error(
          `Tree._cleanUpIds:: TargetID '${rootCopy.id}' was not found in the Id List. Provide a valid id or check Id List and Root Tree for desync.`
        );
        return false;
      }

      if (idListCopy.indexOf(rootCopy.id) > -1) {
        console.error(
          `Tree._cleanUpIds:: TargetID '${rootCopy.id}' was found duplicated in the Id List. Check the Id List and Root Tree.`
        );
        return false;
      }

      isChild = true;
    }

    const len = rootCopy.children.length;
    if (len) {
      for (let i = 0; i < len; i++) {
        let result = Tree._cleanUpIds(
          id,
          rootCopy.children[i],
          idListCopy,
          isChild
        );

        if (result) idListCopy = result;
        else return false;
      }
    }

    return idListCopy;
  }
  private static _getNode(id: string, root: TreeNode): TreeNode | false {
    const rootCopy: TreeNode = structuredClone(root);

    if (rootCopy.id === id) {
      const nodeFound: TreeNode = structuredClone(rootCopy);
      return nodeFound;
    } else {
      const len = rootCopy.children.length;
      if (len) {
        for (let i = 0; i < len; i++) {
          const result = Tree._getNode(id, rootCopy.children[i]);
          if (result) {
            return result;
          }
        }
      }
      return false;
    }
  }
  private static _addNode(
    node: TreeNode,
    targetId: string,
    tree: Tree
  ): Tree | false {
    const treeCopy: Tree = structuredClone(tree);
    const nodeCopy: TreeNode = structuredClone(node);

    const newRoot = addParentNode(treeCopy._root);
    if (newRoot) {
      treeCopy._root = newRoot;
      return treeCopy;
    } else {
      return false;
    }

    function setChildrenLayer(parentNode: TreeNode): TreeNode | false {
      const parentNodeCopy: TreeNode = structuredClone(parentNode);
      const len = parentNodeCopy.children.length;
      if (len) {
        const children: TreeNode[] = structuredClone(parentNode.children);
        let result;
        for (let i = 0; i < len; i++) {
          children[i].layer = parentNodeCopy.layer + 1;
          result = setChildrenLayer(children[i]);
          if (result) {
            children[i] = result;
          } else {
            return false;
          }
        }
        parentNodeCopy.children = children;
      }
      return parentNodeCopy;
    }

    function addParentNode(root: TreeNode): TreeNode | false {
      const rootCopy: TreeNode = structuredClone(root);
      if (rootCopy.id === targetId) {
        const children: TreeNode[] = structuredClone(nodeCopy.children);
        rootCopy.children.push({
          id: nodeCopy.id,
          parentId: rootCopy.id,
          layer: rootCopy.layer + 1,
          children: children,
        });
        const len = rootCopy.children.length;
        const nodeAdded = rootCopy.children[len - 1];
        const result = setChildrenLayer(nodeAdded);
        if (result) {
          rootCopy.children[len - 1] = result;
        } else {
          console.error("Tree.moveNode:: node push to the stack error.");
          return false;
        }

        return rootCopy;
      } else {
        const len = rootCopy.children.length;
        if (len) {
          let result;
          for (let i = 0; i < len; i++) {
            result = addParentNode(rootCopy.children[i]);
            if (result) {
              rootCopy.children[i] = result;
              break;
            }
          }
          if (result) {
            return rootCopy;
          } else {
            return false;
          }
        }
        {
          return false;
        }
      }
    }
  }

  /**Public methods */
  public static createNode(
    id: string,
    targetId: string,
    tree: Tree
  ): Tree | false {
    const newTree: Tree = tree.getTreeClone();
    if (!newTree._idList.includes(id)) {
      if (newTree._idList.includes(targetId)) {
        const result = Tree._createNode(id, targetId, newTree._root);
        if (result) {
          newTree._root = result;
          newTree._idList.push(id);
          return newTree;
        } else {
          console.error(
            `Tree.createNode:: TargetID '${targetId}' was not found in the Root Tree, but was found in the Id List. 
          The Id List and Root Tree are not sync. Please check Id List and Root Tree.`
          );
          return false;
        }
      } else {
        console.error(
          `Tree.createNode:: TargetID '${id}' was not found in the Id List. Provide a valid parent id or check Id List.`
        );
        return false;
      }
    }
    {
      console.error(
        `Tree.createNode:: Node ID '${id}' already in the Id List. Provide a different id or check the Id List.`
      );
      return false;
    }
  }
  public static deleteNode(id: string, tree: Tree): Tree | false {
    if (id === "0") {
      console.error(
        `Tree.deleteNode:: TargetID is '${id}'. It is not possible to remove the Root Tree. Provide a valid id.`
      );
      return false;
    }

    const newTree: Tree = tree.getTreeClone();
    if (newTree._idList.includes(id)) {
      const result = Tree._deleteNode(id, newTree._root);
      if (result) {
        const newIdList = Tree._cleanUpIds(
          id,
          newTree._root,
          newTree._idList,
          false
        );
        if (newIdList) {
          newTree._idList = newIdList;
        } else {
          return false;
        }
        newTree._root = result;

        return newTree;
      } else {
        console.error(
          `Tree.deleteNode:: TargetID '${id}' was not found in the Root Tree, but was found in the Id List. 
          The Id List and Root Tree are not sync. Please check Id List and Root Tree.`
        );
        return false;
      }
    } else {
      console.error(
        `Tree.deleteNode:: TargetID '${id}' was not found in the Id List. Provide a valid id or check Id List.`
      );
      return false;
    }
  }
  public static moveNode(
    id: string,
    targetId: string,
    tree: Tree
  ): Tree | false {
    const treeCopy: Tree = tree.getTreeClone();
    const idListCopy: string[] = structuredClone(treeCopy._idList);

    const resultGetNode = Tree.getNode(id, treeCopy);
    let nodeToBeMoved: TreeNode;
    if (resultGetNode) nodeToBeMoved = resultGetNode;
    else return false;

    const resultDeleteNode = Tree.deleteNode(id, treeCopy);
    let treeAfterDeletion: Tree;
    if (resultDeleteNode) {
      if (resultDeleteNode._idList.includes(targetId)) {
        treeAfterDeletion = resultDeleteNode;
        const treeAfterAddNode = Tree._addNode(
          nodeToBeMoved,
          targetId,
          treeAfterDeletion
        );
        if (treeAfterAddNode) {
          treeAfterAddNode._idList = idListCopy;
          return treeAfterAddNode;
        } else {
          console.error(
            `Tree.moveNode:: TargetID '${targetId}' was not found in the Root Tree, but was found in the Id List. 
          The Id List and Root Tree are not sync. Please check Id List and Root Tree.`
          );
          return false;
        }
      } else {
        console.error(
          `Tree.moveNode:: TargetID '${id}' was not found in the Id List. Provide a valid parent id or check Id List.`
        );
        return false;
      }
    } else {
      return false;
    }
  }
  public static getNode(id: string, tree: Tree): TreeNode | false {
    const newTree: Tree = tree.getTreeClone();

    if (newTree._idList.includes(id)) {
      const result = Tree._getNode(id, newTree._root);
      if (result) {
        return result;
      } else {
        console.error(
          `Tree.deleteNode:: TargetID '${id}' was not found in the Root Tree, but was found in the Id List. 
          The Id List and Root Tree are not sync. Please check Id List and Root Tree.`
        );
        return false;
      }
    } else {
      console.error(
        `Tree.deleteNode:: TargetID '${id}' was not found in the Id List. Provide a valid id or check Id List.`
      );
      return false;
    }
  }
}
