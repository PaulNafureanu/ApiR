import { Link, useNavigate } from "react-router-dom";
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
}

class LoginForm extends Form<
  EmailPassword,
  SchemaEmailPassword,
  LoginFormProps,
  LoginFormState
> {
  state = {
    showGoogleAuthText: true,
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
    const responseCreateJWT = await userService.createJWT(email, password);
    if (responseCreateJWT) {
      localStorage.setItem("isUserLoggedIn", "true");
      navigator("/workspace");
    }
  };

  render() {
    const { email, password } = this.props.formProps.globalData;
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
