import * as React from "react";
import "./../../../css/menuButton.css";
interface MenuButtonProps {
  name: string;
  isClicked: boolean;
  commands: any;
}

const MenuButton: React.FunctionComponent<MenuButtonProps> = ({
  name,
  isClicked,
  commands,
}) => {
  const [isMouseOver, setIsMouseOver] = React.useState(false);

  function returnMenuPanel(isClicked: boolean) {
    if (isClicked && isMouseOver) {
      let panelStyle = {
        height: `${2.5 * commands.count}rem`,
      };

      let HTMLCommands: Array<JSX.Element> = [];

      for (let i = 1; i <= commands.count; i++) {
        HTMLCommands.push(
          <div className="command" key={i}>
            <div className="name">{commands.commands[i].name}</div>
            <div className="shortcut">{commands.commands[i].shortcut}</div>
          </div>
        );
      }

      return (
        <div className="menuPanel" style={panelStyle}>
          {HTMLCommands}
        </div>
      );
    }
  }
  return (
    <div className="menuButton">
      <div
        className="button"
        onMouseOver={() => setIsMouseOver(true)}
        onMouseOut={() => setIsMouseOver(false)}
      >
        <p>{name}</p>
      </div>
      {returnMenuPanel(isClicked)}
    </div>
  );
};

export default MenuButton;
