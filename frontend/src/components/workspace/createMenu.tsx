import * as React from "react";
import InputField from "../start/inputField";
import "./../../css/createMenu.css";
import "./../../css/utils.css";

interface CreateMenuProps {
  isCreateMenuOpen: string;
  handleSubmit: () => void;
  newItemName: string;
  handleInputNameChange: (value: string) => void;
  newItemColor: string;
  handleInputColorChange: (value: string) => void;
}

const CreateMenu: React.FunctionComponent<CreateMenuProps> = ({
  isCreateMenuOpen,
  handleSubmit,
  newItemName,
  newItemColor,
  handleInputNameChange,
  handleInputColorChange,
}) => {
  function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    handleSubmit();
  }

  function getCreateMenuStyle() {
    let createMenuStyle;
    if (isCreateMenuOpen == "none") {
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

    switch (isCreateMenuOpen) {
      case "createFile": {
        CreateMenuText.header = "Choose the icon color and name your new file";
        CreateMenuText.inputSpanValue = "Type File Name Here";
        CreateMenuText.submitButtonValue = "Create File";
        break;
      }
      case "createFolder": {
        CreateMenuText.header =
          "Choose the icon color and name your new folder";
        CreateMenuText.inputSpanValue = "Type Folder Name Here";
        CreateMenuText.submitButtonValue = "Create Folder";
        break;
      }
      case "rename": {
        CreateMenuText.header = "Rename and choose a new icon color";
        CreateMenuText.inputSpanValue = "Type The New Name Here";
        CreateMenuText.submitButtonValue = "Rename";
        break;
      }
      case "delete": {
        break;
      }
      default: {
        break;
      }
    }

    return CreateMenuText;
  }
  return (
    <div className="createMenu noselect" style={getCreateMenuStyle()}>
      <div className="headerMenu">{getCreateMenuText().header}</div>
      <form className="bodyMenu" onSubmit={handleFormSubmit}>
        <InputField
          value={newItemName}
          handleInputChange={(value) => handleInputNameChange(value)}
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
        <button>{getCreateMenuText().submitButtonValue}</button>
      </form>
    </div>
  );
};

export default CreateMenu;
