import { Link } from "react-router-dom";
import Form from "./../common/form";
import userService from "../../../services/userService";
import {
  IFormProps,
  EmailPasswordRepeatPassword,
  SchemaEmailPasswordRepeatPassword,
} from "./../common/form";

interface SignupFormProps {
  formProps: IFormProps<
    EmailPasswordRepeatPassword,
    SchemaEmailPasswordRepeatPassword
  >;
}

interface SignupFormState {
  showGoogleAuthText: boolean;
  isButtonDisabled: boolean;
  isSignInOnDefaultStyle: boolean;
}

class SignupForm extends Form<
  EmailPasswordRepeatPassword,
  SchemaEmailPasswordRepeatPassword,
  SignupFormProps,
  SignupFormState
> {
  state = {
    showGoogleAuthText: false,
    isButtonDisabled: true,
    isSignInOnDefaultStyle: true,
  } as SignupFormState;

  specificState = (): {
    data: EmailPasswordRepeatPassword;
    schema: SchemaEmailPasswordRepeatPassword;
  } => {
    return {
      data: {
        email: this.props.formProps.globalData.email,
        password: this.props.formProps.globalData.password,
        repeatPassword: this.props.formProps.globalData.repeatPassword,
      },
      schema: {
        email: this.props.formProps.globalSchema.email,
        password: this.props.formProps.globalSchema.password,
        repeatPassword: this.props.formProps.globalSchema.repeatPassword,
      },
    };
  };

  onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const { email, password } = this.props.formProps.globalData;
    const { shouldSignUpAgain } = this.props.formProps.flags;
    const { navigator } = this.props.formProps;
    let response: boolean = false;
    if (shouldSignUpAgain) {
      response = await userService.resendActivationEmail(email);
    } else {
      response = await userService.createUser(email, password);
    }
    if (response) {
      this.props.formProps.onChange(true, ["flags", "isActivationEmailSent"]);
      navigator("/send-activation-email-link");
    }
  };

  render() {
    const { email, password, repeatPassword } = this.props.formProps.globalData;
    const { isSignInOnDefaultStyle } = this.state;
    const { Self, Text } = this.props.formProps.theme.Form;
    return (
      <div className="form" style={Self}>
        <header>
          <div className="title" style={Text.Title}>
            Sign Up
          </div>
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
                <span className="accountQuestion" style={Text.Question}>
                  Do you have an account?
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
          {this.renderButton("Sign Me Up")}
        </form>
      </div>
    );
  }
}

export default SignupForm;
