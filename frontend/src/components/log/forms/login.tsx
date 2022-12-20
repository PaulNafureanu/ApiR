import Form, {
  IFormProps,
  EmailPassword,
  SchemaEmailPassword,
} from "./../common/form";
import userService from "../../../services/userService";

interface LoginFormProps {
  formProps: IFormProps<EmailPassword, SchemaEmailPassword>;
}

interface LoginFormState {
  showGoogleAuthText: boolean;
  isPasswordResetOnDefaultStyle: boolean;
  isSignUpOnDefaultStyle: boolean;
  isButtonOnDefaultStyle: boolean;
}

class LoginForm extends Form<
  EmailPassword,
  SchemaEmailPassword,
  LoginFormProps,
  LoginFormState
> {
  state = {
    showGoogleAuthText: true,
    isPasswordResetOnDefaultStyle: true,
    isSignUpOnDefaultStyle: true,
    isButtonOnDefaultStyle: true,
  };

  specificState = (): { data: EmailPassword; schema: SchemaEmailPassword } => {
    return {
      data: {
        email: this.props.formProps.globalData.email,
        password: this.props.formProps.globalData.password,
      },
      schema: {
        email: this.props.formProps.globalSchema.email,
        password: this.props.formProps.globalSchema.password,
      },
    };
  };

  onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const { email, password } = this.props.formProps.globalData;
    const { navigator } = this.props.formProps;
    const response = await userService.GoogleAPIAuth();
    // const responseCreateJWT = await userService.createJWT(email, password);
    // if (responseCreateJWT) {
    //   localStorage.setItem("isUserLoggedIn", "true");
    //   navigator("/workspace");
    // }
  };

  render() {
    const { email, password } = this.props.formProps.globalData;
    const { Self, Text } = this.props.formProps.theme.Form;
    const { isPasswordResetOnDefaultStyle, isSignUpOnDefaultStyle } =
      this.state;
    return (
      <div className="form" style={Self}>
        <header>
          <h1 className="title" style={Text.Title}>
            Log in
          </h1>
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
                {this.renderLink({
                  label: "Forget Password?",
                  clasName: "forgetPasswordOption",
                  to: "/reset-password",
                  propName: "isPasswordResetOnDefaultStyle",
                  propValue: isPasswordResetOnDefaultStyle,
                  styles: Text.Link.PasswordReset,
                })}
                {this.renderLink({
                  label: "Sign Up Here",
                  clasName: "signUpText",
                  to: "/sign-up",
                  propName: "isSignUpOnDefaultStyle",
                  propValue: isSignUpOnDefaultStyle,
                  styles: Text.Link.SignInOut,
                })}
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
