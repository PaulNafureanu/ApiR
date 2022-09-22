import * as React from "react";
import MenuButton from "./menu/menuButton";
import commands from "./menu/menuCommands.json";
import "./../../css/menu.css";

interface MenuProps {
  isLeftSidebarOpen: boolean;
  isRightSidebarOpen: boolean;
  handleOnClickSidebar: (sidebar: "left" | "right") => void;
}

const Menu: React.FunctionComponent<MenuProps> = ({
  isLeftSidebarOpen,
  isRightSidebarOpen,
  handleOnClickSidebar,
}) => {
  const [isClicked, setIsClicked] = React.useState(false);

  function handleClick() {
    if (isClicked) {
      setIsClicked(false);
    } else {
      setIsClicked(true);
    }
  }

  function returnSidebar(sideBar: "left" | "right", isOpen: boolean) {
    if (sideBar == "left") {
      if (isOpen) {
        return (
          <img
            src="./svgs/sidebarOpen.svg"
            onClick={() => handleOnClickSidebar("left")}
          />
        );
      } else {
        return (
          <img
            src="./svgs/sidebarClose.svg"
            onClick={() => handleOnClickSidebar("left")}
          />
        );
      }
    } else {
      if (isOpen) {
        return (
          <img
            src="./svgs/sidebarOpen.svg"
            onClick={() => handleOnClickSidebar("right")}
            style={{ transform: "scale(-1)" }}
          />
        );
      } else {
        return (
          <img
            src="./svgs/sidebarClose.svg"
            onClick={() => handleOnClickSidebar("right")}
            style={{ transform: "scale(-1)" }}
          />
        );
      }
    }
  }

  return (
    <div className="mainMenu noselect">
      <div className="left">
        <ul>
          <li onClick={handleClick}>
            <MenuButton
              name="File"
              isClicked={isClicked}
              commands={commands.file}
            />
          </li>
          <li onClick={handleClick}>
            <MenuButton
              name="Edit"
              isClicked={isClicked}
              commands={commands.edit}
            />
          </li>
          <li onClick={handleClick}>
            <MenuButton
              name="Go"
              isClicked={isClicked}
              commands={commands.go}
            />
          </li>
          <li onClick={handleClick}>
            <MenuButton
              name="Run"
              isClicked={isClicked}
              commands={commands.run}
            />
          </li>
          <li onClick={handleClick}>
            <MenuButton
              name="Help"
              isClicked={isClicked}
              commands={commands.help}
            />
          </li>
        </ul>
      </div>
      <div className="center">ApiRandomizer</div>
      <div className="right">
        <ul>
          <li className="sidebar">
            {returnSidebar("left", isLeftSidebarOpen)}
          </li>
          <li className="sidebar">
            {returnSidebar("right", isRightSidebarOpen)}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Menu;
