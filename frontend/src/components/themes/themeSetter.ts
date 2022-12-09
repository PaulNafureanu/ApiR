import Theme from "./theme";
import { defaultTheme } from "./collection/defaultTheme";

class ThemeSetter {
  Start = { cursor: "", backgroundColor: "", backgroundImage: "" };

  static init(theme: Theme = defaultTheme) {
    return new ThemeSetter(theme);
  }

  constructor(theme: Theme) {
    this._start(theme);
  }

  private _start(theme: Theme) {
    //Setting the theme for the react Start component
    this.Start.backgroundColor = theme.log.background.static.color;
    this.Start.cursor = `url(${theme.all.cursor.general}), auto`;
    this.Start.backgroundImage = `url("${theme.log.background.static.texture}")`;
  }
}

export default ThemeSetter;
