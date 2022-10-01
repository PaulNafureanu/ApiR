namespace UserProject {
  /**USER ITEM (FOLDERS AND FILES CREATED BY THE USER)*/

  export type ItemType =
    | "GeneralFile"
    | "TextFile"
    | "PDFFile"
    | "WordFile"
    | "OpenFolder"
    | "ClosedFolder";

  export function getGeneralType(itemType: ItemType): "Folder" | "File" {
    if (["OpenFolder", "ClosedFolder"].includes(itemType)) {
      return "Folder";
    }
    return "File";
  }

  export interface ItemReferenceId {
    itemId: number;
    itemReference: UserItem;
  }

  export class UserItem {
    static IdCount: number = 0;
    static UserItemReferenceIdList: ItemReferenceId[] = []; //A complete reference with all the items (folders and files) created by the user accessed by their id
    static SelectedUserItemIdList: number[]; //The user items that are currently selected by the user.
    static activeFileId: number = 0;
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
      if (getGeneralType(itemType) == "File") {
        UserItem.activeFileId = UserItem.IdCount;
      }
      this.id = UserItem.IdCount;
      this.isOpen = isOpen;
      this.itemName = itemName;
      this.itemType = itemType;
      this.iconColor = iconColor;
    }

    static addSelectedUserItemId(itemId: number) {
      // if (UserItem.SelectedUserItemIdList.includes(itemId)) return;
      UserItem.SelectedUserItemIdList.push(itemId);
    }

    static removeSelectedUserItemId(itemId: number) {
      // if (!UserItem.SelectedUserItemIdList.includes(itemId)) return;
      for (let i = 0; i < UserItem.SelectedUserItemIdList.length; i++) {
        if (UserItem.SelectedUserItemIdList[i] == itemId) {
          UserItem.SelectedUserItemIdList.splice(i, 1);
        }
      }
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
      isOpen: boolean = true
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

  export type NodeOperation = "AddNode" | "RemoveNode" | "FindNode";

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
    ): boolean | TreeNode {
      for (let i = 0; i < treeNodes.length; i++) {
        if (treeNodes[i].id == nodeIdToFind) {
          switch (operation) {
            case "AddNode": {
              treeNodes[i].children.push({
                id: childNodeId,
                layer: treeNodes[i].layer + 1,
                children: [],
              });
              return true;
            }
            case "RemoveNode": {
              treeNodes.splice(i, 1);
              return true;
            }
            case "FindNode": {
              return treeNodes[i];
            }
            default: {
              return false;
            }
          }
        }
        if (treeNodes[i].children.length > 0) {
          let child = this.findNode(
            treeNodes[i].children,
            nodeIdToFind,
            operation,
            childNodeId
          );
          if (child) {
            return child;
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

    private findUserItem(userItemId: number): TreeNode {
      let result = this.userItemsTree.findNode(
        this.userItemsTree.root,
        userItemId,
        "FindNode"
      );

      if (typeof result == "boolean") return { id: 0, layer: 0, children: [] };
      else {
        return result;
      }
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

      let newFile = new UserFile(itemName, "GeneralFile", iconColor);
      newUserProjectRoot.addUserItem(newFile);
      UserItem.activeFileId = newFile.id;

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
      newUserProjectRoot.activeWorkFolderId = newFolder.id;

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
    static handleUserItemClick(
      currentUserProjectRoot: UserProjectRoot,
      itemId: number,
      isCtrlPressed: boolean,
      isShiftPressed: boolean
    ): UserProjectRoot {
      let newUserProjectRoot = UserProjectRoot.createNewUserProjectRoot(
        currentUserProjectRoot
      );

      let userItem = UserProject.UserItem.getItemReferenceById(itemId);
      let generalType = getGeneralType(userItem.itemType);

      if (isCtrlPressed) {
        if (UserFile.SelectedUserItemIdList.includes(itemId)) {
          UserItem.removeSelectedUserItemId(itemId);
        } else {
          UserItem.addSelectedUserItemId(itemId);
        }
      } else {
        if (isShiftPressed) {
          let previousUserItemSelectedId =
            UserItem.SelectedUserItemIdList[
              UserItem.SelectedUserItemIdList.length - 1
            ];
          let currentUserItemSelectedId = itemId;

          //TODO: add also to the selection the files included in end folders
          // let userItem = UserItem.getItemReferenceById(
          //   currentUserItemSelectedId
          // );
          // let generalType = getGeneralType(userItem.itemType);
          // if (generalType == "Folder") {
          //   let currentUserItemTreeNode = newUserProjectRoot.findUserItem(
          //     currentUserItemSelectedId
          //   );
          //   let len = currentUserItemTreeNode.children.length;
          //   if (currentUserItemTreeNode.id != 0 && len > 0) {
          //     currentUserItemSelectedId =
          //       currentUserItemTreeNode.children[len - 1].id;
          //   }
          // }

          if (currentUserItemSelectedId != previousUserItemSelectedId) {
            let rootNodes = newUserProjectRoot.userItemsTree.root;

            let selectedUserItemsToAdd: number[] =
              UserProjectRoot.findSelectedItemsToAdd(
                currentUserItemSelectedId,
                previousUserItemSelectedId,
                rootNodes,
                false,
                false
              );

            for (let i = 0; i < selectedUserItemsToAdd.length; i++) {
              if (
                UserItem.SelectedUserItemIdList.includes(
                  selectedUserItemsToAdd[i]
                )
              ) {
                continue;
              } else {
                UserItem.addSelectedUserItemId(selectedUserItemsToAdd[i]);
              }
            }
          }
        } else {
          UserItem.SelectedUserItemIdList = [];
          UserItem.SelectedUserItemIdList.push(itemId);

          if (generalType == "File") {
            UserItem.activeFileId = itemId;
            userItem.isOpen = true;
          } else {
            userItem.isOpen = !userItem.isOpen;
            newUserProjectRoot.activeWorkFolderId = itemId;
          }
        }
      }

      return newUserProjectRoot;
    }

    static findSelectedItemsToAdd(
      currentUserItemSelectedId: number,
      previousUserItemSelectedId: number,
      userItemsTreeNodes: TreeNode[],
      startAdding: boolean,
      stopAdding: boolean
    ): number[] {
      if (stopAdding) {
        return [];
      }
      let selectedUserItemsToAdd: number[] = [];
      for (let i = 0; i < userItemsTreeNodes.length; i++) {
        if (stopAdding) {
          return selectedUserItemsToAdd;
        }
        if (startAdding) {
          if (
            userItemsTreeNodes[i].id == currentUserItemSelectedId ||
            userItemsTreeNodes[i].id == previousUserItemSelectedId
          ) {
            selectedUserItemsToAdd.push(userItemsTreeNodes[i].id);
            stopAdding = true;
            startAdding = false;
            return selectedUserItemsToAdd;
          }

          selectedUserItemsToAdd.push(userItemsTreeNodes[i].id);

          if (userItemsTreeNodes[i].children.length > 0) {
            selectedUserItemsToAdd = selectedUserItemsToAdd.concat(
              UserProjectRoot.findSelectedItemsToAdd(
                currentUserItemSelectedId,
                previousUserItemSelectedId,
                userItemsTreeNodes[i].children,
                startAdding,
                stopAdding
              )
            );
          }
        } else {
          if (
            userItemsTreeNodes[i].id == currentUserItemSelectedId ||
            userItemsTreeNodes[i].id == previousUserItemSelectedId
          ) {
            startAdding = true;
            stopAdding = false;
            selectedUserItemsToAdd.push(userItemsTreeNodes[i].id);
          }

          if (userItemsTreeNodes[i].children.length > 0) {
            selectedUserItemsToAdd = selectedUserItemsToAdd.concat(
              UserProjectRoot.findSelectedItemsToAdd(
                currentUserItemSelectedId,
                previousUserItemSelectedId,
                userItemsTreeNodes[i].children,
                startAdding,
                stopAdding
              )
            );
          }
        }
      }

      return selectedUserItemsToAdd;
    }
  }
}

export default UserProject;
