import * as React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import LoginForm from "../forms/login";
import SignupForm from "../forms/signup";
import ResetPasswordForm from "../forms/resetPassword";
import SetNewPasswordForm from "../forms/setNewPassword";
import vfx from "./../../../services/vfxService";
import InfoPage from "../common/info";
import {
  EmailPasswordRepeatPassword,
  IFormProps,
  SchemaEmailPasswordRepeatPassword,
} from "../common/form";
import config from "./../config";
import "./../../../css/formWrapper.css";

interface FormWrapperProps {
  formProps: IFormProps<
    EmailPasswordRepeatPassword,
    SchemaEmailPasswordRepeatPassword
  >;
}

const FormWrapper: React.FunctionComponent<FormWrapperProps> = ({
  formProps,
}) => {
  //The form tilt effect on the login/registration page
  const tiltRef = React.createRef<HTMLDivElement>();
  React.useEffect(() => {
    vfx.useTiltVFX(tiltRef);
  }, []);

  //Form Wrapper
  const { id } = useParams();
  const locator = useLocation();
  const navigator = useNavigate();
  function renderFormWrapper() {
    switch (id) {
      case "log-in": {
        return <LoginForm formProps={formProps} />;
      }
      case "sign-up": {
        return <SignupForm formProps={formProps} />;
      }
      case "send-activation-email-link": {
        const { email } = formProps.globalData;
        config.infoProps_SendActivEmailLink.funcParams.email = email;
        return <InfoPage infoProps={config.infoProps_SendActivEmailLink} />;
      }
      case "confirm-activation": {
        const { onChange } = formProps;
        config.infoProps_ConfirmActivation.funcParams.locator = locator;
        config.infoProps_ConfirmActivation.funcParams.onChange = onChange;
        config.infoProps_ConfirmActivation.funcParams.navigator = navigator;
        return <InfoPage infoProps={config.infoProps_ConfirmActivation} />;
      }
      case "reset-password": {
        return <ResetPasswordForm formProps={formProps} />;
      }
      case "send-password-reset-email-link": {
        const { email } = formProps.globalData;
        config.infoProps_SendActivEmailLink.funcParams.email = email;
        return <InfoPage infoProps={config.infoProps_SendPWResetEmailLink} />;
      }
      case "set-new-password": {
        return <SetNewPasswordForm formProps={formProps} />;
      }
      case "page-not-found": {
        return <InfoPage infoProps={config.infoProps_PageNotFound} />;
      }
      default: {
        return <InfoPage infoProps={config.infoProps_PageNotFound} />;
      }
    }
  }

  return (
    <div className={"Tilt"} ref={tiltRef} {...vfx.tiltOptions}>
      <div className="container">{renderFormWrapper()}</div>
    </div>
  );
};

export default FormWrapper;
