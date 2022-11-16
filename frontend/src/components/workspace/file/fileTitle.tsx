import * as React from "react";
import "./../../../css/fileTitle.css";
import "./../../../css/utils.css";

interface FileTitleProps {
  title: string;
}

const FileTitle: React.FunctionComponent<FileTitleProps> = ({ title }) => {
  return (
    <div className="fileTitle noselect">
      <div className="title">{title}</div>
    </div>
  );
};

export default FileTitle;
