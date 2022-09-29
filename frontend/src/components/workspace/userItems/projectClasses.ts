class ProjectItem {
  static idCount: number = 0;
  id: number;
  itemName: string;
  layer: number;
  parent: ProjectItem | null;
  children: ProjectItem[];
  itemType:
    | "folder"
    | "openFolder"
    | "closedFolder"
    | "file"
    | "TextFile"
    | "PDFFile"
    | "WordFile"
    | "";
  iconPath: string;
  itemColor: string;
  constructor(
    children: ProjectItem[] = [],
    itemColor: string = "#000000",
    itemType:
      | "folder"
      | "openFolder"
      | "closedFolder"
      | "file"
      | "TextFile"
      | "PDFFile"
      | "WordFile"
      | "" = "",
    iconPath: string = ""
  ) {
    this.id = ProjectItem.idCount;
    ProjectItem.idCount++;
    this.itemName = "";
    this.layer = 0;
    this.parent = null;
    this.children = children;
    this.itemType = "";
    this.iconPath = iconPath;
    this.itemType = itemType;
    this.itemColor = itemColor;
    return this;
  }

  addChild(child: ProjectItem) {
    this.children.push(child);
    child.layer = this.layer + 1;
    child.parent = this;
    return this;
  }

  removeChild(child: ProjectItem) {
    let childIndex = this.children.indexOf(child);
    if (childIndex && childIndex > -1) {
      this.children.splice(childIndex, 1);
    }
    return this;
  }

  addChildren(children: ProjectItem[]) {
    this.children = this.children.concat(children);
    children.forEach((child) => {
      child.parent = this;
    });
    return this;
  }

  removeChildren(children: ProjectItem[]) {
    children.forEach((child) => {
      this.removeChild(child);
    });
    return this;
  }
}

class ProjectRoot extends ProjectItem {
  AccountName: string;
  selectedItems: ProjectItem[];
  constructor(
    AccountName: string = "DEMO",
    children: UserFolder[] | UserFile[] = [],
    selectedItems: ProjectItem[] = []
  ) {
    super(children);
    this.AccountName = AccountName;
    this.selectedItems = selectedItems;
  }

  callMethod(
    method: string,
    projectRoot: ProjectRoot,
    newItemName: string,
    newItemColor: string
  ): ProjectRoot {
    switch (method) {
      case "createFile": {
        let newProjectRoot = this.createFile(
          projectRoot,
          newItemName,
          newItemColor
        );
        return newProjectRoot;
      }
      case "createFolder": {
        let newProjectRoot = this.createFolder(
          projectRoot,
          newItemName,
          newItemColor
        );
        return newProjectRoot;
      }
      case "uploadFile": {
        this.uploadFile();
        break;
      }
      case "uploadFolder": {
        this.uploadFolder();
        break;
      }
      case "rename": {
        this.rename();
        break;
      }
      case "refresh": {
        this.refresh();
        break;
      }
      case "delete": {
        this.delete();
        break;
      }
      case "collapseFolders": {
        this.collapseFolders();
        break;
      }
      default: {
        console.log("This method doesn't exists!");
      }
    }
    return new ProjectRoot();
  }

  createFile(
    projectRoot: ProjectRoot,
    newItemName: string,
    newItemColor: string
  ): ProjectRoot {
    let newProjectRoot = new ProjectRoot("");
    Object.assign(newProjectRoot, projectRoot);
    newProjectRoot.addChild(new UserFile(newItemName, newItemColor));
    return newProjectRoot;
  }

  createFolder(
    projectRoot: ProjectRoot,
    newItemName: string,
    newItemColor: string
  ): ProjectRoot {
    let newProjectRoot = new ProjectRoot("");
    Object.assign(newProjectRoot, projectRoot);
    newProjectRoot.addChild(new UserFolder(newItemName, [], newItemColor));
    return newProjectRoot;
  }
  uploadFile() {
    console.log("File Uploaded");
  }
  uploadFolder() {
    console.log("Folder Uploaded");
  }
  rename() {
    console.log("Rename");
  }
  refresh() {
    console.log("Refresh");
  }
  delete() {
    console.log("Delete");
  }
  collapseFolders() {
    console.log("Collapse Folders");
  }
}

class UserFolder extends ProjectItem {
  isOpen: boolean;
  constructor(
    FolderName: string,
    children: ProjectItem[] = [],
    iconColor: string = "",
    itemType:
      | "folder"
      | "openFolder"
      | "closedFolder"
      | "file"
      | "TextFile"
      | "PDFFile"
      | "WordFile"
      | "" = "closedFolder",
    isOpen: boolean = false,
    iconPath: string = "./svgs/folderClosed.svg"
  ) {
    super(children, iconColor, itemType, iconPath);
    this.itemName = FolderName;
    this.isOpen = isOpen;
  }
}

class UserFile extends ProjectItem {
  isViewed: boolean;
  constructor(
    FileName: string,
    iconColor: string = "",
    itemType:
      | "folder"
      | "openFolder"
      | "closedFolder"
      | "file"
      | "TextFile"
      | "PDFFile"
      | "WordFile"
      | "" = "file",
    isViewed: boolean = true,
    iconPath: string = "./svgs/file.svg"
  ) {
    super(undefined, iconColor, itemType, iconPath);
    this.itemName = FileName;
    this.isViewed = isViewed;
  }
}

export { ProjectItem, ProjectRoot, UserFolder, UserFile };
