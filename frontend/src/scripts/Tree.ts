export interface TreeNode {
  id: string;
  parentId: string;
  layer: number;
  children: TreeNode[];
}

export class Tree {
  private _root: TreeNode;
  private _idList: string[];

  constructor() {
    this._root = { id: "0", parentId: "0", layer: 0, children: [] };
    this._idList = ["0"];
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
        parentId: targetId,
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
    const rootCopy: TreeNode = structuredClone(root);
    if (rootCopy.id === id && id !== "0") {
      return rootCopy;
    } else {
      const len = rootCopy.children.length;
      if (len) {
        let result;
        for (let i = 0; i < len; i++) {
          result = Tree._deleteNode(id, rootCopy.children[i]);
          if (result) {
            rootCopy.children.splice(i, 1);
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
        let result = this._cleanUpIds(
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

  private static _moveNode(id: string, targetId: string): TreeNode | false {}
  // getNode(id: string): TreeNode {}

  /**Public methods */
  public static createNode(
    id: string,
    targetId: string,
    tree: Tree
  ): Tree | false {
    const newTree: Tree = structuredClone(tree);
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

    const newTree: Tree = structuredClone(tree);
    if (newTree._idList.includes(id)) {
      const result = Tree._deleteNode(id, newTree._root);
      if (result) {
        const newIdList = this._cleanUpIds(
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
  ): Tree | false {}
}

//TODO
