import Form from "./form";
import Joi from "joi";
import { Link, NavigateFunction } from "react-router-dom";
import userService from "./../../services/userService";

interface RegistrationFormProps {
  data: {
    email: string;
    password: string;
    repeatPassword: string;
  };
  errors: {};
  isNotificationPossible: boolean;
  onChange: (value: any, location: string[]) => void;
  navigator: NavigateFunction;
}

interface RegistrationFormState {
  schema: Schema;
  showAuthText: boolean;
}

interface Schema {
  email: Joi.StringSchema<string>;
  password: Joi.StringSchema<string>;
  repeatPassword: Joi.StringSchema<string>;
}

class RegistrationForm extends Form<
  RegistrationFormProps,
  RegistrationFormState
> {
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
        .min(8)
        .max(30)
        .required()
        .label("Password"),
      repeatPassword: Joi.string()
        .required()
        .label("Confirm password")
        .valid(Joi.ref("password"))
        .messages({
          "any.only": '"Confirm password" should be identical with password',
        }),
    },
    showAuthText: true,
  };

  onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const { email, password } = this.props.data;
    let responseCreateUser = await userService.createUser(email, password);
    if (responseCreateUser) {
      const responseCreateJWT = await userService.createJWT(email, password);
      if (responseCreateJWT) {
        this.props.onChange(true, ["isUserLoggedIn"]);
        this.props.navigator("/workspace");
      }
    }
  };

  render() {
    const { email, password, repeatPassword } = this.props.data;
    return (
      <div className="form">
        <header>
          <div className="title">Sign Up</div>
        </header>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <div className="inputFieldWrapper">
            {this.renderInput(
              email,
              "email",
              "Enter Email",
              "text",
              true,
              true
            )}
            {this.renderInput(
              password,
              "password",
              "Enter Password",
              "password"
            )}
            <div className="inputPassFieldWrapper">
              {this.renderInput(
                repeatPassword,
                "repeatPassword",
                "Confirm Password",
                "password"
              )}
              <div className="logInOption">
                <span className="accountQuestion">Do you have an account?</span>
                <Link className="logInText" to="/log-in">
                  Log In Here
                </Link>
              </div>
            </div>
          </div>
          {this.renderButton("Sign Me Up")}
        </form>
      </div>
    );
  }
}

export default RegistrationForm;
