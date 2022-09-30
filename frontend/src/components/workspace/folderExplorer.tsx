import * as React from "react";
import UserProject from "../../namespaces/UserProject";
import UserItem from "./userItem";
import "./../../css/folderExplorer.css";
import "./../../css/utils.css";

interface FolderExplorerProps {
  customStyle: any;
  userProjectRoot: UserProject.UserProjectRoot;
  handleClick: (value: UserProject.MethodsSupported) => void;
  handleUserItemClick: (id: number) => void;
}

const FolderExplorer: React.FunctionComponent<FolderExplorerProps> = ({
  customStyle,
  userProjectRoot,
  handleClick,
  handleUserItemClick,
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

  function getUserItems(
    userItemTreeNodes: UserProject.TreeNode[]
  ): JSX.Element[] {
    let JSXItems: JSX.Element[] = [];
    for (let i = 0; i < userItemTreeNodes.length; i++) {
      let userItem = UserProject.UserItem.getItemReferenceById(
        userItemTreeNodes[i].id
      );

      let isItemSelected = UserProject.UserItem.SelectedUserItemIdList.includes(
        userItemTreeNodes[i].id
      );

      let isItemActive =
        UserProject.UserItem.activeItemId == userItemTreeNodes[i].id;

      JSXItems.push(
        <UserItem
          itemId={userItem.id}
          isOpen={userItem.isOpen}
          isSelected={isItemSelected}
          isActive={isItemActive}
          itemType={userItem.itemType}
          itemName={userItem.itemName}
          iconColor={userItem.iconColor}
          layer={userItemTreeNodes[i].layer}
          handleUserItemClick={handleUserItemClick}
          key={i}
        />
      );

      if (userItemTreeNodes[i].children.length > 0) {
        JSXItems.concat(getUserItems(userItemTreeNodes[i].children));
      }
    }
    return JSXItems;
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
            {userProjectRoot.accountName.toUpperCase()}
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
        <ul>{getUserItems(userProjectRoot.userItemsTree.root)}</ul>
      </div>
    </div>
  );
};

export default FolderExplorer;
