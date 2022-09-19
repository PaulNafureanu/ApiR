import * as React from "react";
import "./../../css/inputField.css";

interface InputFieldProps {
  inputType?: string;
  value: string;
  em?: boolean;
}

const InputField: React.FunctionComponent<InputFieldProps> = ({
  inputType = "text",
  value,
  em = false,
}) => {
  function getClassName(em: boolean) {
    if (em) return "em";
    else {
      return "";
    }
  }
  return (
    <div className="inputBox">
      <input type={inputType} required={true}></input>
      <span className={getClassName(em)}>{value}</span>
    </div>
  );
};

export default InputField;
