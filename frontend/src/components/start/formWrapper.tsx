import * as React from "react";
import VanillaTilt, { TiltOptions } from "vanilla-tilt";
import { AppState } from "../../App";
import LoginForm from "./loginForm";
import RegistrationForm from "./registrationForm";
import "./../../css/formWrapper.css";

interface FormWrapperProps {
  options?: TiltOptions;
  cssId?: string;
  cssClass?: string;
  appState: AppState;
  onChange: (value: any, location: string[]) => void;
}

const FormWrapper: React.FunctionComponent<FormWrapperProps> = ({
  options,
  cssId,
  cssClass = "Tilt",
  appState,
  onChange,
}) => {
  const tiltRef = React.createRef<HTMLDivElement>();
  const [showLogInMenu, setShowLogInMenu] = React.useState(true);

  //The form tilt effect on the login/registration page
  React.useEffect(() => {
    VanillaTilt.init(tiltRef.current!);
  }, []);

  return (
    <div id={cssId} className={cssClass} ref={tiltRef} {...options}>
      <div className="container">
        {showLogInMenu ? (
          <LoginForm
            appState={appState}
            onChange={onChange}
            setShowLogInMenu={(value) => setShowLogInMenu(value)}
          />
        ) : (
          <RegistrationForm
            appState={appState}
            onChange={onChange}
            setShowLogInMenu={(value) => setShowLogInMenu(value)}
          />
        )}
      </div>
    </div>
  );
};

export default FormWrapper;
