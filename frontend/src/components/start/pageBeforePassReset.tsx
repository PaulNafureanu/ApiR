import * as React from "react";
import { Link } from "react-router-dom";
import userService from "./../../services/userService";

interface PageBeforePassResetProps {
  data: { email: string };
}

const PageBeforePassReset: React.FunctionComponent<
  PageBeforePassResetProps
> = ({ data }) => {
  async function onSubmit(e: any) {
    const { email } = data;
    const responseResetPass = await userService.resetPassword(email);
    if (responseResetPass) {
      localStorage.setItem("receivePasswordResetEmail", "true");
    }
  }

  return (
    <div className="form">
      <header>
        <h1 className="title">Check your email</h1>
      </header>
      <div className="form">
        <div className="inputFieldWrapper">
          <p className="sup">The reset password link was sent!</p>
          <p>
            Reset password form was submitted. Please verify your email to reset
            your password. After resetting you can log in.
          </p>
          <p></p>
          <p className="sub">{"(You can now close this web page)"}</p>

          <div className="signUpOption">
            <span className="accountQuestion">No email from us?</span>
            <Link
              onClick={onSubmit}
              className="logInText"
              to={"/registration-sent"}
            >
              Resend email
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageBeforePassReset;
