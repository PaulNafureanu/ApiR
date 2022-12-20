import Joi from "joi";
import { NavigateFunction } from "react-router-dom";
import notifier from "../../services/notificationService";
import userService from "../../services/userService";
import { SchemaEmailPasswordRepeatPassword } from "./common/form";
import { InfoProps } from "./common/info";

export default {
  schema: {
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com"] } })
      .required()
      .label("Email")
      .regex(/gmail/i)
      .message('"Email" should be a Google account (gmail)'),
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
  } as SchemaEmailPasswordRepeatPassword,
  infoProps_SendActivEmailLink: {
    title: "Verify your email",
    subtitle: "Activation link was sent to your email",
    text: "Registration form was submitted. The account was created successfully. Check your email to activate your account and then you can log in.",
    linkText: "Resend activation link",
    onSubmit: ({ email }) => {
      if (email) userService.resendActivationEmail(email);
    },
    onEffect: (params) => {
      localStorage.setItem("isActivationConfirmed", "true");
    },
    funcParams: { email: "", navigator: undefined, locator: undefined },
    theme: {},
  } as InfoProps,
  infoProps_ConfirmActivation: {
    title: "Account activated",
    subtitle: "",
    text: "Your account and email was verified. You can now log in.",
    onEffect: ({ navigator, locator, onChange }) => {
      if (locator && navigator && onChange) {
        const hashes = locator.hash.split("/");
        const uid = hashes[1];
        const token = hashes[2];
        if (uid && token) {
          localStorage.setItem("local_uid", uid);
          localStorage.setItem("local_token", token);
          return "/confirm-activation";
        } else {
          const local_uid = localStorage.getItem("local_uid");
          const local_token = localStorage.getItem("local_token");
          if (local_uid && local_token) {
            const promise = userService.activateUser(local_uid, local_token);
            promise.then((responseActivateUser) => {
              if (!responseActivateUser) {
                onChange(true, ["flags", "shouldSignUpAgain"]);
              } else {
                notifier.info(
                  "Congrats! Your account was successfully activated 😄"
                );
              }
            });
          }
          localStorage.removeItem("local_uid");
          localStorage.removeItem("local_token");
          localStorage.removeItem("isActivationConfirmed");
          return "/log-in";
        }
      }
    },
    question: "Do you want to log in?",
    linkText: "Log in here",
    theme: {},
    onSubmit: (navigator: NavigateFunction) => {
      navigator("/log-in");
    },
    funcParams: { email: "", navigator: undefined, locator: undefined },
  } as InfoProps,
  infoProps_SendPWResetEmailLink: {
    title: "Check your email",
    subtitle: "A password reset link was sent",
    text: "The form was submitted. Check your email, click the password reset link, set a new password and log in.",
    linkText: "Resend email",
    theme: {},
    onSubmit: ({ email }) => {
      if (email) userService.resetPassword(email);
    },
    onEffect: (params) => {
      localStorage.setItem("isSettingNewPassword", "true");
    },
    funcParams: { email: "", navigator: undefined, locator: undefined },
  } as InfoProps,
  infoProps_ConfirmPWReset: {
    theme: {},
    onSubmit: (navigator: NavigateFunction) => {
      navigator("/log-in");
    },
  } as InfoProps,
  infoProps_PageNotFound: {
    title: "Page not found",
    subtitle: "",
    text: "This page doesn't exist! Either this link is broken, or the page have been (re)moved. Please check the URL link.",
    linkText: "Log in here",
    question: "Do you want to log in?",
    theme: {},
    onSubmit: (params) => {},
  } as InfoProps,
};
