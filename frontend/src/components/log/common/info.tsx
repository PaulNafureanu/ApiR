import * as React from "react";
import {
  Link,
  Location,
  NavigateFunction,
  useNavigate,
} from "react-router-dom";
import "./../../../css/log/common/form.css";

export interface InfoFuncParams {
  email?: string;
  locator?: Location;
  onChange?: (value: any, location: string[]) => void;
  navigator?: NavigateFunction;
}

export interface InfoProps {
  title: string;
  subtitle: string;
  text: string;
  subtext?: string;
  linkText?: string;
  question?: string;
  theme: any;
  onSubmit: (params: InfoFuncParams) => {};
  onEffect: (params: InfoFuncParams) => string | undefined;
  funcParams: InfoFuncParams;
}
interface InfoPageProps {
  infoProps: InfoProps;
}

interface InfoPageState {
  isSignUpOnDefaultStyle: boolean;
}

const InfoPage: React.FunctionComponent<InfoPageProps> = ({ infoProps }) => {
  const [infoState, setInfoState] = React.useState({
    isSignUpOnDefaultStyle: true,
  } as InfoPageState);

  const {
    title,
    subtitle,
    text,
    onSubmit,
    onEffect,
    subtext = "(You can now close this web page)",
    linkText = "Resend email",
    question = "No email from us?",
    theme,
  } = infoProps;

  const { Self, Text, Info } = theme.Form;
  const navigator = useNavigate();
  React.useEffect(() => {
    if (onEffect) {
      const result = onEffect(infoProps.funcParams);
      if (result) {
        navigator(result);
      }
    }
  });

  const onSetLinkState = (propName: string, value: boolean) => {
    const newState: any = { ...infoState };
    newState[propName] = value;
    setInfoState(newState);
  };

  const onSetLinkStyle = (
    propValue: boolean,
    styles: { onDefault: {}; onHover: {} }
  ) => {
    return propValue ? styles.onDefault : styles.onHover;
  };

  return (
    <div className="form" style={Self}>
      <header>
        <h1 className="title" style={Text.Title}>
          {title}
        </h1>
      </header>
      <div className="info">
        <div className="inputFieldWrapper">
          <p className="sup" style={Info.Text}>
            {subtitle}
          </p>
          <p style={Info.Text}>{text}</p>
          <p className="sub" style={Info.Text}>
            {subtext}
          </p>

          <div className="signUpOption">
            <span className="accountQuestion" style={Text.Question}>
              {question}
            </span>
            <Link
              onClick={() => {
                if (onSubmit) onSubmit(infoProps.funcParams);
              }}
              className="logInText"
              to={"/sign-up"}
              onMouseOver={() => {
                onSetLinkState("isSignUpOnDefaultStyle", false);
              }}
              onMouseOut={() => {
                onSetLinkState("isSignUpOnDefaultStyle", true);
              }}
              style={onSetLinkStyle(
                infoState.isSignUpOnDefaultStyle,
                Text.Link.SignInOut
              )}
            >
              {linkText}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPage;
