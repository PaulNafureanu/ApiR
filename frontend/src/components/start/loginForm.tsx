import * as React from "react";
import InputField from "./inputField";
import { AppState } from "../../App";
import { loginUser } from "./../../services/userService";

interface LoginFormProps {
  appState: AppState;
  onChange: (value: any, location: string[]) => void;
  setShowLogInMenu: (log: boolean) => void;
}

const LoginForm: React.FunctionComponent<LoginFormProps> = ({
  appState,
  onChange,
  setShowLogInMenu,
}) => {
  const account = appState.account;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <div className="form">
      <header>
        <h1 className="title">Log in</h1>
      </header>
      <form onSubmit={handleSubmit}>
        <div className="inputFieldWrapper">
          <InputField
            autoFocus={true}
            value={account.email}
            handleInputChange={(value) => onChange(value, ["account", "email"])}
            spanValue="Enter Email"
            em={true}
          />
          <div className="inputPassFieldWrapper">
            <InputField
              value={account.password}
              handleInputChange={(value) =>
                onChange(value, ["account", "password"])
              }
              spanValue="Enter Password"
              inputType="password"
            />
            <div className="signUpOption">
              <span className="forgetPasswordOption">Forget Password?</span>
              <span
                onClick={() => {
                  setShowLogInMenu(false);
                }}
                className="signUpText"
              >
                Sign Up Here
              </span>
            </div>
          </div>
        </div>
        <div className="buttonForm">
          <button
            onClick={() => {
              const prom = loginUser(account.email, account.password);
              prom.then((value) => {
                onChange(value, ["isUserLoggedIn"]);
              });
            }}
          >
            Log Me In*
          </button>
          <span>*Authorize access to my Google Drive</span>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
