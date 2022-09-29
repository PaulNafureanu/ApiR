namespace UserProject {
  /**USER ITEM (FOLDERS AND FILES CREATED BY THE USER)*/

  export type ItemType =
    | "GeneralFile"
    | "TextFile"
    | "PDFFile"
    | "WordFile"
    | "OpenFolder"
    | "ClosedFolder";

  export interface ItemReferenceId {
    itemId: number;
    itemReference: UserItem;
  }

  export class UserItem {
    static IdCount: number = 0;
    static UserItemReferenceIdList: ItemReferenceId[] = []; //A complete reference with all the items (folders and files) created by the user accessed by their id
    static SelectedUserItemIdList: number[]; //The user items that are currently selected by the user.
    id: number;
    isOpen: boolean;
    itemName: string;
    itemType: ItemType;
    iconColor: string;

    constructor(
      itemName: string,
      itemType: ItemType,
      iconColor: string,
      isOpen: boolean
    ) {
      UserItem.IdCount += 1;
      this.id = UserItem.IdCount;
      this.isOpen = isOpen;
      this.itemName = itemName;
      this.itemType = itemType;
      this.iconColor = iconColor;
    }

    addItemReference(itemId: number, itemReference: UserItem) {
      UserItem.UserItemReferenceIdList.push({
        itemId: itemId,
        itemReference: itemReference,
      });
      UserItem.SelectedUserItemIdList = [];
      UserItem.SelectedUserItemIdList.push(itemId);
    }

    static getItemReferenceById(id: number): UserItem {
      for (let i = 0; i < UserItem.UserItemReferenceIdList.length; i++) {
        if (UserItem.UserItemReferenceIdList[i].itemId == id) {
          return UserItem.UserItemReferenceIdList[i].itemReference;
        }
      }
      return new UserItem("ITEM_NOT_FOUND", "GeneralFile", "#ff0000", false);
    }

    static cleanItemReferenceById(id: number) {
      for (let i = 0; i < UserItem.UserItemReferenceIdList.length; i++) {
        if (UserItem.UserItemReferenceIdList[i].itemId == id) {
          UserItem.UserItemReferenceIdList.splice(i, 1);
          break;
        }
      }

      for (let i = 0; i < UserItem.SelectedUserItemIdList.length; i++) {
        if (UserItem.SelectedUserItemIdList[i] == id) {
          UserItem.SelectedUserItemIdList.splice(i, 1);
          break;
        }
      }
    }
  }

  export class UserFile extends UserItem {
    constructor(
      itemName: string,
      itemType: ItemType = "GeneralFile",
      iconColor: string = "#000000",
      isOpen: boolean = false
    ) {
      super(itemName, itemType, iconColor, isOpen);
      this.addItemReference(this.id, this);
    }
  }

  export class UserFolder extends UserItem {
    constructor(
      itemName: string,
      itemType: ItemType = "ClosedFolder",
      iconColor: string = "#000000",
      isOpen: boolean = false
    ) {
      super(itemName, itemType, iconColor, isOpen);
      this.addItemReference(this.id, this);
    }
  }

  /**TREE DATA STRUCTURE */

  export interface TreeNode {
    id: number;
    layer: number;
    children: TreeNode[];
  }

  export type NodeOperation = "AddNode" | "RemoveNode";

  export class Tree {
    root: TreeNode[];
    ids: number[];
    constructor() {
      this.root = [];
      this.ids = [];
    }

    findNode(
      treeNodes: TreeNode[],
      nodeIdToFind: number,
      operation: NodeOperation,
      childNodeId: number = 0
    ): boolean {
      for (let i = 0; i < treeNodes.length; i++) {
        if (treeNodes[i].id == nodeIdToFind) {
          if (operation == "AddNode") {
            treeNodes[i].children.push({
              id: childNodeId,
              layer: treeNodes[i].layer + 1,
              children: [],
            });
          } else {
            treeNodes.splice(i, 1);
          }
          return true;
        }
        if (treeNodes[i].children.length > 0) {
          if (
            this.findNode(
              treeNodes[i].children,
              nodeIdToFind,
              operation,
              childNodeId
            )
          ) {
            return true;
          }
        }
      }
      return false;
    }

    addNode(parentId: number, childId: number) {
      if (parentId == 0) {
        this.root.push({ id: childId, layer: 1, children: [] });
        this.ids.push(childId);
      } else {
        if (this.ids.includes(parentId)) {
          if (this.findNode(this.root, parentId, "AddNode", childId)) {
            this.ids.push(childId);
          } else {
            console.error(
              "AddNode Method of Tree Class::Fatal Logic Error for Find Node Method"
            );
          }
        } else {
          console.error(
            `AddNode Method of Tree Class:: The ${parentId} ID was not found in the Tree. Adding child operation failed. Check parent id in the root tree.`
          );
        }
      }
    }

    removeNode(nodeId: number) {
      if (this.ids.includes(nodeId)) {
        if (this.findNode(this.root, nodeId, "RemoveNode")) {
          for (let i = 0; i < this.ids.length; i++) {
            if (this.ids[i] == nodeId) {
              this.ids.splice(i, 1);
              break;
            }
          }
        } else {
          console.error(
            "RemoveNode Method of Tree Class::Fatal Logic Error for Find Node Method"
          );
        }
      } else {
        console.error(
          `RemoveNode Method of Tree Class:: The ${nodeId} ID was not found in the Tree. Adding child operation failed. Check parent id in the root tree.`
        );
      }
    }
  }

  /** USER PROJECT ROOT */

  export type MethodsSupported =
    | "createFile"
    | "createFolder"
    | "uploadFile"
    | "uploadFolder"
    | "rename"
    | "refresh"
    | "delete"
    | "collapseFolders";

  export function castString(str: MethodsSupported): MethodsSupported {
    return str;
  }

  export class UserProjectRoot {
    accountName: string;
    userItemsTree: Tree;
    activeWorkFolderId: number;

    constructor(accountName: string = "Demo") {
      this.accountName = accountName;
      this.userItemsTree = new Tree();
      this.activeWorkFolderId = 0;
    }

    private addUserItem(userItem: UserItem) {
      if (this.activeWorkFolderId == 0) {
        if (userItem.constructor.name == "UserFolder") {
          this.activeWorkFolderId = userItem.id;
        }
        this.userItemsTree.addNode(0, userItem.id);
      } else {
        this.userItemsTree.addNode(this.activeWorkFolderId, userItem.id);
      }
    }

    private removeUserItem(userItemId: number) {
      if (userItemId == this.activeWorkFolderId) {
        this.activeWorkFolderId = 0;
      }

      UserItem.cleanItemReferenceById(userItemId);
      this.userItemsTree.removeNode(userItemId);
    }

    /**User Project Methods for creating, modifying and deleting files and folders created by the user*/

    private static createNewUserProjectRoot(
      currentUserProjectRoot: UserProjectRoot
    ): UserProjectRoot {
      let newUserProjectRoot = new UserProjectRoot();
      Object.assign(newUserProjectRoot, currentUserProjectRoot);
      return newUserProjectRoot;
    }

    static createFile(
      currentUserProjectRoot: UserProjectRoot,
      itemName: string,
      iconColor: string
    ): UserProjectRoot {
      let newUserProjectRoot = UserProjectRoot.createNewUserProjectRoot(
        currentUserProjectRoot
      );

      let newFile = new UserFile(itemName, "GeneralFile", iconColor, true);
      newUserProjectRoot.addUserItem(newFile);

      return newUserProjectRoot;
    }
    static createFolder(
      currentUserProjectRoot: UserProjectRoot,
      itemName: string,
      iconColor: string
    ): UserProjectRoot {
      let newUserProjectRoot = UserProjectRoot.createNewUserProjectRoot(
        currentUserProjectRoot
      );

      let newFolder = new UserFolder(itemName, "ClosedFolder", iconColor);
      newUserProjectRoot.addUserItem(newFolder);

      return newUserProjectRoot;
    }
    static uploadFile(
      currentUserProjectRoot: UserProjectRoot
    ): UserProjectRoot {
      let newUserProjectRoot = UserProjectRoot.createNewUserProjectRoot(
        currentUserProjectRoot
      );
      return newUserProjectRoot;
      console.log("File Uploaded");
    }
    static uploadFolder(
      currentUserProjectRoot: UserProjectRoot
    ): UserProjectRoot {
      let newUserProjectRoot = UserProjectRoot.createNewUserProjectRoot(
        currentUserProjectRoot
      );
      return newUserProjectRoot;
      console.log("Folder Uploaded");
    }
    static rename(currentUserProjectRoot: UserProjectRoot): UserProjectRoot {
      let newUserProjectRoot = UserProjectRoot.createNewUserProjectRoot(
        currentUserProjectRoot
      );
      return newUserProjectRoot;
      console.log("Rename");
    }
    static refresh(currentUserProjectRoot: UserProjectRoot): UserProjectRoot {
      let newUserProjectRoot = UserProjectRoot.createNewUserProjectRoot(
        currentUserProjectRoot
      );
      return newUserProjectRoot;
      console.log("Refresh");
    }
    static delete(currentUserProjectRoot: UserProjectRoot): UserProjectRoot {
      let newUserProjectRoot = UserProjectRoot.createNewUserProjectRoot(
        currentUserProjectRoot
      );
      return newUserProjectRoot;
      console.log("Delete");
    }
    static collapseFolders(
      currentUserProjectRoot: UserProjectRoot
    ): UserProjectRoot {
      let newUserProjectRoot = UserProjectRoot.createNewUserProjectRoot(
        currentUserProjectRoot
      );
      return newUserProjectRoot;
      console.log("Collapse Folders");
    }
    // static none(currentUserProjectRoot: UserProjectRoot): UserProjectRoot {
    //   let newUserProjectRoot = UserProjectRoot.createNewUserProjectRoot(
    //     currentUserProjectRoot
    //   );
    //   return newUserProjectRoot;
    //   console.log("Testing");
    // }
  }
}

export default UserProject;
