import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Start from "./components/start/start";
import WorkSpace from "./components/workspace/workspace";

import UserProject from "./scripts/UserProject";
import { Tree } from "./scripts/Tree";

function App() {
  //Keyboard listener: TODO
  // window.addEventListener("keypress", (e) => {
  //   console.log(e);
  // });

  return (
    <div className="App">
      {/* <Start /> */}
      <WorkSpace />
    </div>
  );
}

export default App;
