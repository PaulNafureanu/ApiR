import * as React from "react";
import UserProject, {
  MethodsSupported,
  MethodOptions,
} from "../../scripts/UserProject";
import { TreeNode } from "../../scripts/Tree";
import { UserFile } from "../../scripts/UserItem";
import UserItem from "./userItem";
import "./../../css/fileExplorer.css";
import "./../../css/utils.css";

interface FileExplorerProps {
  customStyle: any;
  userProject: UserProject;
  methodOptions: MethodOptions;
  handleFileExplorerButtonClick: (options: MethodOptions) => void;
}

const FileExplorer: React.FunctionComponent<FileExplorerProps> = ({
  customStyle,
  userProject,
  methodOptions,
  handleFileExplorerButtonClick,
}) => {
  type ImgAttr = {
    src: string;
    alt: string;
    onClick: (method: MethodsSupported) => void;
  };

  const [isMouseOverAccName, setIsMouseOverAccName] = React.useState(false);
  const [isMouseOverFolderExp, setIsMouseOverFolderExp] = React.useState(false);
  const inputFileRef = React.createRef<HTMLInputElement>();
  const MethodsListed: MethodsSupported[] = [
    "handleCreateFile",
    "handleCreateFolder",
    "handleRename",
    "handleDelete",
    "handleUpload",
    "handleDownload",
    "handleRefresh",
    "handleCollapse",
  ];

  function getFreeSpaceStyle() {
    let freeSpaceStyle;
    // let count = userProject.countVisibleItems();
    let count = 20;
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

  function getFileExplorerStyle() {
    let FileExplorerStyle = { AccountNameStyle: {}, ButtonStyle: {} };
    if (isMouseOverFolderExp) {
      if (isMouseOverAccName) {
        FileExplorerStyle.ButtonStyle = { display: "none" };
        FileExplorerStyle.AccountNameStyle = { maxWidth: "20rem" };
      } else {
        FileExplorerStyle.ButtonStyle = { display: "flex" };
        FileExplorerStyle.AccountNameStyle = { maxWidth: "8rem" };
      }
    } else {
      FileExplorerStyle.ButtonStyle = { display: "none" };
      FileExplorerStyle.AccountNameStyle = { maxWidth: "20rem" };
    }

    return FileExplorerStyle;
  }

  function getLIAttributes(method: MethodsSupported): ImgAttr {
    const onClickFunctionNoSelection = (opt: MethodsSupported) => {
      const optionCopy: MethodOptions = structuredClone(methodOptions);
      optionCopy.method = method;
      handleFileExplorerButtonClick(optionCopy);
    };
    const onClickFunctionSelectionRequired = (opt: MethodsSupported) => {
      if (userProject.selectedUserItemIdList.length) {
        const optionCopy: MethodOptions = structuredClone(methodOptions);
        optionCopy.method = method;
        handleFileExplorerButtonClick(optionCopy);
      }
    };

    switch (method) {
      case "handleCreateFile": {
        return {
          src: "./svgs/addFile.svg",
          alt: "Create New File",
          onClick: () => onClickFunctionNoSelection(method),
        };
      }
      case "handleCreateFolder": {
        return {
          src: "./svgs/addFolder.svg",
          alt: "Create New Folder",
          onClick: () => onClickFunctionNoSelection(method),
        };
      }
      case "handleRename": {
        return {
          src: "./svgs/rename.svg",
          alt: "Rename",
          onClick: () => onClickFunctionSelectionRequired(method),
        };
      }
      case "handleDelete": {
        return {
          src: "./svgs/delete.svg",
          alt: "Delete",
          onClick: () => onClickFunctionSelectionRequired(method),
        };
      }
      case "handleRefresh": {
        return {
          src: "./svgs/refresh.svg",
          alt: "Refresh Project",
          onClick: () => onClickFunctionNoSelection(method),
        };
      }
      case "handleCollapse": {
        return {
          src: "./svgs/collapseFolders.svg",
          alt: "Collapse Folders",
          onClick: () => onClickFunctionNoSelection(method),
        };
      }
      case "handleDownload": {
        return {
          src: "./svgs/download.svg",
          alt: "Download",
          onClick: () => onClickFunctionSelectionRequired(method),
        };
      }
      case "handleUpload": {
        return {
          src: "./svgs/uploadFile.svg",
          alt: "Uplaod New File",
          onClick: handleUploadFileClick,
        };
      }
      default: {
        return { src: "", alt: "", onClick: () => {} };
      }
    }
  }

  function getUserItems(userItemTreeNodes: TreeNode[]): JSX.Element[] {
    let JSXItems: JSX.Element[] = [];
    for (let i = 0; i < userItemTreeNodes.length; i++) {
      let userItem = userProject.getItemReferenceById(userItemTreeNodes[i].id);

      if (userItem) {
        let isItemSelected = userProject.selectedUserItemIdList.includes(
          userItemTreeNodes[i].id
        );

        let isItemActive =
          userProject.activeWorkingFileId === userItemTreeNodes[i].id;

        let isOpen, itemFormat;
        if (userItem instanceof UserFile) {
          isOpen = userItem.isOpenInFileViewer;
          itemFormat = userItem.fileFormat;
        } else {
          isOpen = userItem.isOpenInFileExplorer;
          itemFormat = userItem.folderFormat;
        }

        JSXItems.push(
          <UserItem
            itemId={userItem.id}
            isOpen={isOpen}
            isSelected={isItemSelected}
            isActive={isItemActive}
            itemType={userItem.type}
            itemFormat={itemFormat}
            itemName={userItem.name}
            iconColor={userItem.iconColor}
            layer={userItemTreeNodes[i].layer}
            handleSelect={(id, isCtrlPressed, isShiftPressed) => {
              const optionCopy: MethodOptions = structuredClone(methodOptions);
              optionCopy.method = "handleSelect";
              optionCopy.id = id;
              optionCopy.isCtrlPressed = isCtrlPressed;
              optionCopy.isShiftPressed = isShiftPressed;
              handleFileExplorerButtonClick(optionCopy);
            }}
            key={userItem.id}
          />
        );
        const len = userItemTreeNodes[i].children.length;

        if (len && isOpen) {
          let child = getUserItems(userItemTreeNodes[i].children);
          JSXItems = JSXItems.concat(child);
        }
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
        const optionCopy: MethodOptions = structuredClone(methodOptions);
        optionCopy.method = "handleUpload";
        optionCopy.file = files[i];
        handleFileExplorerButtonClick(optionCopy);
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
      const optionCopy: MethodOptions = structuredClone(methodOptions);
      optionCopy.method = "handleUpload";
      optionCopy.file = files[i];
      handleFileExplorerButtonClick(optionCopy);
    }

    e.preventDefault();
  }

  return (
    <div
      className="fileExplorer noselect"
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
          <p style={getFileExplorerStyle().AccountNameStyle}>
            {userProject.accountName.toUpperCase()}
          </p>
        </div>
        <ul className="buttons" style={getFileExplorerStyle().ButtonStyle}>
          {MethodsListed.map((method) => {
            return (
              <li
                className={method}
                key={method}
                onClick={() => getLIAttributes(method).onClick(method)}
              >
                {method === "handleUpload" && (
                  <input
                    ref={inputFileRef}
                    type={"file"}
                    multiple
                    className="inputFile"
                    accept=".doc, .docx, .txt, .pdf"
                  />
                )}
                <img
                  src={getLIAttributes(method).src}
                  alt={getLIAttributes(method).alt}
                />
              </li>
            );
          })}
        </ul>
      </div>
      <div className="files">
        <ul>{getUserItems(userProject.userTree.root.children)}</ul>
        <div
          className="freeSpace"
          onClick={() => {
            const optionCopy: MethodOptions = structuredClone(methodOptions);
            optionCopy.method = "handleDeselect";
            handleFileExplorerButtonClick(optionCopy);
          }}
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

export default FileExplorer;
