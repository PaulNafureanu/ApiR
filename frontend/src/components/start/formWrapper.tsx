import * as React from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { AppState } from "../../App";
import vfx from "./../../services/vfxService";
import LoginForm from "./loginForm";
import RegistrationForm from "./registrationForm";
import ResetPasswordForm from "./resetPassword";
import SetNewPasswordForm from "./setNewPassword";
import "./../../css/formWrapper.css";

interface FormWrapperProps {
  appState: AppState;
  onChange: (value: any, location: string[]) => void;
}

const FormWrapper: React.FunctionComponent<FormWrapperProps> = ({
  appState,
  onChange,
}) => {
  const tiltRef = React.createRef<HTMLDivElement>();
  const { account } = appState;

  //The form tilt effect on the login/registration page
  React.useEffect(() => {
    vfx.useTiltVFX(tiltRef);
  }, []);

  const { id } = useParams();
  const navigator = useNavigate();

  function renderForm(id: any) {
    switch (id) {
      case "log-in": {
        return (
          <LoginForm
            data={{ email: account.email, password: account.password }}
            errors={appState.errors}
            onChange={onChange}
            navigator={navigator}
            isNotificationPossible={appState.isNotificationPossible}
          />
        );
      }

      case "sign-up": {
        return (
          <RegistrationForm
            data={{
              email: account.email,
              password: account.password,
              repeatPassword: account.repeatPassword,
            }}
            errors={appState.errors}
            onChange={onChange}
            navigator={navigator}
            isNotificationPossible={appState.isNotificationPossible}
          />
        );
      }
      case "reset-password": {
        return (
          <ResetPasswordForm
            data={{
              email: account.email,
            }}
            errors={appState.errors}
            onChange={onChange}
            navigator={navigator}
            isNotificationPossible={appState.isNotificationPossible}
          />
        );
      }
      case "set-new-password": {
        //Needs to be protected somehow
        return (
          <SetNewPasswordForm
            data={{
              password: account.password,
              repeatPassword: account.repeatPassword,
            }}
            errors={appState.errors}
            onChange={onChange}
            navigator={navigator}
            isNotificationPossible={appState.isNotificationPossible}
          />
        );
      }
      default: {
        return <Navigate to="/not-found" />;
      }
    }
  }

  return (
    <div className={"Tilt"} ref={tiltRef} {...vfx.tiltOptions}>
      <div className="container">{renderForm(id)}</div>
    </div>
  );
};

export default FormWrapper;
