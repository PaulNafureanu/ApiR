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
  const { account } = appState;

  //The form tilt effect on the login/registration page
  React.useEffect(() => {
    VanillaTilt.init(tiltRef.current!);
  }, []);

  return (
    <div id={cssId} className={cssClass} ref={tiltRef} {...options}>
      <div className="container">
        {showLogInMenu ? (
          <LoginForm
            data={{ email: account.email, password: account.password }}
            errors={appState.errors}
            onChange={onChange}
            isNotificationPossible={appState.isNotificationPossible}
            setShowLogInMenu={(value: boolean) => setShowLogInMenu(value)}
          />
        ) : (
          <RegistrationForm
            data={{
              email: account.email,
              password: account.password,
              repeatPassword: account.repeatPassword,
            }}
            errors={appState.errors}
            onChange={onChange}
            isNotificationPossible={appState.isNotificationPossible}
            setShowLogInMenu={(value: boolean) => setShowLogInMenu(value)}
          />
        )}
      </div>
    </div>
  );
};

export default FormWrapper;
