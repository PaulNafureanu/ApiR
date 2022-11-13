import { getTreeNodeClone, Tree, TreeNode } from "./Tree";
import {
  UserFile,
  UserFolder,
  fileFormat,
  folderFormat,
  itemType,
} from "./UserItem";

export interface MethodOptions {
  method: MethodsSupported;
  name: string;
  iconColor: string;
  id?: string;
  isCtrlPressed?: boolean;
  isShiftPressed?: boolean;
  files?: FileList;
  fileFormat?: fileFormat;
  targetId?: string;
  sourceId?: string;
}

class UserProject {
  private static _idCount: number = 0;
  private _accountName: string;
  private _userFileList: UserFile[];
  private _userFolderList: UserFolder[];
  private _userItemIdList: string[];
  private _userTree: Tree;

  private _activeWorkingFileId: string;
  private _activeWorkingFolderId: string;
  private _selectedUserItemIdList: string[];

  constructor(accountName: string) {
    this._accountName = accountName;
    this._userFileList = [];
    this._userFolderList = [];
    this._userItemIdList = [];
    this._userTree = new Tree();
    this._activeWorkingFileId = "0";
    this._activeWorkingFolderId = "0";
    this._selectedUserItemIdList = [];
  }

  /** Accessors */
  public getUserProjectClone(): UserProject {
    let newUserProject = new UserProject(this._accountName);
    newUserProject._activeWorkingFileId = this._activeWorkingFileId;
    newUserProject._activeWorkingFolderId = this._activeWorkingFolderId;
    newUserProject._selectedUserItemIdList = [...this._selectedUserItemIdList];
    newUserProject._userItemIdList = [...this._userItemIdList];
    let len = this._userFileList.length;
    for (let i = 0; i < len; i++) {
      newUserProject._userFileList.push(this._userFileList[i].getFileClone());
    }

    len = this._userFolderList.length;
    for (let i = 0; i < len; i++) {
      newUserProject._userFolderList.push(
        this._userFolderList[i].getFolderClone()
      );
    }
    newUserProject._userTree = this._userTree.getTreeClone();
    return newUserProject;
  }
  public get accountName() {
    return this._accountName;
  }
  public get userTree() {
    return this._userTree;
  }
  public get activeWorkingFileId() {
    return this._activeWorkingFileId;
  }
  public get activeWorkingFolderId() {
    return this._activeWorkingFolderId;
  }
  public get selectedUserItemIdList() {
    return this._selectedUserItemIdList;
  }

  /***Instance methods */

  /**Private instance methods */

  private _getAllItemIdsFromFolder(folderNode: TreeNode): string[] {
    let folderItemIds: string[] = [];
    if (folderNode.children && folderNode.children.length > 0) {
      let len = folderNode.children.length;
      for (let i = 0; i < len; i++) {
        let childNode = folderNode.children[i];
        folderItemIds.push(childNode.id);
        if (childNode.children.length > 0) {
          folderItemIds.concat(this._getAllItemIdsFromFolder(childNode));
        }
      }
    }
    return folderItemIds;
  }
  private _findSelectedItemsToAdd(
    currentUserItemSelectedId: string,
    previousUserItemSelectedId: string,
    userItemsTreeNodes: TreeNode[],
    startAdding: boolean,
    stopAdding: boolean
  ): { selectedArr: string[]; start: boolean; stop: boolean } {
    if (stopAdding) {
      return {
        selectedArr: [],
        start: startAdding,
        stop: stopAdding,
      };
    }
    let selectedUserItemsToAdd: string[] = [];
    for (let i = 0; i < userItemsTreeNodes.length; i++) {
      if (stopAdding) {
        return {
          selectedArr: selectedUserItemsToAdd,
          start: startAdding,
          stop: stopAdding,
        };
      }
      if (startAdding) {
        if (
          userItemsTreeNodes[i].id === currentUserItemSelectedId ||
          userItemsTreeNodes[i].id === previousUserItemSelectedId
        ) {
          selectedUserItemsToAdd.push(userItemsTreeNodes[i].id);

          if (userItemsTreeNodes[i].children.length > 0) {
            let result = this._getAllItemIdsFromFolder(userItemsTreeNodes[i]);
            selectedUserItemsToAdd = selectedUserItemsToAdd.concat(result);
          }

          stopAdding = true;
          startAdding = false;
          return {
            selectedArr: selectedUserItemsToAdd,
            start: startAdding,
            stop: stopAdding,
          };
        }

        selectedUserItemsToAdd.push(userItemsTreeNodes[i].id);

        if (userItemsTreeNodes[i].children.length > 0) {
          let resultFromFind = this._findSelectedItemsToAdd(
            currentUserItemSelectedId,
            previousUserItemSelectedId,
            userItemsTreeNodes[i].children,
            startAdding,
            stopAdding
          );
          selectedUserItemsToAdd = selectedUserItemsToAdd.concat(
            resultFromFind.selectedArr
          );

          startAdding = resultFromFind.start;
          stopAdding = resultFromFind.stop;
        }
      } else {
        if (
          userItemsTreeNodes[i].id === currentUserItemSelectedId ||
          userItemsTreeNodes[i].id === previousUserItemSelectedId
        ) {
          startAdding = true;
          stopAdding = false;
          selectedUserItemsToAdd.push(userItemsTreeNodes[i].id);
        }

        if (userItemsTreeNodes[i].children.length > 0) {
          let resultFromFind = this._findSelectedItemsToAdd(
            currentUserItemSelectedId,
            previousUserItemSelectedId,
            userItemsTreeNodes[i].children,
            startAdding,
            stopAdding
          );
          selectedUserItemsToAdd = selectedUserItemsToAdd.concat(
            resultFromFind.selectedArr
          );

          startAdding = resultFromFind.start;
          stopAdding = resultFromFind.stop;
        }
      }
    }
    return {
      selectedArr: selectedUserItemsToAdd,
      start: startAdding,
      stop: stopAdding,
    };
  }
  private _sortUsertItems(userItemsTreeNodes: TreeNode[]): TreeNode[] {
    function sortArray(
      currentUserProject: UserProject,
      arr: TreeNode[]
    ): TreeNode[] {
      let sortedArray: TreeNode[] = [];
      let aux: TreeNode = {
        id: "0",
        parentId: "0",
        layer: 0,
        children: [],
      };
      const len = arr.length;
      if (len > 1) {
        for (let i = 0; i < len - 1; i++) {
          let min = arr[i];
          for (let j = i + 1; j < len; j++) {
            let arrJname = currentUserProject.getItemReferenceById(arr[j].id);
            let minName = currentUserProject.getItemReferenceById(arr[i].id);

            if (minName && arrJname) {
              if (arrJname.name < minName.name) {
                aux = getTreeNodeClone(aux, arr[j]);
                arr[j] = getTreeNodeClone(arr[j], min);
                min = getTreeNodeClone(min, aux);
              }
            }
          }
          sortedArray.push(min);
        }
      }
      sortedArray.push(arr[len - 1]);
      return sortedArray;
    }

    let sortedUserFilesTreeNodes: TreeNode[] = [];
    let auxUserFilesTreeNodes: TreeNode[] = [];
    let sortedUserFoldersTreeNodes: TreeNode[] = [];
    let auxUserFoldersTreeNodes: TreeNode[] = [];

    const len = userItemsTreeNodes.length;

    for (let i = 0; i < len; i++) {
      let userItem = this.getItemReferenceById(userItemsTreeNodes[i].id);

      if (userItem instanceof UserFolder) {
        auxUserFoldersTreeNodes.push(userItemsTreeNodes[i]);
        userItemsTreeNodes[i].children = this._sortUsertItems(
          userItemsTreeNodes[i].children
        );
      }

      if (userItem instanceof UserFile) {
        auxUserFilesTreeNodes.push(userItemsTreeNodes[i]);
      }
    }

    sortedUserFilesTreeNodes = sortArray(this, auxUserFilesTreeNodes);
    sortedUserFoldersTreeNodes = sortArray(this, auxUserFoldersTreeNodes);

    let sortedUserItemsTreeNodes: TreeNode[];

    if (sortedUserFilesTreeNodes[0] === undefined) {
      if (sortedUserFoldersTreeNodes[0] === undefined) {
        sortedUserItemsTreeNodes = [];
      } else {
        sortedUserItemsTreeNodes = sortedUserFoldersTreeNodes;
      }
    } else {
      if (sortedUserFoldersTreeNodes[0] === undefined) {
        sortedUserItemsTreeNodes = sortedUserFilesTreeNodes;
      } else {
        sortedUserItemsTreeNodes = sortedUserFoldersTreeNodes.concat(
          sortedUserFilesTreeNodes
        );
      }
    }
    return sortedUserItemsTreeNodes;
  }
  private _setVisibleItems(userItemsTreeNodes: TreeNode[], value: boolean) {
    const len = userItemsTreeNodes.length;

    for (let i = 0; i < len; i++) {
      let userItem = this.getItemReferenceById(userItemsTreeNodes[i].id, false);
      if (userItem) {
        userItem.isVisibleInFileExplorer = value;
        if (userItem instanceof UserFolder) {
          let childLen = userItemsTreeNodes[i].children.length;
          let isOpen = userItem.isOpenInFileExplorer;

          if (childLen > 0 && isOpen) {
            this._setVisibleItems(userItemsTreeNodes[i].children, value);
          }
          if (childLen > 0 && !isOpen) {
            this._setVisibleItems(userItemsTreeNodes[i].children, false);
          }
        }
      }
    }
  }
  private _removeSelectedItem(id: string) {
    const len = this.selectedUserItemIdList.length;
    for (let i = 0; i < len; i++) {
      if (this.selectedUserItemIdList[i] == id) {
        this.selectedUserItemIdList.splice(i, 1);
        break;
      }
    }

    if (this.selectedUserItemIdList.includes(id)) {
      this._removeSelectedItem(id);
    }
  }
  private _selectItemsFromAFolder(folderId: string, select: boolean = true) {
    let userItemNode = Tree.getNode(folderId, this._userTree);
    if (userItemNode) {
      let len = userItemNode.children.length;
      for (let i = 0; i < len; i++) {
        let childId = userItemNode.children[i].id;
        let userItem = this.getItemReferenceById(childId);

        if (select) {
          if (!this.selectedUserItemIdList.includes(childId)) {
            this.selectedUserItemIdList.push(childId);
            if (userItem instanceof UserFolder) {
              this._selectItemsFromAFolder(childId, true);
            }
          }
        } else {
          if (this.selectedUserItemIdList.includes(childId)) {
            this._removeSelectedItem(childId);
            if (userItem instanceof UserFolder) {
              this._selectItemsFromAFolder(childId, false);
            }
          }
        }
      }
    }
  }

  /** Public instance methods */
  public getItemReferenceById(
    id: string,
    getDeepCopy: boolean = true
  ): UserFile | UserFolder | false {
    const lenFileList = this._userFileList.length;
    const lenFolderList = this._userFolderList.length;

    for (let i = 0; i < lenFileList; i++) {
      if (this._userFileList[i].id === id) {
        if (getDeepCopy) {
          const file = this._userFileList[i];
          const fileId: number = parseInt(file.id.slice(0, -1));
          const newFile = new UserFile(
            fileId,
            file.name,
            file.fileFormat,
            file.iconColor,
            file.isVisibleInFileExplorer,
            file.isOpenInFileViewer
          );

          return newFile;
        } else {
          return this._userFileList[i];
        }
      }
    }

    for (let i = 0; i < lenFolderList; i++) {
      if (this._userFolderList[i].id === id) {
        if (getDeepCopy) {
          const folder = this._userFolderList[i];
          const folderId: number = parseInt(folder.id.slice(0, -1));
          const newFolder = new UserFolder(
            folderId,
            folder.name,
            folder.folderFormat,
            folder.iconColor,
            folder.isVisibleInFileExplorer,
            folder.isOpenInFileExplorer
          );

          return newFolder;
        } else {
          return this._userFolderList[i];
        }
      }
    }

    return false;
  }
  public countVisibleItems() {
    let count = 0;
    function iterateTreeNode(
      userItemsTreeNodes: TreeNode[],
      UserProject: UserProject
    ) {
      for (let i = 0; i < userItemsTreeNodes.length; i++) {
        let userItem = UserProject.getItemReferenceById(
          userItemsTreeNodes[i].id
        );
        if (userItem) {
          if (userItem.isVisibleInFileExplorer) count++;
          if (userItemsTreeNodes[i].children.length > 0) {
            iterateTreeNode(userItemsTreeNodes[i].children, UserProject);
          }
        }
      }
    }

    iterateTreeNode(this.userTree.root.children, this);

    return count;
  }

  /***Static methods */
  /**Private static methods */
  private static _handleSetUp(currentUserProject: UserProject): UserProject {
    return currentUserProject.getUserProjectClone();
  }
  private static _handleCleanUp(newUserProject: UserProject): UserProject {
    let userProjectClone = newUserProject.getUserProjectClone();

    userProjectClone._userTree.root.children = userProjectClone._sortUsertItems(
      userProjectClone._userTree.root.children
    );
    userProjectClone._setVisibleItems(
      userProjectClone._userTree.root.children,
      true
    );
    return userProjectClone;
  }

  /** Public static methods */
  public static handleCreateFile(
    currentUserProject: UserProject,
    options: MethodOptions
  ): UserProject {
    try {
      let newUserProject = UserProject._handleSetUp(currentUserProject);

      if (!options.fileFormat) {
        options.fileFormat = "app";
      }

      if (options.name && options.iconColor) {
        UserProject._idCount++;
        let newFile = new UserFile(
          UserProject._idCount,
          options.name,
          options.fileFormat,
          options.iconColor
        );

        let newUserTree = Tree.createNode(
          newFile.id,
          newUserProject._activeWorkingFolderId,
          newUserProject._userTree
        );
        newUserProject._userFileList.push(newFile);
        newUserProject._userItemIdList.push(newFile.id);
        newUserProject._activeWorkingFileId = newFile.id;
        newUserProject._selectedUserItemIdList = [];
        newUserProject._selectedUserItemIdList.push(newFile.id);
        if (newUserProject._activeWorkingFolderId !== "0") {
          const len = newUserProject._userFolderList.length;
          for (let i = 0; i < len; i++) {
            if (
              newUserProject._userFolderList[i].id ===
              newUserProject._activeWorkingFolderId
            ) {
              newUserProject._userFolderList[i].isOpenInFileExplorer = true;
            }
          }
        }

        if (newUserTree) {
          newUserProject._userTree = newUserTree;
        } else {
          throw new Error(
            "UserProject.handleCreateFile:: Error at creating a new node in the user tree"
          );
        }

        newUserProject = UserProject._handleCleanUp(newUserProject);

        return newUserProject;
      } else {
        throw new Error(
          "UserProject.handleCreateFile:: New name and / or new icon color and / or file format not defined"
        );
      }
    } catch (err) {
      console.error(err);
      return currentUserProject;
    }
  }
  public static handleCreateFolder(
    currentUserProject: UserProject,
    options: MethodOptions
  ): UserProject {
    try {
      let newUserProject = UserProject._handleSetUp(currentUserProject);
      if (options.name && options.iconColor) {
        UserProject._idCount++;
        let newFolder = new UserFolder(
          UserProject._idCount,
          options.name,
          "ClosedFolder",
          options.iconColor
        );

        let newUserTree = Tree.createNode(
          newFolder.id,
          newUserProject._activeWorkingFolderId,
          newUserProject._userTree
        );

        newUserProject._userFolderList.push(newFolder);
        newUserProject._userItemIdList.push(newFolder.id);
        newUserProject._activeWorkingFolderId = newFolder.id;
        newUserProject._selectedUserItemIdList = [];
        newUserProject._selectedUserItemIdList.push(newFolder.id);

        if (newUserTree) {
          newUserProject._userTree = newUserTree;
        } else {
          throw new Error(
            "UserProject.handleCreateFolder:: Error at creating a new node in the user tree"
          );
        }

        newUserProject = UserProject._handleCleanUp(newUserProject);
        return newUserProject;
      } else {
        throw new Error(
          "UserProject.handleCreateFolder:: New name and / or new icon color not defined"
        );
      }
    } catch (err) {
      console.error(err);
      return currentUserProject;
    }
  }
  public static handleUpload(
    currentUserProject: UserProject,
    options: MethodOptions
  ): UserProject {
    try {
      let newUserProject = UserProject._handleSetUp(currentUserProject);
      if (options.files) {
        const noFiles = options.files.length;
        for (let i = 0; i < noFiles; i++) {
          let fileName, format, fileFormat: fileFormat, iconColor;
          let nameParts = options.files[i].name.split(".");
          let len = nameParts.length;
          if (len > 2) {
            fileName = nameParts.slice(0, -1).join(".");
          } else {
            fileName = nameParts[0];
          }
          format = nameParts[len - 1];

          switch (true) {
            case ["doc"].includes(format): {
              iconColor = "#4B8CDB";
              fileFormat = ".doc";
              break;
            }
            case ["docx"].includes(format): {
              iconColor = "#4B8CDB";
              fileFormat = ".docx";
              break;
            }
            case ["pdf"].includes(format): {
              iconColor = "#E2574C";
              fileFormat = ".pdf";
              break;
            }
            case ["txt"].includes(format): {
              iconColor = "#9BC9FF";
              fileFormat = ".txt";
              break;
            }
            default: {
              iconColor = "#447EAB";
              fileFormat = "app";
              break;
            }
          }

          const lenFileList = newUserProject._userFileList.length;
          let isDuplicated = false;
          for (let i = 0; i < lenFileList; i++) {
            let fileStored = newUserProject._userFileList[i];

            if (
              fileStored.fileFormat === fileFormat &&
              fileStored.name === fileName
            ) {
              isDuplicated = true;
              break;
            }
          }
          if (!isDuplicated) {
            newUserProject = UserProject.handleCreateFile(newUserProject, {
              method: "handleCreateFile",
              name: fileName,
              iconColor: iconColor,
              fileFormat: fileFormat,
            });
          }
        }

        newUserProject = UserProject._handleCleanUp(newUserProject);
        return newUserProject;
      } else {
        throw new Error(
          "UserProject.handleUploadFile:: Upload file not defined"
        );
      }
    } catch (err) {
      console.error(err);
      return currentUserProject;
    }
  }
  public static handleDownload(
    currentUserProject: UserProject,
    options: MethodOptions
  ): UserProject {
    console.log("create file", options);
    return currentUserProject;
  }
  public static handleSelect(
    currentUserProject: UserProject,
    options: MethodOptions
  ): UserProject {
    try {
      let newUserProject = UserProject._handleSetUp(currentUserProject);

      if (options.id) {
        let userItem = newUserProject.getItemReferenceById(options.id, false);

        if (options.isCtrlPressed) {
          if (newUserProject.selectedUserItemIdList.includes(options.id)) {
            newUserProject._removeSelectedItem(options.id);

            if (userItem instanceof UserFolder) {
              newUserProject._selectItemsFromAFolder(options.id, false);
            }
          } else {
            newUserProject._selectedUserItemIdList.push(options.id);
            if (userItem instanceof UserFolder) {
              newUserProject._selectItemsFromAFolder(options.id, true);
            }
          }
        } else {
          if (options.isShiftPressed) {
            let previousUserItemSelectedId =
              newUserProject.selectedUserItemIdList[
                newUserProject.selectedUserItemIdList.length - 1
              ];
            let currentUserItemSelectedId = options.id;

            let rootNodes: TreeNode[];
            if (currentUserItemSelectedId !== previousUserItemSelectedId) {
              rootNodes = newUserProject.userTree.root.children;

              let selectedUserItemsToAdd: string[] =
                newUserProject._findSelectedItemsToAdd(
                  currentUserItemSelectedId,
                  previousUserItemSelectedId,
                  rootNodes,
                  false,
                  false
                ).selectedArr;

              for (let i = 0; i < selectedUserItemsToAdd.length; i++) {
                if (
                  newUserProject.selectedUserItemIdList.includes(
                    selectedUserItemsToAdd[i]
                  )
                ) {
                  continue;
                } else {
                  newUserProject._selectedUserItemIdList.push(
                    selectedUserItemsToAdd[i]
                  );
                }
              }
            }
          } else {
            newUserProject._selectedUserItemIdList = [];
            let userItemNode = Tree.getNode(
              options.id,
              newUserProject._userTree
            );

            if (userItemNode && userItem instanceof UserFile) {
              newUserProject._selectedUserItemIdList.push(options.id);
              userItem.isOpenInFileViewer = true;
              newUserProject._activeWorkingFileId = options.id;
              if (userItemNode.layer === 1) {
                newUserProject._activeWorkingFolderId = "0";
              }
              if (userItemNode.layer > 1) {
                newUserProject._activeWorkingFolderId = userItemNode.parentId;
              }
            }
            if (userItemNode && userItem instanceof UserFolder) {
              newUserProject._selectItemsFromAFolder(options.id);
              newUserProject._selectedUserItemIdList.push(options.id);
              userItem.isOpenInFileExplorer = !userItem.isOpenInFileExplorer;
              if (userItem.isOpenInFileExplorer)
                userItem.folderFormat = "OpenFolder";
              else userItem.folderFormat = "ClosedFolder";
              newUserProject._activeWorkingFolderId = options.id;
            }
          }
        }

        newUserProject = UserProject._handleCleanUp(newUserProject);

        return newUserProject;
      } else {
        throw new Error("UserProject.handleSelect:: Item id not defined");
      }
    } catch (err) {
      console.error(err);
      return currentUserProject;
    }
  }
  public static handleDeselect(
    currentUserProject: UserProject,
    options: MethodOptions
  ): UserProject {
    let newUserProject = UserProject._handleSetUp(currentUserProject);
    newUserProject._selectedUserItemIdList = [];
    newUserProject._activeWorkingFolderId = "0";
    newUserProject = UserProject._handleCleanUp(newUserProject);
    return newUserProject;
  }
  public static handleRename(
    currentUserProject: UserProject,
    options: MethodOptions
  ): UserProject {
    try {
      let newUserProject = UserProject._handleSetUp(currentUserProject);
      if (options.name && options.iconColor) {
        const selectedListLen = newUserProject.selectedUserItemIdList.length;
        if (selectedListLen > 0) {
          const itemId =
            newUserProject.selectedUserItemIdList[selectedListLen - 1];
          let itemToRename = newUserProject.getItemReferenceById(itemId);

          if (itemToRename) {
            itemToRename.name = options.name;
            itemToRename.iconColor = options.iconColor;
            if (itemToRename instanceof UserFile) {
              const fileListLen = newUserProject._userFileList.length;
              for (let i = 0; i < fileListLen; i++) {
                if (newUserProject._userFileList[i].id === itemId) {
                  newUserProject._userFileList[i] = itemToRename;
                }
              }
            } else {
              const folderListLen = newUserProject._userFolderList.length;
              for (let i = 0; i < folderListLen; i++) {
                if (newUserProject._userFolderList[i].id === itemId) {
                  newUserProject._userFolderList[i] = itemToRename;
                }
              }
            }
          }
        }
        newUserProject = UserProject._handleCleanUp(newUserProject);
        return newUserProject;
      } else {
        throw new Error(
          "UserProject.handleCreateFile:: Error at creating a new node in the user tree"
        );
      }
    } catch (err) {
      console.error(err);
      return currentUserProject;
    }

    return currentUserProject;
  }
  public static handleDelete(
    currentUserProject: UserProject,
    options: MethodOptions
  ): UserProject {
    try {
      let newUserProject = UserProject._handleSetUp(currentUserProject);

      let len = newUserProject.selectedUserItemIdList.length;

      let selectedFolderIds: string[] = [];
      let selectedFileIds: string[] = [];

      for (let i = 0; i < len; i++) {
        let userItemToDeleteId = newUserProject.selectedUserItemIdList[i];
        let userItem = newUserProject.getItemReferenceById(userItemToDeleteId);

        if (userItem instanceof UserFolder) {
          selectedFolderIds.push(userItemToDeleteId);
        }
        if (userItem instanceof UserFile) {
          selectedFileIds.push(userItemToDeleteId);
        }
      }

      let selectedItems = selectedFolderIds.concat(selectedFileIds);
      let removedItems: string[] = [];

      if (len > 0) {
        for (let i = 0; i < len; i++) {
          let itemToDeleteId = selectedItems[i];
          let userItemToDelete =
            newUserProject.getItemReferenceById(itemToDeleteId);
          if (removedItems.includes(itemToDeleteId)) {
            continue;
          }

          if (userItemToDelete instanceof UserFile) {
            newUserProject._activeWorkingFileId = "0";

            const lenFiles = newUserProject._userFileList.length;
            for (let i = 0; i < lenFiles; i++) {
              if (itemToDeleteId === newUserProject._userFileList[i].id) {
                newUserProject._userFileList.splice(i, 1);
                break;
              }
            }

            removedItems.push(itemToDeleteId);
          }

          if (userItemToDelete instanceof UserFolder) {
            newUserProject._activeWorkingFolderId = "0";

            const lenFolders = newUserProject._userFolderList.length;
            for (let i = 0; i < lenFolders; i++) {
              if (itemToDeleteId === newUserProject._userFolderList[i].id) {
                newUserProject._userFolderList.splice(i, 1);
                break;
              }
            }

            let userItemToDeleteNode = Tree.getNode(
              itemToDeleteId,
              newUserProject._userTree
            );
            if (userItemToDeleteNode) {
              removedItems = removedItems.concat(
                newUserProject._getAllItemIdsFromFolder(userItemToDeleteNode)
              );
            }
          }

          const lenItems = newUserProject._userItemIdList.length;
          for (let i = 0; i < lenItems; i++) {
            if (itemToDeleteId === newUserProject._userItemIdList[i]) {
              newUserProject._userItemIdList.splice(i, 1);
              break;
            }
          }

          let newTree = Tree.deleteNode(
            itemToDeleteId,
            newUserProject._userTree
          );
          if (newTree) {
            newUserProject._userTree = newTree;
          } else {
            throw new Error(
              "UserProject.handleDelete:: Error at deleting a node in the user tree"
            );
          }

          newUserProject._removeSelectedItem(itemToDeleteId);
        }
      }

      return newUserProject;
    } catch (err) {
      console.error(err);
      return currentUserProject;
    }
  }
  public static handleRefresh(
    currentUserProject: UserProject,
    options: MethodOptions
  ): UserProject {
    let newUserProject = UserProject._handleSetUp(currentUserProject);
    newUserProject = UserProject._handleCleanUp(newUserProject);
    return newUserProject;
  }
  public static handleCollapse(
    currentUserProject: UserProject,
    options: MethodOptions
  ): UserProject {
    let newUserProject = UserProject._handleSetUp(currentUserProject);

    const folderListLen = newUserProject._userFolderList.length;
    for (let i = 0; i < folderListLen; i++) {
      newUserProject._userFolderList[i].isOpenInFileExplorer = false;
    }

    newUserProject = UserProject._handleCleanUp(newUserProject);
    return newUserProject;
  }
  public static handleMove(
    currentUserProject: UserProject,
    options: MethodOptions
  ): UserProject {
    try {
      let newUserProject = UserProject._handleSetUp(currentUserProject);

      if (options.targetId === options.sourceId) return currentUserProject;

      if (options.targetId && options.sourceId) {
        let userItem = newUserProject.getItemReferenceById(options.targetId);
        let targetId = options.targetId;

        if (userItem instanceof UserFile) {
          let targetNode = Tree.getNode(
            options.targetId,
            newUserProject._userTree
          );
          if (targetNode) {
            targetId = targetNode.parentId;
          } else {
            throw new Error(
              "UserProject.handleMove:: Error at getting a node in the user tree"
            );
          }
        }

        let newTree = Tree.moveNode(
          options.sourceId,
          targetId,
          newUserProject._userTree
        );
        if (newTree) {
          newUserProject._userTree = newTree;
        } else {
          throw new Error(
            "UserProject.handleMove:: Error at moving a node in the user tree"
          );
        }
        newUserProject = UserProject._handleCleanUp(newUserProject);

        console.log("move4");
        return newUserProject;
      } else {
        throw new Error(
          "UserProject.handleMove:: Taget Id and / or Source Id not defined"
        );
      }
    } catch (err) {
      console.error(err);
      return currentUserProject;
    }
  }
  public static none(
    currentUserProject: UserProject,
    options: MethodOptions
  ): UserProject {
    try {
      let newUserProject = UserProject._handleSetUp(currentUserProject);

      if (options) {
        //Implementation
        newUserProject = UserProject._handleCleanUp(newUserProject);

        return newUserProject;
      } else {
        throw new Error("UserProject.handleNone:: Options not defined");
      }
    } catch (err) {
      console.error(err);
      return currentUserProject;
    }
  }
}

export default UserProject;

/**Utility types and functions */
export const MethodsSupportedList: MethodsSupported[] = [
  "handleCreateFile",
  "handleCreateFolder",
  "handleRename",
  "handleDelete",
  "handleUpload",
  "handleDownload",
  "handleDeselect",
  "handleSelect",
  "handleRefresh",
  "handleCollapse",
  "handleMove",
  "none",
];

export type ModifierMethodsSupported =
  | "handleCreateFile"
  | "handleCreateFolder"
  | "handleRename"
  | "handleDelete"
  | "none";
export type ExtraMethodsSupported =
  | "handleUpload"
  | "handleDownload"
  | "handleSelect"
  | "handleDeselect"
  | "handleRefresh"
  | "handleCollapse"
  | "handleMove";

export type MethodsSupported = ModifierMethodsSupported | ExtraMethodsSupported;

export function isAModifierMethod(
  value: MethodsSupported
): value is ModifierMethodsSupported {
  return [
    "handleCreateFile",
    "handleCreateFolder",
    "handleRename",
    "handleDelete",
    "none",
  ].includes(value);
}

export function isAnExtraMethod(
  value: MethodsSupported
): value is ExtraMethodsSupported {
  return [
    "handleUpload",
    "handleDownload",
    "handleSelect",
    "handleDeselect",
    "handleRefresh",
    "handleCollapse",
    "handleMove",
  ].includes(value);
}

export function castToMofierMethod(
  str: ModifierMethodsSupported
): ModifierMethodsSupported {
  return str;
}

export function castToMethodOptions(opt: MethodOptions): MethodOptions {
  return opt;
}
