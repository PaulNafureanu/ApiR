import Joi from "joi";
import Form from "./form";
import { Link, NavigateFunction } from "react-router-dom";
import userService from "./../../services/userService";

interface ResetPasswordFormProps {
  data: {
    email: string;
  };
  errors: {};
  isNotificationPossible: boolean;
  onChange: (value: any, location: string[]) => void;
  navigator: NavigateFunction;
}

interface ResetPasswordFormState {
  schema: Schema;
  showAuthText: boolean;
}

interface Schema {
  email: Joi.StringSchema<string>;
}

class ResetPasswordForm extends Form<
  ResetPasswordFormProps,
  ResetPasswordFormState
> {
  state = {
    schema: {
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com"] } })
        .required()
        .label("Email")
        .regex(/gmail/i)
        .message('"Email" should be a Google account (gmail)'),
    },
    showAuthText: false,
  };

  onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const { email } = this.props.data;
    const responseResetPass = await userService.resetPassword(email);
    if (responseResetPass) {
      localStorage.setItem("receivePasswordResetEmail", "true");
      this.props.onChange(true, ["isSettingNewPassword"]);
      this.props.navigator("/password-reset-sent");
    }
  };

  render() {
    const { email } = this.props.data;
    return (
      <div className="form">
        <header>
          <h1 className="title">Reset Password</h1>
        </header>
        <form onSubmit={this.handleSubmit.bind(this)} noValidate>
          <div className="inputFieldWrapper">
            <div className="inputPassFieldWrapper">
              {this.renderInput(
                email,
                "email",
                "Enter Email",
                "text",
                true,
                true
              )}
              <div className="logInOption">
                <span className="accountQuestion">
                  Do you remember the password?
                </span>
                <Link className="logInText" to="/log-in">
                  Log In Here
                </Link>
              </div>
            </div>
          </div>
          {this.renderButton("Send me an email link")}
        </form>
      </div>
    );
  }
}

export default ResetPasswordForm;
