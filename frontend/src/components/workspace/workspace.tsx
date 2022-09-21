import * as React from "react";
import Menu from "./menu";
import "./../../css/workspace.css";
import "./../../css/utils.css";
import ProjectMenu from "./projectMenu";
import FolderExplorer from "./folderExplorer";
import FileViewer from "./fileViewer";

interface WorkSpaceProps {}

const WorkSpace: React.FunctionComponent<WorkSpaceProps> = () => {
  return (
    <div id="Workspace">
      <Menu />
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
