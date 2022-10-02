import * as React from "react";
import UserProject from "../../namespaces/UserProject";
import UserItem from "./userItem";
import "./../../css/folderExplorer.css";
import "./../../css/utils.css";

interface FolderExplorerProps {
  customStyle: any;
  userProjectRoot: UserProject.UserProjectRoot;
  handleUserItemClick: (
    id: number,
    isCtrlPressed: boolean,
    isShiftPressed: boolean
  ) => void;
  handleUploadFile: (file: File) => void;
  handleDownloadFile: () => void;
  handleFolderExplorerButtonClick: (
    button: UserProject.MethodsSupported
  ) => void;
  handleFreeSpaceClick: () => void;
}

const FolderExplorer: React.FunctionComponent<FolderExplorerProps> = ({
  customStyle,
  userProjectRoot,
  handleUserItemClick,
  handleUploadFile,
  handleDownloadFile,
  handleFolderExplorerButtonClick,
  handleFreeSpaceClick,
}) => {
  const [isMouseOverAccName, setIsMouseOverAccName] = React.useState(false);
  const [isMouseOverFolderExp, setIsMouseOverFolderExp] = React.useState(false);
  const inputFileRef = React.createRef<HTMLInputElement>();

  function getFreeSpaceStyle() {
    let freeSpaceStyle;
    let count = userProjectRoot.countVisibleItems();
    freeSpaceStyle = {
      height: `calc(99% - ${1.5 * count}rem)`,
      borderBottom: "3px dotted rgba(255,255,255,0.05)",
      borderLeft: "3px dotted rgba(255,255,255,0.05)",
      borderRight: "3px dotted rgba(255,255,255,0.05)",
      borderBottomLeftRadius: "1rem",
      borderBottomRightRadius: "1rem",
      color: "rgba(255,255,255,0.05)",
    };

    return freeSpaceStyle;
  }

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
        UserProject.UserItem.activeFileId == userItemTreeNodes[i].id;

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
          key={userItem.id}
        />
      );

      if (userItemTreeNodes[i].children.length > 0 && userItem.isOpen) {
        let child = getUserItems(userItemTreeNodes[i].children);
        JSXItems = JSXItems.concat(child);
      }
    }
    return JSXItems;
  }

  function handleUploadFileClick() {
    let inputElement: HTMLInputElement;
    if (inputFileRef.current != null) inputElement = inputFileRef.current;
    else return;

    inputElement.click();
    inputElement.addEventListener("change", () => {
      let files: FileList;
      if (inputElement.files != null) files = inputElement.files;
      else {
        return;
      }
      for (let i = 0; i < files.length; i++) {
        handleUploadFile(files[i]);
      }
    });
  }

  function handleUploadFileDrop(e: React.DragEvent<HTMLDivElement>) {
    let inputElement: HTMLInputElement;
    if (inputFileRef.current != null) inputElement = inputFileRef.current;
    else return;

    inputElement.files = e.dataTransfer.files;

    let files: FileList;
    if (inputElement.files != null) files = inputElement.files;
    else {
      return;
    }
    for (let i = 0; i < files.length; i++) {
      handleUploadFile(files[i]);
    }

    e.preventDefault();
  }

  return (
    <div
      className="folderExplorer noselect"
      style={customStyle}
      onMouseOver={() => setIsMouseOverFolderExp(true)}
      onMouseOut={() => setIsMouseOverFolderExp(false)}
    >
      <div className="title">
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
              handleFolderExplorerButtonClick("createFile");
            }}
          >
            <img src="./svgs/addFile.svg" alt="Create New File" />
          </li>
          <li
            className="createFolder"
            onClick={() => {
              handleFolderExplorerButtonClick("createFolder");
            }}
          >
            <img src="./svgs/addFolder.svg" alt="Create New Folder" />
          </li>
          <li className="uploadFile" onClick={handleUploadFileClick}>
            <input
              ref={inputFileRef}
              type={"file"}
              multiple
              className="inputFile"
              accept=".doc, .docx, .txt, .pdf"
            />
            <img src="./svgs/uploadFile.svg" alt="Uplaod New File" />
          </li>
          <li
            className="download"
            onClick={() => {
              if (UserProject.UserItem.SelectedUserItemIdList)
                handleDownloadFile();
            }}
          >
            <img src="./svgs/download.svg" alt="Download" />
          </li>
          <li
            className="rename"
            onClick={() => {
              if (UserProject.UserItem.SelectedUserItemIdList) {
                handleFolderExplorerButtonClick("rename");
              }
            }}
          >
            <img src="./svgs/rename.svg" alt="Rename" />
          </li>
          <li
            className="refresh"
            onClick={() => {
              handleFolderExplorerButtonClick("refresh");
            }}
          >
            <img src="./svgs/refresh.svg" alt="Refresh Project" />
          </li>
          <li
            className="delete"
            onClick={() => {
              if (UserProject.UserItem.SelectedUserItemIdList)
                handleFolderExplorerButtonClick("delete");
            }}
          >
            <img src="./svgs/delete.svg" alt="Delete" />
          </li>
          <li
            className="collapseFolders"
            onClick={() => {
              handleFolderExplorerButtonClick("collapse");
            }}
          >
            <img src="./svgs/collapseFolders.svg" alt="Collapse Folders" />
          </li>
        </ul>
      </div>
      <div className="files">
        <ul>{getUserItems(userProjectRoot.userItemsTree.root)}</ul>
        <div
          className="freeSpace"
          onClick={handleFreeSpaceClick}
          style={getFreeSpaceStyle()}
          onDrop={handleUploadFileDrop}
          onDragOver={(e) => {
            e.preventDefault();
          }}
          onDragEnter={(e) => {
            e.preventDefault();
          }}
        >
          <p className="dropFiles">Drop Files Here</p>
        </div>
      </div>
    </div>
  );
};

export default FolderExplorer;
