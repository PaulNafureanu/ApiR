import { Link, useNavigate } from "react-router-dom";
import Form from "./../common/form";
import userService from "../../../services/userService";
import { IFormProps, Email, SchemaEmail } from "./../common/form";

interface ResetPasswordFormProps {
  formProps: IFormProps<Email, SchemaEmail>;
}

interface ResetPasswordFormState {
  showGoogleAuthText: boolean;
  isButtonOnDefaultStyle: boolean;
  isSignInOnDefaultStyle: boolean;
}

class ResetPasswordForm extends Form<
  Email,
  SchemaEmail,
  ResetPasswordFormProps,
  ResetPasswordFormState
> {
  state = {
    showGoogleAuthText: false,
    isSignInOnDefaultStyle: true,
    isButtonOnDefaultStyle: true,
  };

  specificState = (): { data: Email; schema: SchemaEmail } => {
    return {
      data: { email: this.props.formProps.globalData.email },
      schema: { email: this.props.formProps.globalSchema.email },
    };
  };

  onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const { email } = this.props.formProps.globalData;
    const { navigator } = this.props.formProps;
    setTimeout(() => {
      this.props.formProps.onChange(true, [
        "flags",
        "isPasswordResetEmailSent",
      ]);
      navigator("/send-password-reset-email-link");
    }, 500);
    const responseResetPass = await userService.resetPassword(email);
    if (!responseResetPass) {
      this.props.formProps.onChange(false, [
        "flags",
        "isPasswordResetEmailSent",
      ]);
      navigator("/reset-password");
    }
  };

  render() {
    const { email } = this.props.formProps.globalData;
    const { isSignInOnDefaultStyle } = this.state;
    const { Self, Text } = this.props.formProps.theme.Form;
    return (
      <div className="form" style={Self}>
        <header>
          <h1 className="title" style={Text.Title}>
            Reset Password
          </h1>
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
                <span className="accountQuestion" style={Text.Question}>
                  Do you remember the password?
                </span>
                {this.renderLink({
                  label: "Log In Here",
                  clasName: "logInText",
                  to: "/log-in",
                  propName: "isSignInOnDefaultStyle",
                  propValue: isSignInOnDefaultStyle,
                  styles: Text.Link.SignInOut,
                })}
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
