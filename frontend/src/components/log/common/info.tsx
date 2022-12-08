import * as React from "react";
import {
  Link,
  Location,
  NavigateFunction,
  useNavigate,
} from "react-router-dom";

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
  onSubmit: (params: InfoFuncParams) => {};
  onEffect: (params: InfoFuncParams) => string | undefined;
  funcParams: InfoFuncParams;
}
interface InfoPageProps {
  infoProps: InfoProps;
}

const InfoPage: React.FunctionComponent<InfoPageProps> = ({ infoProps }) => {
  const {
    title,
    subtitle,
    text,
    onSubmit,
    onEffect,
    subtext = "(You can now close this web page)",
    linkText = "Resend email",
    question = "No email from us?",
  } = infoProps;

  const navigator = useNavigate();
  React.useEffect(() => {
    if (onEffect) {
      const result = onEffect(infoProps.funcParams);
      if (result) {
        navigator(result);
      }
    }
  });

  return (
    <div className="form">
      <header>
        <h1 className="title">{title}</h1>
      </header>
      <div className="info">
        <div className="inputFieldWrapper">
          <p className="sup">{subtitle}</p>
          <p>{text}</p>
          <p className="sub">{subtext}</p>

          <div className="signUpOption">
            <span className="accountQuestion">{question}</span>
            <Link
              onClick={() => {
                if (onSubmit) onSubmit(infoProps.funcParams);
              }}
              className="logInText"
              to={"/sign-up"}
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
