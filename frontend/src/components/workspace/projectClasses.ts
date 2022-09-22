class ProjectItem{
    static idCount: number = 0;
    id: number;
    parent: ProjectItem | null;
    children: ProjectItem[];
    iconPath: string;
    constructor(children: ProjectItem[] = [], iconPath:string = "") {
        this.id = ProjectItem.idCount;
        ProjectItem.idCount++;
        this.parent = null;
        this.children = children;
        this.iconPath = iconPath;
        return this;
    }

    addChild(child: ProjectItem) {
        this.children.push(child);
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
    constructor(AccountName: string = "DEMO", children: ProjectItem[] = [], selectedItems: ProjectItem[] = []) {
        super(children);
        this.AccountName = AccountName;
        this.selectedItems = selectedItems;
    }
}

class UserFolder extends ProjectItem{
    FolderName: string;
    constructor(FolderName: string, children: ProjectItem[] = [], iconPath: string = "") {
        super(children, iconPath);
        this.FolderName = FolderName;
    }
}

class UserFile extends ProjectItem{
    FileName: string;
    constructor(FileName: string, iconPath: string = "") {
        super(undefined, iconPath);
        this.FileName = FileName;
    }
}

export {ProjectItem, ProjectRoot, UserFolder, UserFile};