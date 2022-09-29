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
    UserProject.MethodsSupported,
    React.Dispatch<React.SetStateAction<UserProject.MethodsSupported>>
  ] = React.useState(UserProject.castString("createFile"));
  const [userProjectRoot, setUserProjectRoot] = React.useState(
    new UserProject.UserProjectRoot("Leo")
  );

  const [newItemName, setNewItemName] = React.useState("");
  const [newItemColor, setNewItemColor] = React.useState("#000000");

  function handleOnClickSidebar(sidebar: "left" | "right") {
    if (sidebar == "left") {
      setIsLeftSidebarOpen(!isLeftSidebarOpen);
    } else {
      setIsRightSidebarOpen(!isRightSidebarOpen);
    }
  }

  function handleClickFolderExplorer(value: UserProject.MethodsSupported) {
    setCurrentOperation(value);
    let createValues = ["createFile", "createFolder", "rename", "delete"];
    if (createValues.includes(value)) {
      setIsCreateMenuOpen(value);
    } else {
      let newUserProjectRoot = UserProject.UserProjectRoot[value](
        userProjectRoot,
        newItemName,
        newItemColor
      );
      setUserProjectRoot(newUserProjectRoot);
    }
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
            handleClick={(value) => handleClickFolderExplorer(value)}
          />
        </div>
        <FileViewer />
        <RightSidebar
          customStyle={getCustomUserSpaceStyle().RightSidebarStyle}
        />
        <CreateMenu
          isCreateMenuOpen={isCreateMenuOpen}
          handleSubmit={() => {
            let newUserProjectRoot = UserProject.UserProjectRoot[
              currentOperation
            ](userProjectRoot, newItemName, newItemColor);
            setIsCreateMenuOpen("none");
            setUserProjectRoot(newUserProjectRoot);
          }}
          newItemName={newItemName}
          newItemColor={newItemColor}
          handleInputNameChange={(value) => setNewItemName(value)}
          handleInputColorChange={(value) => setNewItemColor(value)}
        />
      </div>
    </div>
  );
};

export default WorkSpace;
