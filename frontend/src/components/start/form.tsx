import * as React from "react";
import notifier from "./../../services/notificationService";
import Joi from "joi";
import InputField from "./inputField";

interface FormProps {
  data: {};
  errors: {};
  isNotificationPossible: boolean;
  onChange: (value: any, location: string[]) => void;
}

interface FormState {
  schema: {};
  showAuthText: boolean;
}

class Form<
  ExtendedFormProps extends FormProps,
  ExtendedFormState extends FormState
> extends React.Component<ExtendedFormProps, ExtendedFormState> {
  validate(): null | Object {
    const errors: any = {};
    const { data } = this.props;
    const { schema } = this.state;
    const options = { abortEarly: false };
    const { error } = Joi.object(schema).validate(data, options);
    if (!error) return null;
    for (let item of error.details) errors[item.path[0]] = item.message;
    return errors;
  }

  validateProperty(name: string, value: string): null | string {
    const schema: any = this.state.schema;
    const object = { [name]: value };
    const schemaProp = { [name]: schema[name] };
    const { error } = Joi.object(schemaProp).validate(object);
    return error ? error.details[0].message : null;
  }

  handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { onChange } = this.props;
    const errors = this.validate();
    onChange(errors ? errors : {}, ["errors"]);

    if (errors) return;
    this.onSubmit(e);
  }

  onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log("Submitted");
  };

  handleChange(name: string, value: string) {
    const { onChange } = this.props;
    const errors: any = { ...this.props.errors };
    const errorMessage = this.validateProperty(name, value);
    if (errorMessage) errors[name] = errorMessage;
    else delete errors[name];
    onChange(errors ? errors : {}, ["errors"]);
    onChange(value, ["account", name]);
  }

  handleNotificationActivation() {
    setTimeout(() => {
      this.props.onChange(true, ["isNotificationPossible"]);
    }, 5000);
  }

  renderButton(label: string) {
    return (
      <div className="buttonForm">
        <div
          className="buttonWrapper"
          onMouseEnter={() => {
            if (this.props.isNotificationPossible) {
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

                this.props.onChange(false, ["isNotificationPossible"]);
                this.handleNotificationActivation();
              }
            }
          }}
        >
          <button disabled={this.validate() ? true : false}>{label}</button>
        </div>
        <span>
          {this.state.showAuthText
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
      <InputField
        autoFocus={autoFocus}
        value={value}
        onChange={(v) => this.handleChange(label, v)}
        spanValue={spanValue}
        em={em}
        inputType={inputType}
      />
    );
  }
}

export default Form;
