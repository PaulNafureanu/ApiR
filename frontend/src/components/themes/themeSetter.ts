import Theme from "./theme";
import defaultTheme from "./presets/defaultTheme";

class ThemeSetter {
  Start = {
    Static: { cursor: "", backgroundColor: "", backgroundImage: "" },
    VfxLantern: { backgroundColor: "", backgroundImage: "" },
  };
  FormWrapper = {
    Container: { background: "" },
    BeforeRay: { background: "" },
    AfterRay: { background: "" },
  };
  Form = {
    Self: { backgroundColor: "" },
    Info: { Text: { color: "" } },
    Text: {
      Title: { color: "" },
      Question: { color: "" },
      Link: {
        PasswordReset: {
          onDefault: { color: "", cursor: "" },
          onHover: { color: "", cursor: "" },
        },
        SignInOut: {
          onDefault: { color: "", cursor: "" },
          onHover: { color: "", cursor: "" },
        },
      },
      Details: { color: "" },
    },
    Button: {
      onDefault: { cursor: "", color: "", backgroundColor: "" },
      onDisabled: { cursor: "", color: "", backgroundColor: "" },
    },
  };

  Input = {
    Self: {
      onDefault: { backgroundColor: "", color: "", border: "" },
      onFocus: { backgroundColor: "", color: "", border: "" },
    },
    Label: {
      onDefault: { backgroundColor: "", color: "", border: "" },
      onFocus: { backgroundColor: "", color: "", border: "" },
      onEmphasize: { backgroundColor: "", color: "", border: "" },
    },
  };

  static init(theme: Theme = defaultTheme) {
    return new ThemeSetter(theme);
  }

  constructor(theme: Theme) {
    this._start(theme);
    this._formWrapper(theme);
    this._form(theme);
    this._input(theme);
  }

  private _start(theme: Theme) {
    //Setting the theme for the react Start component
    const { color, texture } = theme.log.background.static;
    const { rayColor, rayTexture } = theme.log.background.vfxLantern;
    this.Start.Static.backgroundColor = color;
    this.Start.Static.cursor = theme.all.cursor.general;
    this.Start.Static.backgroundImage = texture;
    this.Start.VfxLantern.backgroundColor = rayColor;
    this.Start.VfxLantern.backgroundImage = rayTexture;
  }

  private _formWrapper(theme: Theme) {
    //Setting the theme for the react FormWrapper component
    const { background, color } = theme.log.form.Ray;
    this.FormWrapper.Container.background = background;
    this.FormWrapper.AfterRay.background = color;
    this.FormWrapper.BeforeRay.background = color;
  }

  private _form(theme: Theme) {
    //Setting the theme for the react Form component
    const { Self, Info, Text, Button } = theme.log.form;
    const { PasswordReset, SignInOut } = Text.Link;
    const { cursor } = theme.all;
    this.Form.Self.backgroundColor = Self.background;
    this.Form.Info = Info;
    this.Form.Text.Title = Text.Title;
    this.Form.Text.Question = Text.Question;
    this.Form.Text.Link.PasswordReset.onDefault.color =
      PasswordReset.onDefault.color;
    this.Form.Text.Link.PasswordReset.onDefault.cursor = cursor.general;
    this.Form.Text.Link.PasswordReset.onHover.color =
      PasswordReset.onHover.color;
    this.Form.Text.Link.PasswordReset.onHover.cursor = cursor.pointer;
    this.Form.Text.Link.SignInOut.onDefault.color = SignInOut.onDefault.color;
    this.Form.Text.Link.SignInOut.onDefault.cursor = cursor.general;
    this.Form.Text.Link.SignInOut.onHover.color = SignInOut.onHover.color;
    this.Form.Text.Link.SignInOut.onHover.cursor = cursor.pointer;
    this.Form.Text.Details = Text.Details;
    this.Form.Button.onDefault.color = Button.onDefault.color;
    this.Form.Button.onDefault.backgroundColor =
      Button.onDefault.backgroundColor;
    this.Form.Button.onDefault.cursor = cursor.pointer;
    this.Form.Button.onDisabled.color = Button.onDisabled.color;
    this.Form.Button.onDisabled.backgroundColor =
      Button.onDisabled.backgroundColor;
    this.Form.Button.onDisabled.cursor = cursor.general;
  }

  private _input(theme: Theme) {
    //Setting the theme for the react Input component
    this.Input = theme.log.Input;
  }
}

export default ThemeSetter;
