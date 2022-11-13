export type fileFormat = ".doc" | ".docx" | ".pdf" | ".txt" | "app";
export type folderFormat = "OpenFolder" | "ClosedFolder";
export type itemType = "file" | "folder";

class UserItem {
  private _id: string;
  private _type: itemType;
  name: string;
  iconColor: string;
  isVisibleInFileExplorer: boolean;

  constructor(
    id: number,
    type: itemType,
    name: string,
    iconColor: string,
    isVisibleInFileExplorer: boolean
  ) {
    this._id = type === "file" ? id + "f" : id + "F";
    this.name = name;
    this._type = type;
    this.iconColor = iconColor;
    this.isVisibleInFileExplorer = isVisibleInFileExplorer;
  }

  /**Private methods */

  /** Public methods */
  public get id(): string {
    return this._id;
  }

  public get type(): itemType {
    return this._type;
  }
}

export class UserFile extends UserItem {
  fileFormat: fileFormat;
  isOpenInFileViewer: boolean;

  constructor(
    id: number,
    name: string,
    fileFormat: fileFormat,
    iconColor: string,
    isVisibleInFileExplorer: boolean = true,
    isOpenInFileViewer: boolean = true
  ) {
    super(id, "file", name, iconColor, isVisibleInFileExplorer);
    this.fileFormat = fileFormat;
    this.isOpenInFileViewer = isOpenInFileViewer;
  }

  public getFileClone(): UserFile {
    const fileId: number = parseInt(this.id.slice(0, -1));
    const newFile = new UserFile(
      fileId,
      this.name,
      this.fileFormat,
      this.iconColor,
      this.isVisibleInFileExplorer,
      this.isOpenInFileViewer
    );

    return newFile;
  }
}

export class UserFolder extends UserItem {
  folderFormat: folderFormat;
  isOpenInFileExplorer: boolean;

  constructor(
    id: number,
    name: string,
    folderFormat: folderFormat,
    iconColor: string,
    isVisibleInFileExplorer: boolean = true,
    isOpenInFileExplorer: boolean = false
  ) {
    super(id, "folder", name, iconColor, isVisibleInFileExplorer);
    this.folderFormat = folderFormat;
    this.isOpenInFileExplorer = isOpenInFileExplorer;
  }

  public getFolderClone(): UserFolder {
    const folderId: number = parseInt(this.id.slice(0, -1));
    const newFolder = new UserFolder(
      folderId,
      this.name,
      this.folderFormat,
      this.iconColor,
      this.isVisibleInFileExplorer,
      this.isOpenInFileExplorer
    );

    return newFolder;
  }
}
