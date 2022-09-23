class ProjectItem{
    static idCount: number = 0;
    id: number;
    itemName: string;
    layer: number;
    parent: ProjectItem | null;
    children: ProjectItem[];
    itemType: "folder" | "file" | "";
    iconPath: string;
    constructor(children: ProjectItem[] = [], iconPath:string = "") {
        this.id = ProjectItem.idCount;
        ProjectItem.idCount++;
        this.itemName = "";
        this.layer = 0;
        this.parent = null;
        this.children = children;
        this.itemType = "";
        this.iconPath = iconPath;
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
        if (childIndex && childIndex >-1) {
            this.children.splice(childIndex, 1);
        }
        return this;
    }

    addChildren(children: ProjectItem[]) {
        this.children = this.children.concat(children);
        children.forEach((child) => { child.parent = this });
        return this;
    }

    removeChildren(children: ProjectItem[]) {
        children.forEach((child) => { this.removeChild(child) });
        return this;
    }
}

class ProjectRoot extends ProjectItem {
    AccountName: string;
    selectedItems: ProjectItem[];
    constructor(AccountName: string = "DEMO", children: UserFolder[] | UserFile[] = [], selectedItems: ProjectItem[] = []) {
        super(children);
        this.AccountName = AccountName;
        this.selectedItems = selectedItems;
    }

    createFile(file: UserFile, setProjectRoot: (projectRoot: ProjectRoot) => void) {
        this.addChild(file);
        setProjectRoot(this);
    }
}

class UserFolder extends ProjectItem{
    isOpen: boolean;
    constructor(FolderName: string, children: ProjectItem[] = [], iconPath: string = "", isOpen:boolean = false) {
        super(children, iconPath);
        this.itemType = "folder";
        this.itemName = FolderName;
        this.isOpen = isOpen;
    }
}

class UserFile extends ProjectItem{
    isViewed: boolean;
    constructor(FileName: string, iconPath: string = "", isViewed: boolean = true) {
        super(undefined, iconPath);
        this.itemType = "file";
        this.itemName = FileName;
        this.isViewed = isViewed;
    }
}

export {ProjectItem, ProjectRoot, UserFolder, UserFile};