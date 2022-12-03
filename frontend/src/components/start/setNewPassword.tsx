import Joi from "joi";
import Form from "./form";
import { NavigateFunction, useLocation } from "react-router-dom";
import userService from "../../services/userService";

interface SetNewPasswordFormProps {
  data: {
    password: string;
    repeatPassword: string;
  };
  errors: {};
  isNotificationPossible: boolean;
  onChange: (value: any, location: string[]) => void;
  navigator: NavigateFunction;
}

interface SetNewPasswordFormState {
  schema: Schema;
  showAuthText: boolean;
}

interface Schema {
  password: Joi.StringSchema<string>;
  repeatPassword: Joi.StringSchema<string>;
}

class SetNewPasswordForm extends Form<
  SetNewPasswordFormProps,
  SetNewPasswordFormState
> {
  state = {
    schema: {
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
    showAuthText: false,
  };

  onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    let location = useLocation();
    const { password } = this.props.data;
    const { onChange, navigator } = this.props;
    const hashes = location.hash.split("/");
    const uid = hashes[1];
    const token = hashes[2];
    const responseSetNewPassword = await userService.setNewPassword(
      uid,
      token,
      password
    );
    if (responseSetNewPassword) {
      localStorage.removeItem("receiveActivationEmail");
      navigator("/log-in");
    }
  };

  render() {
    const { password, repeatPassword } = this.props.data;
    return (
      <div className="form">
        <header>
          <h1 className="title">Set New Password</h1>
        </header>
        <form onSubmit={this.handleSubmit.bind(this)} noValidate>
          <div className="inputFieldWrapper">
            {this.renderInput(
              password,
              "password",
              "Enter Password",
              "password",
              true,
              true
            )}
            {this.renderInput(
              repeatPassword,
              "repeatPassword",
              "Confirm Password",
              "password"
            )}
          </div>
          {this.renderButton("Reset my password")}
        </form>
      </div>
    );
  }
}

export default SetNewPasswordForm;
