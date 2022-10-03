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

  let tree = new Tree();
  let result = Tree.createNode("1f", "0", tree);
  if (result) {
    result = Tree.createNode("2f", "0", result);
  }
  if (result) {
    result = Tree.createNode("3f", "2f", result);
  }
  if (result) {
    result = Tree.createNode("4f", "2f", result);
  }

  if (result) {
    result = Tree.deleteNode("2f", result);
  }

  if (result) {
    result = Tree.deleteNode("3f", result);
  }

  console.log(result);

  return (
    <div className="App">
      {/* <Start /> */}
      {/* <WorkSpace /> */}
    </div>
  );
}

export default App;
