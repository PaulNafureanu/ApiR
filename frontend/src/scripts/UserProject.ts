import { Tree, TreeNode } from "./Tree";
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
  file?: File | undefined;
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

  /**Instance methods */
  /**Private instance methods */

  /** Public instance methods */
  public getItemReferenceById(id: string): UserFile | UserFolder | false {
    const lenFileList = this._userFileList.length;
    const lenFolderList = this._userFolderList.length;

    for (let i = 0; i < lenFileList; i++) {
      if (this._userFileList[i].id === id) {
        return structuredClone(this._userFileList[i]);
      }
    }

    for (let i = 0; i < lenFolderList; i++) {
      if (this._userFolderList[i].id === id) {
        return structuredClone(this._userFolderList[i]);
      }
    }

    return false;
  }

  /**Static methods */
  /**Private static methods */
  private static _getIdNumber(): number {
    UserProject._idCount++;
    return UserProject._idCount;
  }

  private static _handleSetUp(currentUserProject: UserProject): UserProject {
    return structuredClone(currentUserProject);
  }

  private static _handleCleanUp(newUserProject: UserProject): UserProject {
    return newUserProject;
  }

  /** Public static methods */
  public static handleCreateFile(
    currentUserProject: UserProject,
    options: MethodOptions
  ): UserProject {
    console.log("create file", options);
    return currentUserProject;
    // try {
    //   let newUserProject = UserProject._handleSetUp(currentUserProject);
    //   if (options.name && options.iconColor) {
    //     let newFile = new UserFile(
    //       UserProject._getIdNumber(),
    //       options.name,
    //       "app",
    //       options.iconColor
    //     );

    //     newUserProject._userFileList.push(newFile);
    //     newUserProject._userItemIdList.push(newFile.id);
    //     newUserProject._activeWorkingFileId = newFile.id;

    //     let newUserTree = Tree.createNode(
    //       newFile.id,
    //       newUserProject._activeWorkingFolderId,
    //       newUserProject._userTree
    //     );

    //     if (newUserTree) {
    //       newUserProject._userTree = newUserTree;
    //     } else {
    //       throw new Error(
    //         "UserProject.handleCreateFile:: Error at creating a new node in the user tree"
    //       );
    //     }

    //     newUserProject = UserProject._handleCleanUp(newUserProject);
    //     return newUserProject;
    //   } else {
    //     throw new Error(
    //       "UserProject.handleCreateFile:: New name and / or new icon color not defined"
    //     );
    //   }
    // } catch (err) {
    //   console.error(err);
    //   return currentUserProject;
    // }
  }

  public static handleCreateFolder(
    currentUserProject: UserProject,
    options: MethodOptions
  ): UserProject {
    console.log("create file", options);
    return currentUserProject;
  }
  public static handleUpload(
    currentUserProject: UserProject,
    options: MethodOptions
  ): UserProject {
    console.log("create file", options);
    return currentUserProject;
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
    console.log("create file", options);
    return currentUserProject;
  }
  public static handleDeselect(
    currentUserProject: UserProject,
    options: MethodOptions
  ): UserProject {
    console.log("create file", options);
    return currentUserProject;
  }
  public static handleRename(
    currentUserProject: UserProject,
    options: MethodOptions
  ): UserProject {
    console.log("create file", options);
    return currentUserProject;
  }
  public static handleDelete(
    currentUserProject: UserProject,
    options: MethodOptions
  ): UserProject {
    console.log("create file", options);
    return currentUserProject;
  }
  public static handleRefresh(
    currentUserProject: UserProject,
    options: MethodOptions
  ): UserProject {
    console.log("create file", options);
    return currentUserProject;
  }
  public static handleCollapse(
    currentUserProject: UserProject,
    options: MethodOptions
  ): UserProject {
    console.log("create file", options);
    return currentUserProject;
  }
  public static none(
    currentUserProject: UserProject,
    options: MethodOptions
  ): UserProject {
    console.log("create file", options);
    return currentUserProject;
  }
}

export default UserProject;

/**Utility types and functions */
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
  | "handleCollapse";

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
];
