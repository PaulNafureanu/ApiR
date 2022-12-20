export default interface Theme {
  all: {
    cursor: { general: string; pointer: string };
  };
  log: {
    background: {
      static: { color: string; texture: string };
      vfxLantern: { rayColor: string; rayTexture: string };
    };
    form: {
      Ray: { background: string; color: string };
      Self: { background: string };
      Info: { Text: { color: string } };
      Text: {
        Title: { color: string };
        Question: { color: string };
        Link: {
          PasswordReset: {
            onDefault: { color: string };
            onHover: { color: string };
          };
          SignInOut: {
            onDefault: { color: string };
            onHover: { color: string };
          };
        };
        Details: { color: string };
      };
      Button: {
        onDefault: { color: string; backgroundColor: string };
        onDisabled: { color: string; backgroundColor: string };
      };
    };
    Input: {
      Self: {
        onDefault: { backgroundColor: string; color: string; border: string };
        onFocus: { backgroundColor: string; color: string; border: string };
      };
      Label: {
        onDefault: { backgroundColor: string; color: string; border: string };
        onFocus: { backgroundColor: string; color: string; border: string };
        onEmphasize: { backgroundColor: string; color: string; border: string };
      };
    };
  };
}
