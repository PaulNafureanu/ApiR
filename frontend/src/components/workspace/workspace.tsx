import * as React from "react";
import UserProject from "../../namespaces/UserProject";
import Menu from "./menu";
import ProjectMenu from "./projectMenu";
import FolderExplorer from "./folderExplorer";
import FileViewer from "./fileViewer";
import RightSidebar from "./rightSidebar";
import CreateMenu from "./createMenu";
import "./../../css/workspace.css";
import "./../../css/utils.css";

interface WorkSpaceProps {}

const WorkSpace: React.FunctionComponent<WorkSpaceProps> = () => {
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = React.useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = React.useState(false);
  const [isCreateMenuOpen, setIsCreateMenuOpen] = React.useState("none");
  const [currentOperation, setCurrentOperation]: [
    UserProject.ModifierMethodsSupported,
    React.Dispatch<React.SetStateAction<UserProject.ModifierMethodsSupported>>
  ] = React.useState(UserProject.castToMofierMethod("createFile"));
  const [userProjectRoot, setUserProjectRoot] = React.useState(
    new UserProject.UserProjectRoot("Leo")
  );

  const [newItemName, setNewItemName] = React.useState("");
  const [newItemColor, setNewItemColor] = React.useState("#447EAB");

  function handleOnClickSidebar(sidebar: "left" | "right") {
    if (sidebar == "left") {
      setIsLeftSidebarOpen(!isLeftSidebarOpen);
    } else {
      setIsRightSidebarOpen(!isRightSidebarOpen);
    }
  }

  window.addEventListener("keydown", (e) => {
    if (e.key == "Escape") {
      handleCreateMenuExit();
    }
  });

  function handleCreateMenuExit() {
    setIsCreateMenuOpen("none");
  }

  function handleUserItemClick(
    itemId: number,
    isCtrlPressed: boolean,
    isShiftPressed: boolean
  ) {
    let newUserProjectRoot = UserProject.UserProjectRoot.handleUserItemClick(
      userProjectRoot,
      itemId,
      isCtrlPressed,
      isShiftPressed
    );
    setUserProjectRoot(newUserProjectRoot);
  }

  function handleUploadFile(file: File) {
    let newUserProjectRoot = UserProject.UserProjectRoot.handleUploadFile(
      userProjectRoot,
      file
    );
    setUserProjectRoot(newUserProjectRoot);
  }

  function handleDownloadFile() {
    console.log("download started from workspace");
  }

  function handleFolderExplorerButtonClick(
    button: UserProject.MethodsSupported
  ) {
    if (UserProject.isAModifierMethod(button)) {
      setCurrentOperation(button);
      setIsCreateMenuOpen(button);
    } else {
      let newUserProjectRoot =
        UserProject.UserProjectRoot[button](userProjectRoot);
      setUserProjectRoot(newUserProjectRoot);
    }
  }

  function handleFreeSpaceClick() {
    let newUserProjectRoot =
      UserProject.UserProjectRoot.handleFreeSpaceClick(userProjectRoot);
    setUserProjectRoot(newUserProjectRoot);
  }

  function getCustomUserSpaceStyle() {
    let CustomeUserSpaceStyle = {
      ProjectExplorerStyle: {},
      FolderExplorerStyle: {},
      RightSidebarStyle: {},
    };

    if (isLeftSidebarOpen) {
      CustomeUserSpaceStyle.ProjectExplorerStyle = { width: "24rem" };
      CustomeUserSpaceStyle.FolderExplorerStyle = { display: "block" };
    } else {
      CustomeUserSpaceStyle.ProjectExplorerStyle = { width: "3rem" };
      CustomeUserSpaceStyle.FolderExplorerStyle = { display: "none" };
    }

    if (isRightSidebarOpen) {
      CustomeUserSpaceStyle.RightSidebarStyle = { display: "block" };
    } else {
      CustomeUserSpaceStyle.RightSidebarStyle = { display: "none" };
    }

    return CustomeUserSpaceStyle;
  }

  return (
    <div id="Workspace">
      <Menu
        isLeftSidebarOpen={isLeftSidebarOpen}
        isRightSidebarOpen={isRightSidebarOpen}
        handleOnClickSidebar={(sidebar: "left" | "right") =>
          handleOnClickSidebar(sidebar)
        }
      />
      <div className="userSpace">
        <div
          className="projectExplorer"
          style={getCustomUserSpaceStyle().ProjectExplorerStyle}
        >
          <ProjectMenu />
          <FolderExplorer
            customStyle={getCustomUserSpaceStyle().FolderExplorerStyle}
            userProjectRoot={userProjectRoot}
            handleUserItemClick={handleUserItemClick}
            handleUploadFile={handleUploadFile}
            handleDownloadFile={handleDownloadFile}
            handleFolderExplorerButtonClick={handleFolderExplorerButtonClick}
            handleFreeSpaceClick={handleFreeSpaceClick}
          />
        </div>
        <FileViewer />
        <RightSidebar
          customStyle={getCustomUserSpaceStyle().RightSidebarStyle}
        />
        <CreateMenu
          isCreateMenuOpen={isCreateMenuOpen}
          handleCreateMenuClick={() => {
            let newUserProjectRoot = UserProject.UserProjectRoot[
              currentOperation
            ](userProjectRoot, newItemName, newItemColor);
            setIsCreateMenuOpen("none");
            setUserProjectRoot(newUserProjectRoot);
          }}
          newItemName={newItemName}
          newItemColor={newItemColor}
          handleCreateMenuExit={handleCreateMenuExit}
          handleInputNameChange={(value) => setNewItemName(value)}
          handleInputColorChange={(value) => setNewItemColor(value)}
        />
      </div>
    </div>
  );
};

export default WorkSpace;
