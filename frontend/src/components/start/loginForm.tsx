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

  function validate(): null | Object {
    const errors: any = {};

    const { account } = appState;

    if (account.email.trim() === "") errors.email = "Email is required";

    if (account.password.trim() === "")
      errors.password = "Password is required";

    return Object.keys(errors).length === 0 ? null : errors;
  }

  function validateProperty(name: string, value: string): null | string {
    switch (name) {
      case "email": {
        if (value.trim() === "") return "Email is required";
        break;
      }
      case "password": {
        if (value.trim() === "") return "Password is required";
        break;
      }
      default: {
        return null;
      }
    }
    return null;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const errors = validate();
    onChange(errors ? errors : {}, ["errors"]);
    if (errors) return;

    //Calling the backend
    console.log("Submitted");
  }

  function handleChange(name: string, value: string) {
    const errors: any = { ...appState.errors };
    const errorMessage = validateProperty(name, value);
    if (errorMessage) errors[name] = errorMessage;
    else delete errors[name];

    onChange(errors ? errors : {}, ["errors"]);
    onChange(value, ["account", name]);
  }

  return (
    <div className="form">
      <header>
        <h1 className="title">Log in</h1>
      </header>
      <form onSubmit={handleSubmit} noValidate>
        <div className="inputFieldWrapper">
          <InputField
            autoFocus={true}
            value={account.email}
            onChange={(value) => handleChange("email", value)}
            spanValue="Enter Email"
            em={true}
          />
          <div className="inputPassFieldWrapper">
            <InputField
              value={account.password}
              onChange={(value) => handleChange("password", value)}
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
          // onClick={() => {
          //   const prom = loginUser(account.email, account.password);
          //   prom.then((value) => {
          //     onChange(value, ["isUserLoggedIn"]);
          //   });
          // }}
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
