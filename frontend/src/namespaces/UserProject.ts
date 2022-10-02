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
    isVisible: boolean;
    itemName: string;
    itemType: ItemType;
    iconColor: string;

    constructor(
      itemName: string,
      itemType: ItemType,
      iconColor: string,
      isOpen: boolean,
      isVisible: boolean = false
    ) {
      UserItem.IdCount += 1;
      if (getGeneralType(itemType) == "File") {
        UserItem.activeFileId = UserItem.IdCount;
      }
      this.id = UserItem.IdCount;
      this.isOpen = isOpen;
      this.isVisible = isVisible;
      this.itemName = itemName;
      this.itemType = itemType;
      this.iconColor = iconColor;
    }

    static addSelectedUserItemId(itemId: number) {
      UserItem.SelectedUserItemIdList.push(itemId);
    }

    static removeSelectedUserItemId(itemId: number) {
      for (let i = 0; i < UserItem.SelectedUserItemIdList.length; i++) {
        if (UserItem.SelectedUserItemIdList[i] == itemId) {
          UserItem.SelectedUserItemIdList.splice(i, 1);
          break;
        }
      }
      if (UserItem.SelectedUserItemIdList.includes(itemId))
        this.removeSelectedUserItemId(itemId);
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
    parentId: number;
    layer: number;
    children: TreeNode[];
  }

  export type NodeOperation = "AddNode" | "RemoveNode" | "FindNode";

  export function isTreeNode(value: TreeNode | boolean): value is TreeNode {
    if (typeof value == "boolean") {
      return false;
    } else {
      return true;
    }
  }

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
                parentId: nodeIdToFind,
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
        this.root.push({ id: childId, parentId: 0, layer: 1, children: [] });
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
          `RemoveNode Method of Tree Class:: The ${nodeId} ID was not found in the Tree. Removing child operation failed. Check parent id in the root tree.`
        );
      }
    }
  }

  /** USER PROJECT ROOT */

  export type ModifierMethodsSupported =
    | "createFile"
    | "createFolder"
    | "rename"
    | "delete";
  export type ExtraMethodsSupported = "refresh" | "collapse";

  export type MethodsSupported =
    | ModifierMethodsSupported
    | ExtraMethodsSupported;

  export function isAModifierMethod(
    value: MethodsSupported
  ): value is ModifierMethodsSupported {
    return ["createFile", "createFolder", "rename", "delete"].includes(value);
  }

  export function isAnExtraMethod(
    value: MethodsSupported
  ): value is ExtraMethodsSupported {
    return ["refresh", "collapse"].includes(value);
  }

  export function castToMofierMethod(
    str: ModifierMethodsSupported
  ): ModifierMethodsSupported {
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
      if (userItemId == UserItem.activeFileId) UserItem.activeFileId = 0;
      if (userItemId == this.activeWorkFolderId) this.activeWorkFolderId = 0;

      this.userItemsTree.removeNode(userItemId);
      UserItem.cleanItemReferenceById(userItemId);
    }

    private findUserItemNode(userItemId: number): TreeNode {
      let result = this.userItemsTree.findNode(
        this.userItemsTree.root,
        userItemId,
        "FindNode"
      );

      if (UserProject.isTreeNode(result)) return result;
      else return { id: 0, parentId: 0, layer: 0, children: [] };
    }

    /**User Project Methods for creating, modifying and deleting files and folders created by the user*/

    private static createNewUserProjectRoot(
      currentUserProjectRoot: UserProjectRoot
    ): UserProjectRoot {
      let newUserProjectRoot = new UserProjectRoot();
      Object.assign(newUserProjectRoot, currentUserProjectRoot);
      return newUserProjectRoot;
    }

    private static cleanUpBeforeReturn(newUserProjectRoot: UserProjectRoot) {
      newUserProjectRoot.setVisibleItems(
        newUserProjectRoot.userItemsTree.root,
        true
      );
      // newUserProjectRoot.userItemsTree.root =
      console.log(
        newUserProjectRoot.sortUserItems(newUserProjectRoot.userItemsTree.root)
      ); //returns undefined;
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

      UserProjectRoot.cleanUpBeforeReturn(newUserProjectRoot);
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

      UserProjectRoot.cleanUpBeforeReturn(newUserProjectRoot);
      return newUserProjectRoot;
    }

    static rename(
      currentUserProjectRoot: UserProjectRoot,
      itemName: string,
      iconColor: string
    ): UserProjectRoot {
      let newUserProjectRoot = UserProjectRoot.createNewUserProjectRoot(
        currentUserProjectRoot
      );

      let itemId =
        UserItem.SelectedUserItemIdList[
          UserItem.SelectedUserItemIdList.length - 1
        ];

      let userItem = UserItem.getItemReferenceById(itemId);

      userItem.itemName = itemName;
      userItem.iconColor = iconColor;

      return newUserProjectRoot;
    }

    static delete(currentUserProjectRoot: UserProjectRoot): UserProjectRoot {
      let newUserProjectRoot = UserProjectRoot.createNewUserProjectRoot(
        currentUserProjectRoot
      );

      let len = UserItem.SelectedUserItemIdList.length;
      let selectedItems: number[] = [];
      Object.assign(selectedItems, UserItem.SelectedUserItemIdList);

      if (len > 0) {
        for (let i = 0; i < len; i++) {
          let itemId = selectedItems[i];
          newUserProjectRoot.removeUserItem(itemId);
        }

        UserItem.SelectedUserItemIdList = [];
      }

      UserProjectRoot.cleanUpBeforeReturn(newUserProjectRoot);
      return newUserProjectRoot;
    }

    static refresh(currentUserProjectRoot: UserProjectRoot): UserProjectRoot {
      let newUserProjectRoot = UserProjectRoot.createNewUserProjectRoot(
        currentUserProjectRoot
      );

      UserProjectRoot.cleanUpBeforeReturn(newUserProjectRoot);
      return newUserProjectRoot;
    }

    static collapse(currentUserProjectRoot: UserProjectRoot): UserProjectRoot {
      let newUserProjectRoot = UserProjectRoot.createNewUserProjectRoot(
        currentUserProjectRoot
      );

      let len = newUserProjectRoot.userItemsTree.ids.length;
      let ids = newUserProjectRoot.userItemsTree.ids;

      for (let i = 0; i < len; i++) {
        let userItem = UserItem.getItemReferenceById(ids[i]);
        if (getGeneralType(userItem.itemType) == "Folder") {
          userItem.isOpen = false;
          userItem.itemType = "ClosedFolder";
        }
      }

      UserProjectRoot.cleanUpBeforeReturn(newUserProjectRoot);
      return newUserProjectRoot;
    }

    static handleUploadFile(
      currentUserProjectRoot: UserProjectRoot,
      file: File
    ): UserProjectRoot {
      let newUserProjectRoot = UserProjectRoot.createNewUserProjectRoot(
        currentUserProjectRoot
      );
      let fileName, fileType, iconColor;
      let itemType: ItemType;
      let nameParts = file.name.split(".");
      let len = nameParts.length;
      if (len > 2) {
        fileName = nameParts.slice(0, -1).join(".");
      } else {
        fileName = nameParts[0];
      }
      fileType = nameParts[len - 1];

      switch (true) {
        case ["docx", "doc"].includes(fileType): {
          itemType = "WordFile";
          iconColor = "#4B8CDB";
          break;
        }
        case ["pdf"].includes(fileType): {
          itemType = "PDFFile";
          iconColor = "#E2574C";
          break;
        }
        case ["txt"].includes(fileType): {
          iconColor = "#9BC9FF";
          itemType = "TextFile";
          break;
        }
        default: {
          iconColor = "#447EAB";
          itemType = "GeneralFile";
          break;
        }
      }

      let size = newUserProjectRoot.userItemsTree.ids.length;
      let ids = newUserProjectRoot.userItemsTree.ids;

      let isDuplicated = false;
      for (let i = 0; i < size; i++) {
        let userItem = UserItem.getItemReferenceById(ids[i]);
        if (userItem.itemName == fileName && userItem.itemType == itemType) {
          isDuplicated = true;
          break;
        }
      }

      if (!isDuplicated) {
        let newFile = new UserFile(fileName, itemType, iconColor);
        newUserProjectRoot.addUserItem(newFile);
        UserItem.activeFileId = newFile.id;
      }

      UserProjectRoot.cleanUpBeforeReturn(newUserProjectRoot);
      return newUserProjectRoot;
    }

    static handleFreeSpaceClick(
      currentUserProjectRoot: UserProjectRoot
    ): UserProjectRoot {
      let newUserProjectRoot = UserProjectRoot.createNewUserProjectRoot(
        currentUserProjectRoot
      );

      UserItem.SelectedUserItemIdList = [];
      newUserProjectRoot.activeWorkFolderId = 0;

      return newUserProjectRoot;
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
          let generalType = getGeneralType(userItem.itemType);
          if (generalType == "Folder")
            newUserProjectRoot.deselectAllItemsFromFolder(itemId);
        } else {
          UserItem.addSelectedUserItemId(itemId);
          let generalType = getGeneralType(userItem.itemType);
          if (generalType == "Folder")
            newUserProjectRoot.selectAllItemsFromFolder(itemId);
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
          let userItemNode = newUserProjectRoot.findUserItemNode(itemId);

          if (generalType == "File") {
            UserItem.activeFileId = itemId;
            userItem.isOpen = true;
            if (userItemNode.layer == 1)
              newUserProjectRoot.activeWorkFolderId = 0;
            if (userItemNode.layer > 1)
              newUserProjectRoot.activeWorkFolderId = userItemNode.parentId;
          } else {
            newUserProjectRoot.selectAllItemsFromFolder(itemId);
            userItem.isOpen = !userItem.isOpen;
            if (userItem.isOpen) userItem.itemType = "OpenFolder";
            else userItem.itemType = "ClosedFolder";
            newUserProjectRoot.activeWorkFolderId = itemId;
          }
        }
      }

      UserProjectRoot.cleanUpBeforeReturn(newUserProjectRoot);
      return newUserProjectRoot;
    }

    setVisibleItems(userItemsTreeNodes: TreeNode[], value: boolean) {
      for (let i = 0; i < userItemsTreeNodes.length; i++) {
        let userItem = UserItem.getItemReferenceById(userItemsTreeNodes[i].id);
        userItem.isVisible = value;
        if (userItemsTreeNodes[i].children.length > 0 && userItem.isOpen) {
          this.setVisibleItems(userItemsTreeNodes[i].children, value);
        }
        if (userItemsTreeNodes[i].children.length > 0 && !userItem.isOpen) {
          this.setVisibleItems(userItemsTreeNodes[i].children, false);
        }
      }
    }

    countVisibleItems() {
      let count = 0;
      function iterateTreeNode(userItemsTreeNodes: TreeNode[]) {
        for (let i = 0; i < userItemsTreeNodes.length; i++) {
          let userItem = UserItem.getItemReferenceById(
            userItemsTreeNodes[i].id
          );
          if (userItem.isVisible) count++;
          if (userItemsTreeNodes[i].children.length > 0) {
            iterateTreeNode(userItemsTreeNodes[i].children);
          }
        }
      }
      iterateTreeNode(this.userItemsTree.root);
      return count;
    }

    sortUserItems(userItemsTreeNodes: TreeNode[]): TreeNode[] {
      function sortArray(arr: TreeNode[]): TreeNode[] {
        let sortedArray: TreeNode[] = [];
        let aux: TreeNode = {
          id: 0,
          parentId: 0,
          layer: 0,
          children: [],
        };

        for (let i = 0; i < arr.length - 1; i++) {
          let min = arr[i];
          for (let j = i + 1; j < arr.length; j++) {
            let arrJName = UserItem.getItemReferenceById(arr[j].id).itemName;
            let minName = UserItem.getItemReferenceById(arr[i].id).itemName;
            if (arrJName < minName) {
              Object.assign(aux, arr[j]);
              Object.assign(arr[j], min);
              Object.assign(min, aux);
            }
          }
          sortedArray.push(min);
        }
        sortedArray.push(arr[arr.length - 1]);
        return sortedArray;
      }

      let sortedUserFilesTreeNodes: TreeNode[] = [];
      let auxUserFilesTreeNodes: TreeNode[] = [];
      let sortedUserFoldersTreNodes: TreeNode[] = [];
      let auxUserFoldersTreNodes: TreeNode[] = [];

      for (let i = 0; i < userItemsTreeNodes.length; i++) {
        if (
          userItemsTreeNodes[i].children &&
          userItemsTreeNodes[i].children.length > 0
        ) {
          auxUserFoldersTreNodes.push(userItemsTreeNodes[i]);
          userItemsTreeNodes[i].children = this.sortUserItems(
            userItemsTreeNodes[i].children
          );
        } else {
          auxUserFilesTreeNodes.push(userItemsTreeNodes[i]);
        }
      }

      sortedUserFilesTreeNodes = sortArray(auxUserFilesTreeNodes);
      sortedUserFoldersTreNodes = sortArray(auxUserFoldersTreNodes);

      return sortedUserFoldersTreNodes.concat(sortedUserFilesTreeNodes);
    }

    private selectAllItemsFromFolder(folderId: number) {
      let userItemNode = this.findUserItemNode(folderId);
      if (userItemNode.children && userItemNode.children.length > 0) {
        let len = userItemNode.children.length;
        for (let i = 0; i < len; i++) {
          let childId = userItemNode.children[i].id;
          let userItem = UserItem.getItemReferenceById(childId);
          if (!UserItem.SelectedUserItemIdList.includes(childId)) {
            UserItem.SelectedUserItemIdList.push(userItemNode.children[i].id);
            let generalType = getGeneralType(userItem.itemType);
            if (generalType == "Folder") this.selectAllItemsFromFolder(childId);
          }
        }
      }
    }

    private deselectAllItemsFromFolder(folderId: number) {
      let userItemNode = this.findUserItemNode(folderId);
      if (userItemNode.children && userItemNode.children.length > 0) {
        let len = userItemNode.children.length;
        for (let i = 0; i < len; i++) {
          let childId = userItemNode.children[i].id;
          let userItem = UserItem.getItemReferenceById(childId);
          if (UserItem.SelectedUserItemIdList.includes(childId)) {
            UserItem.removeSelectedUserItemId(userItemNode.children[i].id);
            let generalType = getGeneralType(userItem.itemType);
            if (generalType == "Folder")
              this.deselectAllItemsFromFolder(childId);
          }
        }
      }
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
