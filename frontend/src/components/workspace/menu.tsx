import * as React from "react";
import MenuButton from "./menu/menuButton";
import menuCommands from "./menu/menuCommands";
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
  const menus: ["File", "Edit", "Go", "Run", "Help"] = [
    "File",
    "Edit",
    "Go",
    "Run",
    "Help",
  ];
  const [activePanel, setActivePanel] = React.useState("none");

  function handleClick(panel: string) {
    if (activePanel == "none") {
      setActivePanel(panel);
    } else {
      setActivePanel("none");
    }
  }

  function returnSidebar(sideBar: "left" | "right", isOpen: boolean) {
    if (sideBar == "left") {
      if (isOpen) {
        return <img src="./svgs/sidebarOpen.svg" />;
      } else {
        return <img src="./svgs/sidebarClose.svg" />;
      }
    } else {
      if (isOpen) {
        return (
          <img
            src="./svgs/sidebarOpen.svg"
            style={{ transform: "scale(-1)" }}
          />
        );
      } else {
        return (
          <img
            src="./svgs/sidebarClose.svg"
            style={{ transform: "scale(-1)" }}
          />
        );
      }
    }
  }

  function getMenus(): JSX.Element[] {
    let menuElements: JSX.Element[] = [];

    for (let i = 0; i < menus.length; i++) {
      menuElements.push(
        <li onClick={() => handleClick(menus[i])} key={menus[i]}>
          <MenuButton
            name={menus[i]}
            activePanel={activePanel}
            commands={menuCommands[menus[i]]}
            key={menus[i]}
            setActivePanel={setActivePanel}
          />
        </li>
      );
    }

    return menuElements;
  }

  return (
    <div className="mainMenu noselect">
      <div className="left">
        <ul>{getMenus()}</ul>
      </div>
      <div className="center">ApiRandomizer</div>
      <div className="right">
        <ul>
          <li className="sidebar" onClick={() => handleOnClickSidebar("left")}>
            {returnSidebar("left", isLeftSidebarOpen)}
          </li>
          <li className="sidebar" onClick={() => handleOnClickSidebar("right")}>
            {returnSidebar("right", isRightSidebarOpen)}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Menu;
