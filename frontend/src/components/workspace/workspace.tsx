import * as React from "react";
import Menu from "./menu";
import "./../../css/workspace.css";
import "./../../css/utils.css";
import ProjectMenu from "./projectMenu";
import FolderExplorer from "./folderExplorer";
import FileViewer from "./fileViewer";

interface WorkSpaceProps {}

const WorkSpace: React.FunctionComponent<WorkSpaceProps> = () => {
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = React.useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = React.useState(false);

  function handleOnClickSidebar(sidebar: "left" | "right") {
    if (sidebar == "left") {
      setIsLeftSidebarOpen(!isLeftSidebarOpen);
    } else {
      setIsRightSidebarOpen(!isRightSidebarOpen);
    }
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
        <div className="projectExplorer">
          <ProjectMenu />
          <FolderExplorer />
        </div>
        <FileViewer />
      </div>
    </div>
  );
};

export default WorkSpace;
