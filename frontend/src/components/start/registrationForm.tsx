import * as React from "react";
import InputField from "./inputField";
import { AppState } from "../../App";
import { registerUser } from "./../../services/userService";

interface RegistrationFormProps {
  appState: AppState;
  onChange: (value: any, location: string[]) => void;
  setShowLogInMenu: (log: boolean) => void;
}

const RegistrationForm: React.FunctionComponent<RegistrationFormProps> = ({
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
        <div className="title">Sign Up</div>
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
          <InputField
            value={account.password}
            handleInputChange={(value) =>
              onChange(value, ["account", "password"])
            }
            spanValue="Enter Password"
            inputType="password"
          />
          <div className="inputPassFieldWrapper">
            <InputField
              value={account.repeatPassword}
              handleInputChange={(value) =>
                onChange(value, ["account", "repeatPassword"])
              }
              spanValue="Repeat Password"
              inputType="password"
            />
            <div className="logInOption">
              <span className="accountQuestion">Do you have an account?</span>
              <span
                onClick={() => {
                  setShowLogInMenu(true);
                }}
                className="logInText"
              >
                {" "}
                Log In Here
              </span>
            </div>
          </div>
        </div>
        <div className="buttonForm">
          <button
            onClick={() => {
              const prom = registerUser(account.email, account.password);
              prom.then((value) => {
                onChange(value, ["isUserLoggedIn"]);
              });
            }}
          >
            Sign Me Up*
          </button>
          <span>*Authorize access to my Google Drive</span>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;
