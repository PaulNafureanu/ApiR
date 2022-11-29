import Form from "./form";
import InputField from "./inputField";
import Joi from "joi";
import { registerUser } from "./../../services/userService";

interface RegistrationFormProps {
  data: {
    email: string;
    password: string;
    repeatPassword: string;
  };
  errors: {};
  isNotificationPossible: boolean;
  onChange: (value: any, location: string[]) => void;
  setShowLogInMenu: (log: boolean) => void;
}

interface RegistrationFormState {
  schema: Schema;
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
      password: Joi.string().min(5).max(30).required().label("Password"),
      repeatPassword: Joi.string()
        .required()
        .label("Repeat password")
        .valid(Joi.ref("password"))
        .messages({
          "any.only": '"Repeat password" should be identical with password',
        }),
    },
  };

  onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log("Submitted");
  };

  render() {
    const { email, password, repeatPassword } = this.props.data;
    const { setShowLogInMenu, onChange } = this.props;
    return (
      <div className="form">
        <header>
          <div className="title">Sign Up</div>
        </header>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <div className="inputFieldWrapper">
            {this.renderInput(email, "email", "text", true, true)}
            {this.renderInput(password, "password", "password")}
            <div className="inputPassFieldWrapper">
              {this.renderInput(repeatPassword, "repeatPassword", "password")}
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
          {this.renderButton("Sign Me Up")}
        </form>
      </div>
    );
  }
}

export default RegistrationForm;
