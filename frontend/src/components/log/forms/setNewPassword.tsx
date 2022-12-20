import Form from "./../common/form";
import userService from "../../../services/userService";
import {
  IFormProps,
  PasswordRepeatPassword,
  SchemaPasswordRepeatPassword,
} from "./../common/form";
import notifier from "../../../services/notificationService";

interface SetNewPasswordFormProps {
  formProps: IFormProps<PasswordRepeatPassword, SchemaPasswordRepeatPassword>;
}

interface SetNewPasswordFormState {
  showGoogleAuthText: boolean;
  isButtonOnDefaultStyle: boolean;
}

class SetNewPasswordForm extends Form<
  PasswordRepeatPassword,
  SchemaPasswordRepeatPassword,
  SetNewPasswordFormProps,
  SetNewPasswordFormState
> {
  state = {
    showGoogleAuthText: false,
    isButtonOnDefaultStyle: true,
  };

  specificState = (): {
    data: PasswordRepeatPassword;
    schema: SchemaPasswordRepeatPassword;
  } => {
    return {
      data: {
        password: this.props.formProps.globalData.password,
        repeatPassword: this.props.formProps.globalData.repeatPassword,
      },
      schema: {
        password: this.props.formProps.globalSchema.password,
        repeatPassword: this.props.formProps.globalSchema.repeatPassword,
      },
    };
  };

  componentDidUpdate() {
    this.onEffect();
  }

  onEffect = () => {
    const { locator, navigator } = this.props.formProps;
    const hashes = locator.hash.split("/");
    const uid = hashes[1];
    const token = hashes[2];
    if (uid && token) {
      localStorage.setItem("local_uid", uid);
      localStorage.setItem("local_token", token);
      navigator("/set-new-password");
    }
  };

  onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const { locator, navigator, onChange } = this.props.formProps;
    const { password } = this.props.formProps.globalData;
    const hashes = locator.hash.split("/");
    const uid = hashes[1];
    const token = hashes[2];
    if (!uid && !token) {
      const local_uid = localStorage.getItem("local_uid");
      const local_token = localStorage.getItem("local_token");
      if (local_uid && local_token) {
        const responseSetNewPassword = await userService.setNewPassword(
          local_uid,
          local_token,
          password
        );
        if (responseSetNewPassword) {
          notifier.info("Congrats! Your password was successfully changed 😄");
          onChange("", ["account", "password"]);
          navigator("/log-in");
        } else {
          navigator("/reset-password");
        }
      }
      localStorage.removeItem("local_uid");
      localStorage.removeItem("local_token");
      localStorage.removeItem("isSettingNewPassword");
    }
  };

  render() {
    const { password, repeatPassword } = this.props.formProps.globalData;
    const { Self, Text } = this.props.formProps.theme.Form;
    return (
      <div className="form" style={Self}>
        <header>
          <h1 className="title" style={Text.Title}>
            Set New Password
          </h1>
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
