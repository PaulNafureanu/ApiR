import { Link, useNavigate } from "react-router-dom";
import Form from "./../common/form";
import userService from "../../../services/userService";
import { IFormProps, Email, SchemaEmail } from "./../common/form";

interface ResetPasswordFormProps {
  formProps: IFormProps<Email, SchemaEmail>;
}

interface ResetPasswordFormState {
  showGoogleAuthText: boolean;
}

class ResetPasswordForm extends Form<
  Email,
  SchemaEmail,
  ResetPasswordFormProps,
  ResetPasswordFormState
> {
  state = {
    showGoogleAuthText: false,
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
