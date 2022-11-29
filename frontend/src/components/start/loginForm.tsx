import Form from "./form";
import InputField from "./inputField";
import Joi from "joi";
import { loginUser } from "./../../services/userService";

interface LoginFormProps {
  data: {
    email: string;
    password: string;
  };
  errors: {};
  isNotificationPossible: boolean;
  onChange: (value: any, location: string[]) => void;
  setShowLogInMenu: (log: boolean) => void;
}

interface LoginFormState {
  schema: Schema;
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
      password: Joi.string().min(5).max(30).required().label("Password"),
    },
  };

  onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log("Hello");
  };

  render() {
    const { email, password } = this.props.data;
    const { setShowLogInMenu } = this.props;
    return (
      <div className="form">
        <header>
          <h1 className="title">Log in</h1>
        </header>
        <form onSubmit={this.handleSubmit.bind(this)} noValidate>
          <div className="inputFieldWrapper">
            {this.renderInput(email, "email", "text", true, true)}
            <div className="inputPassFieldWrapper">
              {this.renderInput(password, "password", "password")}
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
          {this.renderButton("Log Me In*")}
        </form>
      </div>
    );
  }
}

export default LoginForm;
