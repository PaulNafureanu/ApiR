import * as React from "react";
import "./../../../css/menuButton.css";
interface MenuButtonProps {
  name: string;
  commands: any;
  activePanel: string;
  setActivePanel: (panel: string) => void;
}

const MenuButton: React.FunctionComponent<MenuButtonProps> = ({
  name,
  commands,
  activePanel,
  setActivePanel,
}) => {
  function returnMenuPanel() {
    if (activePanel == name) {
      let panelStyle = {
        height: `${2.5 * commands.count}rem`,
      };

      let HTMLCommands: Array<JSX.Element> = [];

      for (let i = 1; i <= commands.count; i++) {
        let commandStyle;
        if (commands.separators.includes(i))
          commandStyle = { borderBottom: "1px solid #555" };
        else {
          commandStyle = { borderBottom: "none" };
        }
        HTMLCommands.push(
          <div className="command" key={i} style={commandStyle}>
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
        onMouseOver={() => {
          if (activePanel != "none") setActivePanel(name);
        }}
      >
        <p>{name}</p>
      </div>
      {returnMenuPanel()}
    </div>
  );
};

export default MenuButton;
