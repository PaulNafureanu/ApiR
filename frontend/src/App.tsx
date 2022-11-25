import React from "react";
import Start from "./components/start/start";
import WorkSpace from "./components/workspace/workspace";
import "./App.css";

export interface AppState {
  account: {
    username: string;
    email: string;
    password: string;
    repeatPassword: string;
  };
  errors: {};
  isUserLoggedIn: boolean;
}

function App() {
  //State for the main interactions of the user with the app

  const [appState, setAppState] = React.useState({
    account: { username: "", email: "", password: "", repeatPassword: "" },
    errors: {},
    isUserLoggedIn: false,
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
      {appState.isUserLoggedIn ? (
        <WorkSpace />
      ) : (
        <Start appState={appState} onChange={handleStateChange} />
      )}
    </div>
  );
}

export default App;
