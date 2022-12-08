import * as React from "react";
import UserProject, {
  castToMethodOptions,
  castToMofierMethod,
  isAModifierMethod,
  MethodOptions,
  MethodsSupported,
  ModifierMethodsSupported,
} from "../../scripts/UserProject";
import Menu from "./menu";
import ProjectMenu from "./projectMenu";
import FileExplorer from "./fileExplorer";
import FileViewer from "./fileViewer";
import RightSidebar from "./rightSidebar";
import CreateMenu from "./createMenu";
import "./../../css/workspace.css";
import "./../../css/utils.css";
import structuredClone from "@ungap/structured-clone";
import { AppState } from "./../../App";

interface WorkSpaceProps {}

const WorkSpace: React.FunctionComponent<WorkSpaceProps> = () => {
  /**States */
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = React.useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = React.useState(false);
  const [userProject, setUserProject] = React.useState(new UserProject("Leo"));

  const [methodOptions, setMethodOptions]: [
    MethodOptions,
    React.Dispatch<React.SetStateAction<MethodOptions>>
  ] = React.useState(
    castToMethodOptions({
      method: "none",
      name: "",
      iconColor: "#447EAB",
      id: "",
      isCtrlPressed: false,
      isShiftPressed: false,
      files: undefined,
      fileFormat: "app",
      targetId: "",
      sourceId: "",
    })
  );

  /**Listeners */
  window.addEventListener("keydown", (e) => {
    if (e.key == "Escape") {
      const optionCopy: MethodOptions = structuredClone(methodOptions);
      optionCopy.method = "none";
      setMethodOptions(optionCopy);
    }
  });

  /**Handlers */
  function handleOnClickSidebar(sidebar: "left" | "right") {
    if (sidebar == "left") {
      setIsLeftSidebarOpen(!isLeftSidebarOpen);
    } else {
      setIsRightSidebarOpen(!isRightSidebarOpen);
    }
  }
  function handleFileExplorerButtonClick(options: MethodOptions) {
    if (!isAModifierMethod(options.method)) {
      const newUserProject = UserProject[options.method](userProject, options);
      if (newUserProject) {
        setUserProject(newUserProject);
      }
    }
    setMethodOptions(options);
  }
  /**Renders */
  function getCustomUserSpaceStyle() {
    let CustomeUserSpaceStyle = {
      ProjectExplorerStyle: {},
      FileExplorerStyle: {},
      RightSidebarStyle: {},
    };

    if (isLeftSidebarOpen) {
      CustomeUserSpaceStyle.ProjectExplorerStyle = { width: "24rem" };
      CustomeUserSpaceStyle.FileExplorerStyle = { display: "block" };
    } else {
      CustomeUserSpaceStyle.ProjectExplorerStyle = { width: "3rem" };
      CustomeUserSpaceStyle.FileExplorerStyle = { display: "none" };
    }

    if (isRightSidebarOpen) {
      CustomeUserSpaceStyle.RightSidebarStyle = { display: "block" };
    } else {
      CustomeUserSpaceStyle.RightSidebarStyle = { display: "none" };
    }

    return CustomeUserSpaceStyle;
  }
  function renderCreateMenu() {
    if (!isAModifierMethod(methodOptions.method)) return;
    return (
      <CreateMenu
        createMenuState={methodOptions.method}
        handleCreateMenuClick={() => {
          let newUserProject = UserProject[methodOptions.method](
            userProject,
            methodOptions
          );
          const optionCopy: MethodOptions = structuredClone(methodOptions);
          optionCopy.method = "none";
          setMethodOptions(optionCopy);
          if (newUserProject) setUserProject(newUserProject);
        }}
        newItemName={methodOptions.name}
        newItemColor={methodOptions.iconColor}
        handleCreateMenuExit={() => {
          const optionCopy: MethodOptions = structuredClone(methodOptions);
          optionCopy.method = "none";
          setMethodOptions(optionCopy);
        }}
        handleInputNameChange={(value) => {
          const optionCopy: MethodOptions = structuredClone(methodOptions);
          optionCopy.name = value;
          setMethodOptions(optionCopy);
        }}
        handleInputColorChange={(value) => {
          const optionCopy: MethodOptions = structuredClone(methodOptions);
          optionCopy.iconColor = value;
          setMethodOptions(optionCopy);
        }}
      />
    );
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
          <FileExplorer
            customStyle={getCustomUserSpaceStyle().FileExplorerStyle}
            userProject={userProject}
            methodOptions={methodOptions}
            handleFileExplorerButtonClick={handleFileExplorerButtonClick}
          />
        </div>
        <FileViewer userProject={userProject} />
        <RightSidebar
          customStyle={getCustomUserSpaceStyle().RightSidebarStyle}
        />
        {renderCreateMenu()}
      </div>
    </div>
  );
};

export default WorkSpace;
