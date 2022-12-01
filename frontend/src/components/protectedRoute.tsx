import * as React from "react";
import { AppState } from "./../App";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  appState: AppState;
  element: React.ReactElement;
}

const ProtectedRoute: React.FunctionComponent<ProtectedRouteProps> = ({
  element,
  appState,
}) => {
  let condition = true;
  let alternativePath = "/not-found";
  const currentPath = useLocation().pathname.split("/")[1];

  const ExistentPaths = [
    "",
    "log-in",
    "sign-up",
    "workspace",
    "registration-sent",
    "account-activation",
    "reset-password",
    "set-new-password",
    "workspace",
  ];

  if (!ExistentPaths.includes(currentPath)) return <Navigate to="/not-found" />;
  switch (currentPath) {
    case "registration-sent": {
      condition = appState["isRegistrationSent"];
      alternativePath = "/sign-up";
      break;
    }
    case "account-activation": {
      let receiveActivationEmail = localStorage.getItem(
        "receiveActivationEmail"
      );
      condition = receiveActivationEmail === "true";
      alternativePath = "/sign-up";
      break;
    }
    case "set-new-password": {
      condition = appState["isSettingNewPassword"];
      alternativePath = "/reset-password";
      break;
    }
    case "workspace": {
      condition = appState["isUserLoggedIn"];
      alternativePath = "/log-in";
      break;
    }
  }

  return condition ? element : <Navigate to={alternativePath} />;
};

export default ProtectedRoute;
