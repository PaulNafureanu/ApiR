import * as React from "react";
import { NavigateFunction, useLocation } from "react-router-dom";
import notifier from "../../services/notificationService";
import userService from "./../../services/userService";

interface ActivationPageProps {
  onChange: (value: any, location: string[]) => void;
  navigator: NavigateFunction;
}

const ActivationPage: React.FunctionComponent<ActivationPageProps> = ({
  onChange,
  navigator,
}) => {
  const location = useLocation();

  React.useEffect(() => {
    async function onSubmit() {
      const hashes = location.hash.split("/");
      const uid = hashes[1];
      const token = hashes[2];
      const responseActivateUser = await userService.activateUser(uid, token);
      if (responseActivateUser) {
        localStorage.removeItem("receiveActivationEmail");
        navigator("/log-in");
      }
    }
    onSubmit();
  }, []);

  return (
    <div className="form">
      <header>
        <h1 className="title">Email Activated</h1>
      </header>
      <div className="form">
        <div className="inputFieldWrapper">
          <p> Your email is activated.</p>
        </div>
      </div>
    </div>
  );
};

export default ActivationPage;
