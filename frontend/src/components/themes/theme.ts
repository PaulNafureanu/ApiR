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
      border: { staticColor: string; rayColor: string };
      text: { title: { color: string }; link: { color: string } };
      input: {
        border: { color: string };
        background: { color: string };
        text: { color: string };
        label: {
          fill: { background: { color: string }; text: { color: string } };
          empty: { border: { color: string }; text: { color: string } };
        };
      };
      button: {
        active: { text: { color: string }; background: { color: string } };
        disabled: { text: { color: string }; background: { color: string } };
      };
    };
  };
}
