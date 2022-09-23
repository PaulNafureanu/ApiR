import * as React from "react";
import "./../../../css/userItem.css";

interface UserItemProps {
  itemType: string;
  itemName: string;
  iconPath: string;
}

const UserItem: React.FunctionComponent<UserItemProps> = ({
  itemType,
  itemName,
  iconPath,
}) => {
  return (
    <div className={"userItem " + itemType}>
      <div className="icons">
        {itemType == "folder" ? (
          <div className="dropDownIcon">
            <img src="./svgs/arrow.svg" alt="Open" />
          </div>
        ) : (
          <div></div>
        )}
        <div className="itemIcon">
          <img src={iconPath} alt={itemName} />
        </div>
      </div>
      <div className="itemName">{itemName}</div>
    </div>
  );
};

export default UserItem;
