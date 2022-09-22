import * as React from "react";

interface RightSidebarProps {
  customStyle: any;
}

const RightSidebar: React.FunctionComponent<RightSidebarProps> = ({
  customStyle,
}) => {
  return <div className="rightSidebar" style={customStyle}></div>;
};

export default RightSidebar;
