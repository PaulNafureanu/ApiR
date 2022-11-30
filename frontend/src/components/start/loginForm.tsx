import Form from "./form";
import InputField from "./inputField";
import userService from "./../../services/userService";
import Joi from "joi";
import { Link, NavigateFunction } from "react-router-dom";

interface LoginFormProps {
  data: {
    email: string;
    password: string;
  };
  errors: {};
  isNotificationPossible: boolean;
  onChange: (value: any, location: string[]) => void;
  navigator: NavigateFunction;
}

interface LoginFormState {
  schema: Schema;
  showAuthText: boolean;
}

interface Schema {
  email: Joi.StringSchema<string>;
  password: Joi.StringSchema<string>;
}

class LoginForm extends Form<LoginFormProps, LoginFormState> {
  state = {
    schema: {
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com"] } })
        .required()
        .label("Email")
        .regex(/gmail/i)
        .message('"Email" should be a Google account (gmail)'),
      password: Joi.string()
        .alphanum()
        .min(5)
        .max(30)
        .required()
        .label("Password"),
    },

    showAuthText: true,
  };

  onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const { email, password } = this.props.data;
    const responseCreateJWT = await userService.createJWT(email, password);
    if (responseCreateJWT) {
      this.props.onChange(true, ["isUserLoggedIn"]);
      this.props.navigator("/workspace");
    }
  };

  render() {
    const { email, password } = this.props.data;
    return (
      <div className="form">
        <header>
          <h1 className="title">Log in</h1>
        </header>
        <form onSubmit={this.handleSubmit.bind(this)} noValidate>
          <div className="inputFieldWrapper">
            {this.renderInput(
              email,
              "email",
              "Enter Email",
              "text",
              true,
              true
            )}
            <div className="inputPassFieldWrapper">
              {this.renderInput(
                password,
                "password",
                "Enter Password",
                "password"
              )}
              <div className="signUpOption">
                <Link className="forgetPasswordOption" to="/reset-password">
                  Forget Password?
                </Link>
                <Link className="signUpText" to="/sign-up">
                  Sign Up Here
                </Link>
              </div>
            </div>
          </div>
          {this.renderButton("Log Me In*")}
        </form>
      </div>
    );
  }
}

export default LoginForm;
