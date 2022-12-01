import * as React from "react";
import { Link } from "react-router-dom";
import userService from "./../../services/userService";

interface PageBeforeActivationProps {
  data: { email: string };
}

const PageBeforeActivation: React.FunctionComponent<
  PageBeforeActivationProps
> = ({ data }) => {
  function onSubmit(e: any) {
    const { email } = data;
    userService.resendActivationEmail(email);
  }

  return (
    <div className="form">
      <header>
        <h1 className="title">Verify your email</h1>
      </header>
      <div className="form">
        <div className="inputFieldWrapper">
          <p className="sup">Congratulations!&#128525;</p>
          <p>
            Registration form was submitted. Please verify your email to
            activate your account. After activation you can log in.
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
              Resend verification email
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageBeforeActivation;
