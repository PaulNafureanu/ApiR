import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Start from "./components/log/start";
import notifier from "./services/notificationService";
import "./App.css";
import Workspace from "./components/workspace/workspace";
import ThemeSetter from "./components/themes/themeSetter";

export interface AppState {
  isUserLoggedIn: boolean;
  theme: ThemeSetter;
}

function App() {
  //State for the main interactions of the user with the app

  const [appState, setAppState] = React.useState({
    isUserLoggedIn: false,
    theme: ThemeSetter.init(),
  } as AppState);

  // App State Modification. Example of a call: handleStateChange("Leo", ["account", "username"]);
  function handleStateChange<Type>(value: Type, location: string[]) {
    let newAppState = structuredClone(appState) as AppState;
    const len = location.length;

    function recursion(state: any, i: number): any {
      if (Object.keys(state).includes(location[i])) {
        if (i === len - 1) {
          if (typeof value !== typeof state[location[i]]) {
            console.error(
              "App.handleStateChange:: Type not identical for value " +
                value +
                "and parameter " +
                location[i]
            );
            return state;
          }
          state[location[i]] = value;
          return state;
        } else {
          state[location[i]] = recursion(state[location[i]], ++i);
          return state;
        }
      } else {
        console.error(
          "App.handleStateChange:: No property found with the name " +
            location[i] +
            "at depth " +
            i
        );
        return state;
      }
    }

    if (len > 0) {
      newAppState = recursion(newAppState, 0) as AppState;
      setAppState(newAppState);
    }
  }
  return (
    <div className="App">
      {notifier.init()}
      <Routes>
        <Route index element={<Navigate to={"/log-in"} />} />
        <Route path="/">
          <Route path=":id" element={<Start appState={appState} />} />
        </Route>
        <Route path="/workspace" element={<Workspace />} />
        <Route path="*" element={<Navigate to={"/page-not-found"} />} />
      </Routes>
    </div>
  );
}

export default App;
