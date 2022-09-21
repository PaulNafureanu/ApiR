import * as React from "react";
import MenuButton from "./menu/menuButton";
import commands from "./menu/menuCommands.json";
import "./../../css/menu.css";

interface MenuProps {}

const Menu: React.FunctionComponent<MenuProps> = () => {
  const [isClicked, setIsClicked] = React.useState(false);

  function handleClick() {
    if (isClicked) {
      setIsClicked(false);
    } else {
      setIsClicked(true);
    }
  }

  return (
    <div className="mainMenu noselect">
      <div className="left">
        <ul>
          <div className="logo">
            <img src="./logos/logo.svg"></img>
          </div>
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
          <li className="sideBarLeft"></li>
          <li className="sideBarCenter"></li>
          <li className="sideBarRight"></li>
        </ul>
      </div>
    </div>
  );
};

export default Menu;
