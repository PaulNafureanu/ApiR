import * as React from "react";
import * as UserProject from "./userItems/projectClasses";
import UserItem from "./userItems/userItem";
import "./../../css/folderExplorer.css";
import "./../../css/utils.css";

interface FolderExplorerProps {
  customStyle: any;
  projectRoot: UserProject.ProjectRoot;
  handleClick: (value: string) => void;
}

const FolderExplorer: React.FunctionComponent<FolderExplorerProps> = ({
  customStyle,
  projectRoot,
  handleClick,
}) => {
  const [isMouseOverAccName, setIsMouseOverAccName] = React.useState(false);
  const [isMouseOverFolderExp, setIsMouseOverFolderExp] = React.useState(false);

  function FolderExplorerStyle() {
    let FolderExplorerStyle = { AccountNameStyle: {}, ButtonStyle: {} };
    if (isMouseOverFolderExp) {
      if (isMouseOverAccName) {
        FolderExplorerStyle.ButtonStyle = { display: "none" };
        FolderExplorerStyle.AccountNameStyle = { maxWidth: "20rem" };
      } else {
        FolderExplorerStyle.ButtonStyle = { display: "flex" };
        FolderExplorerStyle.AccountNameStyle = { maxWidth: "8rem" };
      }
    } else {
      FolderExplorerStyle.ButtonStyle = { display: "none" };
      FolderExplorerStyle.AccountNameStyle = { maxWidth: "20rem" };
    }

    return FolderExplorerStyle;
  }

  function getUserItems(): JSX.Element[] {
    let items: JSX.Element[] = [];

    for (let i = 0; i < projectRoot.children.length; i++) {
      items.push(
        <UserItem
          itemType={projectRoot.children[i].itemType}
          itemName={projectRoot.children[i].itemName}
          iconColor={projectRoot.children[i].itemColor}
          key={i}
        />
      );
    }

    return items;
  }

  return (
    <div
      className="folderExplorer"
      style={customStyle}
      onMouseOver={() => setIsMouseOverFolderExp(true)}
      onMouseOut={() => setIsMouseOverFolderExp(false)}
    >
      <div className="title noselect">
        <div
          className="accountName"
          onMouseOver={() => setIsMouseOverAccName(true)}
          onMouseOut={() => setIsMouseOverAccName(false)}
        >
          <div className="icon">
            <img src="./svgs/arrow.svg" alt="Drop down arrow"></img>
          </div>
          <p style={FolderExplorerStyle().AccountNameStyle}>
            {projectRoot.AccountName.toUpperCase()}
          </p>
        </div>
        <ul className="buttons" style={FolderExplorerStyle().ButtonStyle}>
          <li
            className="createFile"
            onClick={() => {
              handleClick("createFile");
            }}
          >
            <img src="./svgs/addFile.svg" alt="Create New File" />
          </li>
          <li
            className="createFolder"
            onClick={() => {
              handleClick("createFolder");
            }}
          >
            <img src="./svgs/addFolder.svg" alt="Create New Folder" />
          </li>
          <li
            className="uploadFile"
            onClick={() => {
              handleClick("uploadFile");
            }}
          >
            <img src="./svgs/uploadFile.svg" alt="Uplaod New File" />
          </li>
          <li
            className="uploadFolder"
            onClick={() => {
              handleClick("uploadFolder");
            }}
          >
            <img src="./svgs/uploadFolder.svg" alt="Upload New Folder" />
          </li>
          <li
            className="rename"
            onClick={() => {
              handleClick("rename");
            }}
          >
            <img src="./svgs/rename.svg" alt="Rename" />
          </li>
          <li
            className="refresh"
            onClick={() => {
              handleClick("refresh");
            }}
          >
            <img src="./svgs/refresh.svg" alt="Refresh Project" />
          </li>
          <li
            className="delete"
            onClick={() => {
              handleClick("delete");
            }}
          >
            <img src="./svgs/delete.svg" alt="Delete" />
          </li>
          <li
            className="collapseFolders"
            onClick={() => {
              handleClick("collapseFolders");
            }}
          >
            <img src="./svgs/collapseFolders.svg" alt="Collapse Folders" />
          </li>
        </ul>
      </div>
      <div className="files">
        <ul>{getUserItems()}</ul>
      </div>
    </div>
  );
};

export default FolderExplorer;
