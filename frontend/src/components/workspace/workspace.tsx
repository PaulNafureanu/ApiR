import * as React from "react";
import * as UserProject from "./projectClasses";
import Menu from "./menu";
import "./../../css/workspace.css";
import "./../../css/utils.css";
import ProjectMenu from "./projectMenu";
import FolderExplorer from "./folderExplorer";
import FileViewer from "./fileViewer";
import RightSidebar from "./rightSidebar";

interface WorkSpaceProps {}

const WorkSpace: React.FunctionComponent<WorkSpaceProps> = () => {
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = React.useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = React.useState(false);
  const [projectRoot, setProjectRoot] = React.useState(
    new UserProject.ProjectRoot("DEMO")
  );

  function handleOnClickSidebar(sidebar: "left" | "right") {
    if (sidebar == "left") {
      setIsLeftSidebarOpen(!isLeftSidebarOpen);
    } else {
      setIsRightSidebarOpen(!isRightSidebarOpen);
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
          />
        </div>
        <FileViewer />
        <RightSidebar
          customStyle={getCustomUserSpaceStyle().RightSidebarStyle}
        />
      </div>
    </div>
  );
};

export default WorkSpace;
