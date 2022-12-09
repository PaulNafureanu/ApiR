/**
 * This section details the endpoints flow between frontend (client machine) and backend (server).
 * There are 4 main public endpoints for frontend: /log-in, /sign-up, /reset-password and /page-not-found.
 * The rest of the endpoints are protected: /workspace, /set-new-password, ...
 *
 * The endpoint flow seen by the client:
 * (1) /log-in -> /workspace
 * (2) /sign-up -> /send-activation-email-link -> (client email) -> /confirm-activation -> /log-in
 * (3) /reset-password -> /send-password-reset-email-link -> (client email) -> /set-new-password -> /log-in
 * (4) (Everything else) -> /page-not-found
 *
 * The endpoint flow between client and server:
 * (1) /log-in -> createJWT(us, pw) -> (server endpoint) /auth/jwt/create -> (client receives from server) response 200 with access and refresh
 *                tokens, or response 401 unauthorized -> /workspace
 *
 * (2) /sign-up -> createUser(em, pw) -> (server endpoint) /auth/users -> (client receives from server) response 201 user created, or response
 *                 400 bad request -> (client) /send-activation-email-link -> (server sends activation email link) -> (client mail) ->
 *              -> (client) /confirm-activation -> activateUser(uid, token) -> (server endpoint) /auth/users/activation -> (client receives from
 *                 server) either response 204 account activated, response 400 bad request, or response 403 forbidden -> /log-in
 *
 * (3) /reset-password -> resetPassword(em) -> (server endpoint) /auth/users/reset_password -> (client receives from server) response 204 send
 *                        reset password link, or response 400 bad request -> /send-password-reset-email-link ->(server sends reset password email
 *                        link) -> (client mail) -> (client) /set-new-password -> setNewPassword(uid, token, new_pw) -> (server endpoint)
 *                        /auth/users/reset_password_confirm/ -> (client receives from server) -> response 204 password reset successfully,
 *                        or 400 bad request -> /log-in
 *
 * (4) (Everything else) -> /page-not-found
 */

import * as React from "react";
import vfx from "./../../services/vfxService";
import FormWrapper from "./wrappers/formWrapper";
import {
  EmailPasswordRepeatPassword,
  IFormProps,
  SchemaEmailPasswordRepeatPassword,
} from "./common/form";
import config from "./config";
import RouteWrapper from "./wrappers/routeWrapper";
import { useLocation, useNavigate } from "react-router-dom";
import { AppState } from "../../App";
import "./../../css/log/start.css";

interface StartProps {
  appState: AppState;
}

interface StartState<Type extends Object> {
  account: Type;
  errors: {};
  flags: {};
}

const Start: React.FunctionComponent<StartProps> = ({ appState }) => {
  const [startState, setStartState] = React.useState({
    account: { email: "", password: "", repeatPassword: "" },
    errors: {},
    flags: {
      isNotificationPossible: true,
      isActivationEmailSent: false,
      isPasswordResetEmailSent: false,
      shouldSignUpAgain: false,
    },
  } as StartState<EmailPasswordRepeatPassword>);

  const formProps = {
    globalData: startState.account,
    globalSchema: config.schema,
    errors: startState.errors,
    flags: startState.flags,
    onChange: handleChange,
    navigator: useNavigate(),
    locator: useLocation(),
  } as IFormProps<
    EmailPasswordRepeatPassword,
    SchemaEmailPasswordRepeatPassword
  >;

  function handleChange<Type>(value: Type, location: string[]) {
    let newStartState = structuredClone(
      startState
    ) as StartState<EmailPasswordRepeatPassword>;
    const len = location.length;

    function recursion(state: any, i: number): any {
      if (Object.keys(state).includes(location[i])) {
        if (i === len - 1) {
          if (typeof value !== typeof state[location[i]]) {
            console.error(
              "App.handleStateChange:: Type not identical for value " +
                value +
                "and parameter " +
                location[i]
            );
            return state;
          }
          state[location[i]] = value;
          return state;
        } else {
          state[location[i]] = recursion(state[location[i]], ++i);
          return state;
        }
      } else {
        console.error(
          "App.handleStateChange:: No property found with the name " +
            location[i] +
            "at depth " +
            i
        );
        return state;
      }
    }

    if (len > 0) {
      newStartState = recursion(
        newStartState,
        0
      ) as StartState<EmailPasswordRepeatPassword>;
      setStartState(newStartState);
    }
  }

  //State for the visual effects on the login/registration page
  const startRef = React.createRef<HTMLDivElement>();
  const [bgStyle, setBgStyle] = React.useState(vfx.backgroundStyle);
  const [circleSize, setCircleSize] = React.useState(80);

  //The lantern effect
  React.useEffect(() => {
    vfx.useLanternVFX(startRef, bgStyle, setBgStyle, circleSize, setCircleSize);
    localStorage.setItem("isSettingNewPassword", "true");
    // localStorage.clear();
  });

  return (
    <RouteWrapper
      formProps={formProps}
      element={
        <div id="Start" style={appState.theme.Start} ref={startRef}>
          <div className="bg" style={bgStyle} />
          <FormWrapper formProps={formProps} />
          <div className="bot">
            <div className="img"></div>
          </div>
        </div>
      }
    />
  );
};

export default Start;
