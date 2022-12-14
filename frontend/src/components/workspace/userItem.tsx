import * as React from "react";
import { fileFormat, folderFormat, itemType } from "../../scripts/UserItem";
import "./../../css/userItem.css";

interface UserItemProps {
  itemId: string;
  isOpen: boolean;
  isSelected: boolean;
  isActive: boolean;
  itemType: itemType;
  itemFormat: folderFormat | fileFormat;
  itemName: string;
  iconColor: string;
  layer: number;
  handleSelect: (
    id: string,
    isCtrlPressed: boolean,
    isShiftPressed: boolean
  ) => void;
  handleMove: (targetId: string, sourceId: string) => void;
}

const UserItem: React.FunctionComponent<UserItemProps> = ({
  itemId,
  isOpen,
  isSelected,
  isActive,
  itemType,
  itemFormat,
  itemName,
  iconColor,
  layer,
  handleSelect,
  handleMove,
}) => {
  function getIconItem(itemFormat: folderFormat | fileFormat) {
    switch (itemFormat) {
      case "OpenFolder": {
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 576 512"
            fill={iconColor}
          >
            <path d="M88.7 223.8L0 375.8V96C0 60.7 28.7 32 64 32H181.5c17 0 33.3 6.7 45.3 18.7l26.5 26.5c12 12 28.3 18.7 45.3 18.7H416c35.3 0 64 28.7 64 64v32H144c-22.8 0-43.8 12.1-55.3 31.8zm27.6 16.1C122.1 230 132.6 224 144 224H544c11.5 0 22 6.1 27.7 16.1s5.7 22.2-.1 32.1l-112 192C453.9 474 443.4 480 432 480H32c-11.5 0-22-6.1-27.7-16.1s-5.7-22.2 .1-32.1l112-192z" />
          </svg>
        );
      }

      case "ClosedFolder": {
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            fill={iconColor}
          >
            <path d="M64 480H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H298.5c-17 0-33.3-6.7-45.3-18.7L226.7 50.7c-12-12-28.3-18.7-45.3-18.7H64C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64z" />
          </svg>
        );
      }

      case "app": {
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            fill={iconColor}
          >
            <path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z" />
          </svg>
        );
      }
      case ".txt": {
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            fill={iconColor}
          >
            <path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM112 256H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16z" />
          </svg>
        );
      }
      case ".pdf": {
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            fill={iconColor}
          >
            <path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM64 224H88c30.9 0 56 25.1 56 56s-25.1 56-56 56H80v32c0 8.8-7.2 16-16 16s-16-7.2-16-16V320 240c0-8.8 7.2-16 16-16zm24 80c13.3 0 24-10.7 24-24s-10.7-24-24-24H80v48h8zm72-64c0-8.8 7.2-16 16-16h24c26.5 0 48 21.5 48 48v64c0 26.5-21.5 48-48 48H176c-8.8 0-16-7.2-16-16V240zm32 112h8c8.8 0 16-7.2 16-16V272c0-8.8-7.2-16-16-16h-8v96zm96-128h48c8.8 0 16 7.2 16 16s-7.2 16-16 16H304v32h32c8.8 0 16 7.2 16 16s-7.2 16-16 16H304v48c0 8.8-7.2 16-16 16s-16-7.2-16-16V304 240c0-8.8 7.2-16 16-16z" />
          </svg>
        );
      }
      case ".doc": {
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            fill={iconColor}
          >
            <path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM111 257.1l26.8 89.2 31.6-90.3c3.4-9.6 12.5-16.1 22.7-16.1s19.3 6.4 22.7 16.1l31.6 90.3L273 257.1c3.8-12.7 17.2-19.9 29.9-16.1s19.9 17.2 16.1 29.9l-48 160c-3 10-12.1 16.9-22.4 17.1s-19.8-6.2-23.2-16.1L192 336.6l-33.3 95.3c-3.4 9.8-12.8 16.3-23.2 16.1s-19.5-7.1-22.4-17.1l-48-160c-3.8-12.7 3.4-26.1 16.1-29.9s26.1 3.4 29.9 16.1z" />
          </svg>
        );
      }
      case ".docx": {
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            fill={iconColor}
          >
            <path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM111 257.1l26.8 89.2 31.6-90.3c3.4-9.6 12.5-16.1 22.7-16.1s19.3 6.4 22.7 16.1l31.6 90.3L273 257.1c3.8-12.7 17.2-19.9 29.9-16.1s19.9 17.2 16.1 29.9l-48 160c-3 10-12.1 16.9-22.4 17.1s-19.8-6.2-23.2-16.1L192 336.6l-33.3 95.3c-3.4 9.8-12.8 16.3-23.2 16.1s-19.5-7.1-22.4-17.1l-48-160c-3.8-12.7 3.4-26.1 16.1-29.9s26.1 3.4 29.9 16.1z" />
          </svg>
        );
      }
      default: {
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            fill={iconColor}
          >
            <path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z" />
          </svg>
        );
      }
    }
  }

  function getUserItemStyle() {
    let userItemStyle = { backgroundColor: "", border: "", color: "" };

    if (isSelected) {
      if (isActive) {
        userItemStyle = {
          backgroundColor: "#1d2b3add",
          border: "1px solid #45f3ff",
          color: "inherit",
        };
      } else {
        userItemStyle = {
          backgroundColor: "rgba(255,255,255,0.1)",
          border: "none",
          color: "inherit",
        };
      }
    } else {
      if (isActive) {
        userItemStyle = {
          backgroundColor: "transparent",
          border: "1px solid #45f3ff88",
          color: "inherit",
        };
      } else {
        userItemStyle = {
          backgroundColor: "transparent",
          border: "none",
          color: "inherit",
        };
      }
    }
    return userItemStyle;
  }

  function getIconsStyle() {
    let iconsStyle = { marginLeft: `${0.5 * (layer - 1)}rem` };
    return iconsStyle;
  }

  function getDropDownIconStyle() {
    let dropDownIconStyle = {};

    if (isOpen) {
      dropDownIconStyle = { transform: "none" };
    } else {
      dropDownIconStyle = { transform: "rotate(-90deg)" };
    }

    return dropDownIconStyle;
  }

  return (
    <div
      className={"userItem " + itemType}
      onClick={(e) => {
        let isCtrlPressed = false;
        let isShiftPressed = false;
        if (e.ctrlKey) {
          isCtrlPressed = true;
        }
        if (e.shiftKey) {
          isShiftPressed = true;
        }
        handleSelect(itemId, isCtrlPressed, isShiftPressed);
      }}
      style={getUserItemStyle()}
      draggable={true}
      onDragStart={(e) => {
        e.dataTransfer.setData("id", itemId);
      }}
      onDrop={(e) => {
        e.preventDefault();
        let sourceId = e.dataTransfer.getData("id");
        handleMove(itemId, sourceId);
      }}
      onDragOver={(e) => {
        e.preventDefault();
      }}
    >
      <div className="icons" style={getIconsStyle()}>
        {itemType === "folder" ? (
          <div className="dropDownIcon">
            <img
              src="./svgs/arrow.svg"
              style={getDropDownIconStyle()}
              alt="Folder"
            />
          </div>
        ) : (
          <div></div>
        )}
        <div className="itemIcon">{getIconItem(itemFormat)}</div>
      </div>
      <div className="itemName">{itemName}</div>
    </div>
  );
};

export default UserItem;
