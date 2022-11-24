import * as React from "react";
import "./../../css/inputField.css";

interface InputFieldProps {
  inputType?: string;
  spanValue: string;
  em?: boolean;
  value?: string;
  handleInputChange: (value: string) => void;
  handleSubmit?: () => void;
  autoFocus?: boolean;
}

const InputField: React.FunctionComponent<InputFieldProps> = ({
  inputType = "text",
  spanValue,
  em = false,
  value = "",
  autoFocus = false,
  handleInputChange,
}) => {
  function getClassName(em: boolean) {
    if (em) return "em";
    else {
      return "";
    }
  }
  return (
    <div className="inputBox">
      {autoFocus ? (
        <input
          autoFocus
          value={value}
          onChange={(event) => handleInputChange(event.target.value)}
          type={inputType}
          required={true}
        ></input>
      ) : (
        <input
          value={value}
          onChange={(event) => handleInputChange(event.target.value)}
          type={inputType}
          required={true}
        ></input>
      )}
      <span className={getClassName(em)}>{spanValue}</span>
    </div>
  );
};

export default InputField;
