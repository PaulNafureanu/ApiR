import * as React from "react";
import { MethodsSupported } from "../../scripts/UserProject";
import Input from "../log/common/input";
import "./../../css/createMenu.css";
import "./../../css/utils.css";

interface CreateMenuProps {
  createMenuState: MethodsSupported;
  newItemColor: string;
  newItemName: string;
  handleCreateMenuClick: () => void;
  handleInputNameChange: (value: string) => void;
  handleInputColorChange: (value: string) => void;
  handleCreateMenuExit: () => void;
}

const CreateMenu: React.FunctionComponent<CreateMenuProps> = ({
  createMenuState,
  handleCreateMenuClick,
  newItemName,
  newItemColor,
  handleInputNameChange,
  handleInputColorChange,
  handleCreateMenuExit,
}) => {
  function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    handleCreateMenuClick();
  }

  function getCreateMenuStyle() {
    let createMenuStyle;
    if (createMenuState == "none") {
      createMenuStyle = { display: "none" };
    } else {
      createMenuStyle = { display: "flex" };
    }

    return createMenuStyle;
  }

  function getCreateMenuText() {
    let CreateMenuText = {
      header: "",
      inputSpanValue: "",
      submitButtonValue: "",
    };

    switch (createMenuState) {
      case "handleCreateFile": {
        CreateMenuText.header = "Choose the icon color and name your new file";
        CreateMenuText.inputSpanValue = "Type File Name Here";
        CreateMenuText.submitButtonValue = "Create File";
        break;
      }
      case "handleCreateFolder": {
        CreateMenuText.header =
          "Choose the icon color and name your new folder";
        CreateMenuText.inputSpanValue = "Type Folder Name Here";
        CreateMenuText.submitButtonValue = "Create Folder";
        break;
      }
      case "handleRename": {
        CreateMenuText.header = "Rename and choose a new icon color";
        CreateMenuText.inputSpanValue = "Type The New Name Here";
        CreateMenuText.submitButtonValue = "Rename";
        break;
      }
      case "handleDelete": {
        CreateMenuText.header =
          "Are you sure you want to delete the selected files?";
        CreateMenuText.submitButtonValue = "Delete permanently";
        break;
      }
      default: {
        break;
      }
    }

    return CreateMenuText;
  }

  function getFormMenu() {
    let menu, okButtonStyle;
    if (createMenuState == "handleDelete") {
      menu = <button onClick={handleCreateMenuExit}>Don't delete</button>;
      okButtonStyle = { width: "12rem" };
    } else {
      okButtonStyle = { width: "8.5rem" };
      menu = (
        <React.Fragment>
          <Input
            value={newItemName}
            onChange={(value) => handleInputNameChange(value)}
            spanValue={getCreateMenuText().inputSpanValue}
          />
          <div className="iconColor">
            <input
              type={"color"}
              value={newItemColor}
              onChange={(event) => {
                handleInputColorChange(event.target.value);
              }}
            ></input>
          </div>
        </React.Fragment>
      );
    }

    let formMenu = (
      <form className="bodyMenu" onSubmit={handleFormSubmit}>
        {menu}
        <button style={okButtonStyle}>
          {getCreateMenuText().submitButtonValue}
        </button>
      </form>
    );

    return formMenu;
  }

  return (
    <div className="createMenu noselect" style={getCreateMenuStyle()}>
      <div className="headerMenu">
        <div className="header">{getCreateMenuText().header}</div>
        <div className="exit" onClick={handleCreateMenuExit}>
          X
        </div>
      </div>
      {getFormMenu()}
    </div>
  );
};

export default CreateMenu;
