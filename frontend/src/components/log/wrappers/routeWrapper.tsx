import * as React from "react";
import { Navigate, useLocation } from "react-router-dom";
import {
  EmailPasswordRepeatPassword,
  IFormProps,
  SchemaEmailPasswordRepeatPassword,
} from "../common/form";

interface RouteWrapperProps {
  formProps: IFormProps<
    EmailPasswordRepeatPassword,
    SchemaEmailPasswordRepeatPassword
  >;
  element: JSX.Element;
}

const RouteWrapper: React.FunctionComponent<RouteWrapperProps> = ({
  formProps,
  element,
}) => {
  const pathname = useLocation().pathname.split("/")[1];
  const ExistentPaths = [
    "",
    "log-in",
    "sign-up",
    "send-activation-email-link",
    "confirm-activation",
    "reset-password",
    "send-password-reset-email-link",
    "set-new-password",
    "page-not-found",
  ];

  if (!ExistentPaths.includes(pathname))
    return <Navigate to={"/page-not-found"} />;

  let condition = true;
  let altPath = "/page-not-found";

  const { isActivationEmailSent, isPasswordResetEmailSent } = formProps.flags;

  switch (pathname) {
    case "send-activation-email-link": {
      condition = isActivationEmailSent;
      altPath = "/sign-up";
      break;
    }
    case "confirm-activation": {
      condition = localStorage.getItem("isActivationConfirmed") === "true";
      altPath = "/sign-up";
      break;
    }
    case "send-password-reset-email-link": {
      condition = isPasswordResetEmailSent;
      altPath = "/reset-password";
      break;
    }
    case "set-new-password": {
      condition = localStorage.getItem("isSettingNewPassword") === "true";
      altPath = "/reset-password";
      break;
    }
  }

  return <>{condition ? element : <Navigate to={altPath} />}</>;
};

export default RouteWrapper;
