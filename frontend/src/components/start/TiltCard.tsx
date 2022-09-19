import * as React from "react";
import VanillaTilt, { TiltOptions } from "vanilla-tilt";
import "./../../css/TiltCard.css";
import InputField from "./inputField";

interface TiltProps {
  options?: TiltOptions;
  cssId?: string;
  cssClass?: string;
}

const TiltCard: React.FunctionComponent<TiltProps> = ({
  options,
  cssId,
  cssClass = "Tilt",
}) => {
  const tiltRef = React.createRef<HTMLDivElement>();
  const [isLoginIn, setLoginIn] = React.useState(true);

  React.useEffect(() => {
    VanillaTilt.init(tiltRef.current!);
  }, []);

  function returnUserInForm(isLoginIn: boolean) {
    let bodyForm, titleName;
    if (isLoginIn) {
      titleName = "Log In";
      bodyForm = (
        <React.Fragment>
          <div className="inputForm">
            <InputField value="Enter Email" em={true} />
            <div className="p">
              <InputField value="Enter Password" inputType="password" />
              <div className="s">
                <span className="fp">Forget Password?</span>
                <span className="sgnUp">Sign Up Here</span>
              </div>
            </div>
          </div>
          <div className="buttonForm">
            <button>Log Me In*</button>
            <span>*Authorize access to my Google Drive</span>
          </div>
        </React.Fragment>
      );
    } else {
      titleName = "Sign Up";
      bodyForm = (
        <React.Fragment>
          <div className="inputForm">
            <InputField value="Enter Email" em={true} />
            <InputField value="Enter Password" inputType="password" />
            <div className="p">
              <InputField value="Repeat Password" inputType="password" />
              <div className="s">
                <span className="a">Do you have an account?</span>
                <span className="sgnUp"> Log In Here</span>
              </div>
            </div>
          </div>
          <div className="buttonForm">
            <button>Sign Me Up*</button>
            <span>*Authorize access to my Google Drive</span>
          </div>
        </React.Fragment>
      );
    }

    return (
      <div className="userIn">
        <header>
          <div className="title">{titleName}</div>
        </header>
        <main>{bodyForm}</main>
      </div>
    );
  }

  return (
    <div id={cssId} className={cssClass} ref={tiltRef} {...options}>
      <div className="container">{returnUserInForm(isLoginIn)}</div>
    </div>
  );
};

export default TiltCard;
