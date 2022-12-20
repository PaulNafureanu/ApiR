import * as React from "react";
import "./../../../css/log/common/input.css";
import ThemeSetter from "../../themes/themeSetter";
interface InputProps {
  inputType?: string;
  spanValue: string;
  em?: boolean;
  value?: string;
  onChange: (value: string) => void;
  handleSubmit?: () => void;
  autoFocus?: boolean;
  theme?: ThemeSetter;
}

interface InputState {
  inputState: "onDefault" | "onFocus" | "onValid";
  spanState: "onDefault" | "onFocus" | "onEmphasize";
}

const Input: React.FunctionComponent<InputProps> = ({
  inputType = "text",
  spanValue,
  em = false,
  value = "",
  autoFocus = false,
  onChange,
  theme,
}) => {
  const [state, setState] = React.useState({
    inputState: "onDefault",
    spanState: "onDefault",
  } as InputState);

  function getClassName(em: boolean) {
    if (em) return "em";
    else {
      return "";
    }
  }

  function getInputStyle() {
    const { inputState } = state;
    switch (inputState) {
      case "onDefault": {
        return theme?.Input.Self.onDefault;
      }
      case "onFocus": {
        return theme?.Input.Self.onFocus;
      }
      case "onValid": {
        return theme?.Input.Self.onFocus;
      }
    }
  }

  return (
    <div className="inputContainer">
      {autoFocus ? (
        <input
          onFocus={() => {
            setState({ ...state, inputState: "onFocus" });
          }}
          onBlur={() => {
            if (value === "") setState({ ...state, inputState: "onDefault" });
          }}
          style={getInputStyle()}
          autoFocus
          value={value}
          onChange={(event) => onChange(event.target.value)}
          type={inputType}
          required={true}
        ></input>
      ) : (
        <input
          onFocus={() => {
            setState({ ...state, inputState: "onFocus" });
          }}
          onBlur={() => {
            if (value === "") setState({ ...state, inputState: "onDefault" });
          }}
          style={getInputStyle()}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          type={inputType}
          required={true}
        ></input>
      )}
      <span className={getClassName(em)}>{spanValue}</span>
    </div>
  );
};

export default Input;
