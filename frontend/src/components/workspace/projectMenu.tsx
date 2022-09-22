import * as React from "react";
import "./../../css/projectMenu.css";
interface ProjectMenuProps {}

const ProjectMenu: React.FunctionComponent<ProjectMenuProps> = () => {
  return (
    <div className="projectMenu">
      <ul className="up">
        <li className="docsIcon active">
          <img src="./svgs/documents.svg" alt="Documents Menu" />
        </li>{" "}
      </ul>
      <ul className="down">
        <li className="not-active">
          <img src="./svgs/userSolid.svg" alt="Account Menu" />
        </li>
        <li className="not-active">
          <img src="./svgs/gear.svg" alt="Settings Menu" />
        </li>
      </ul>
    </div>
  );
};

export default ProjectMenu;
