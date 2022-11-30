import * as React from "react";
import { AppState } from "../../App";
import FormWrapper from "./formWrapper";
import vfx from "./../../services/vfxService";
import "./../../css/start.css";

interface StartProps {
  appState: AppState;
  onChange: (value: any, location: string[]) => void;
}

const Start: React.FunctionComponent<StartProps> = ({ appState, onChange }) => {
  //State for the visual effects on the login/registration page
  const startRef = React.createRef<HTMLDivElement>();
  const [bgStyle, setBgStyle] = React.useState(vfx.backgroundStyle);
  const [circleSize, setCircleSize] = React.useState(80);

  //The lantern effect
  React.useEffect(() => {
    vfx.useLanternVFX(startRef, bgStyle, setBgStyle, circleSize, setCircleSize);
  });

  return (
    <div id="Start" ref={startRef}>
      <div className="bg" style={bgStyle} />
      <FormWrapper appState={appState} onChange={onChange} />
      <div className="bot">
        <div className="img"></div>
      </div>
    </div>
  );
};

export default Start;
