import * as React from "react";
import Joi from "joi";
import { Link, Location, NavigateFunction } from "react-router-dom";
import Input from "./input";
import notifier from "./../../../services/notificationService";
import ThemeSetter from "../../themes/themeSetter";
import "./../../../css/log/common/form.css";

export interface Email {
  email: string;
}
export interface Password {
  password: string;
}
export interface EmailPassword {
  email: string;
  password: string;
}
export interface PasswordRepeatPassword {
  password: string;
  repeatPassword: string;
}
export interface EmailPasswordRepeatPassword {
  email: string;
  password: string;
  repeatPassword: string;
}
export interface SchemaEmail {
  email: Joi.StringSchema<string>;
}
export interface SchemaPassword {
  password: Joi.StringSchema<string>;
}
export interface SchemaEmailPassword {
  email: Joi.StringSchema<string>;
  password: Joi.StringSchema<string>;
}
export interface SchemaPasswordRepeatPassword {
  password: Joi.StringSchema<string>;
  repeatPassword: Joi.StringSchema<string>;
}
export interface SchemaEmailPasswordRepeatPassword {
  email: Joi.StringSchema<string>;
  password: Joi.StringSchema<string>;
  repeatPassword: Joi.StringSchema<string>;
}

export interface IFormProps<Type extends Object, SchemaType extends Object> {
  globalData: Type;
  globalSchema: SchemaType;
  errors: {};
  flags: {
    isNotificationPossible: boolean;
    isActivationEmailSent: boolean;
    isPasswordResetEmailSent: boolean;
    isPasswordResetConfirmed: boolean;
    shouldSignUpAgain: boolean;
  };
  navigator: NavigateFunction;
  locator: Location;
  onChange: (value: any, location: string[]) => void;
  theme: ThemeSetter;
}

interface FormProps<Type extends Object, SchemaType extends Object> {
  formProps: IFormProps<Type, SchemaType>;
}

interface FormState {
  showGoogleAuthText: boolean;
  isButtonOnDefaultStyle: boolean;
}

class Form<
  FormType extends Object,
  SchemaType extends Object,
  ExtendedFormProps extends FormProps<FormType, SchemaType>,
  ExtendedFormState extends FormState
> extends React.Component<ExtendedFormProps, ExtendedFormState> {
  componentDidUpdate() {
    this.onSetButtonState();
  }

  specificState = (): { data: FormType; schema: SchemaType } => {
    return {
      data: this.props.formProps.globalData,
      schema: this.props.formProps.globalSchema,
    };
  };

  validate(): null | Object {
    const errors: any = {};
    const { data, schema } = this.specificState();
    const options = { abortEarly: false };
    const { error } = Joi.object(schema).validate(data, options);
    if (!error) return null;
    for (let item of error.details) errors[item.path[0]] = item.message;
    return errors;
  }

  validateProperty(name: string, value: string): null | string {
    const schema: any = this.specificState().schema;
    const object = { [name]: value };
    const schemaProp = { [name]: schema[name] };
    const { error } = Joi.object(schemaProp).validate(object);
    return error ? error.details[0].message : null;
  }

  handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { onChange } = this.props.formProps;
    const errors = this.validate();
    onChange(errors ? errors : {}, ["errors"]);

    if (errors) return;
    this.onSubmit(e);
  }

  onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log("Submitted");
  };

  handleChange(name: string, value: string) {
    const { onChange } = this.props.formProps;
    const errors: any = { ...this.props.formProps.errors };
    const errorMessage = this.validateProperty(name, value);
    if (errorMessage) errors[name] = errorMessage;
    else delete errors[name];
    onChange(errors ? errors : {}, ["errors"]);
    onChange(value, ["account", name]);
  }

  handleNotificationActivation() {
    setTimeout(() => {
      this.props.formProps.onChange(true, ["flags", "isNotificationPossible"]);
    }, 5000);
  }

  onSetButtonState = () => {
    const newState: any = { ...this.state };
    const value = this.validate() ? true : false;
    if (newState["isButtonOnDefaultStyle"] !== value) {
      newState["isButtonOnDefaultStyle"] = value;
      this.setState(newState);
    }
  };

  onSetButtonStyle = (
    propValue: boolean,
    styles: { onDefault: {}; onDisabled: {} }
  ) => {
    return propValue ? styles.onDefault : styles.onDisabled;
  };

  renderButton(label: string) {
    const { Button, Text } = this.props.formProps.theme.Form;
    const { isButtonOnDefaultStyle } = this.state;
    return (
      <div className="buttonForm">
        <div
          className="buttonWrapper"
          onMouseEnter={() => {
            if (this.props.formProps.flags.isNotificationPossible) {
              const errors: any = this.validate();
              if (errors) {
                let errorMessage: string = "";
                errorMessage = errors["repeatPassword"]
                  ? errors["repeatPassword"]
                  : errorMessage;
                errorMessage = errors["password"]
                  ? errors["password"]
                  : errorMessage;
                errorMessage = errors["email"] ? errors["email"] : errorMessage;

                notifier.info(errorMessage);
                this.props.formProps.onChange(false, [
                  "flags",
                  "isNotificationPossible",
                ]);
                this.handleNotificationActivation();
              }
            }
          }}
        >
          <button
            style={this.onSetButtonStyle(isButtonOnDefaultStyle, Button)}
            disabled={this.validate() ? true : false}
          >
            {label}
          </button>
        </div>
        <span style={Text.Details}>
          {this.state.showGoogleAuthText
            ? "*Authorize access to my Google Drive"
            : ""}
        </span>
      </div>
    );
  }

  renderInput(
    value: string,
    label: string,
    spanValue: string,
    inputType = "text",
    autoFocus = false,
    em = false
  ) {
    return (
      <Input
        autoFocus={autoFocus}
        value={value}
        onChange={(v) => this.handleChange(label, v)}
        spanValue={spanValue}
        em={em}
        inputType={inputType}
        theme={this.props.formProps.theme}
      />
    );
  }

  onSetLinkState = (propName: string, value: boolean) => {
    const newState: any = { ...this.state };
    newState[propName] = value;
    this.setState(newState);
  };

  onSetLinkStyle = (
    propValue: boolean,
    styles: { onDefault: {}; onHover: {} }
  ) => {
    return propValue ? styles.onDefault : styles.onHover;
  };

  renderLink(options: {
    label: string;
    clasName: string;
    to: string;
    propName: string;
    propValue: boolean;
    styles: { onDefault: {}; onHover: {} };
  }) {
    const { label, clasName, to, propName, propValue, styles } = options;
    return (
      <Link
        className={clasName}
        to={to}
        onMouseOver={() => {
          this.onSetLinkState(propName, false);
        }}
        onMouseOut={() => {
          this.onSetLinkState(propName, true);
        }}
        style={this.onSetLinkStyle(propValue, styles)}
      >
        {label}
      </Link>
    );
  }
}

export default Form;
