import { Tree } from "./Tree";
import { UserFile, UserFolder } from "./UserItem";

class UserProject {
  private static idCount: number = 0;
  private _accountName: string;
  private _userFileList: UserFile[];
  private _userFolderList: UserFolder[];
  private _userItemIdList: string[];
  private _userItemsTree: Tree;

  private _activeWorkingFileId: string;
  private _activeWorkingFolderId: string;

  constructor(accountName: string) {
    this._accountName = accountName;
    this._userFileList = [];
    this._userFolderList = [];
    this._userItemIdList = [];
    this._userItemsTree = new Tree();
    this._activeWorkingFileId = "0";
    this._activeWorkingFolderId = "0";
  }

  /**Private methods */

  /** Public methods */
  public get activeWorkingFileId() {
    return this._activeWorkingFileId;
  }
  public get activeWorkingFolderId() {
    return this._activeWorkingFolderId;
  }
}

export default UserProject;
