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
  isUserLoggedIn: boolean;
}

export function returnAppState(obj: any): AppState {
  return obj;
}

function App() {
  const [appState, setAppState] = React.useState(
    returnAppState({
      account: { username: "", email: "", password: "", repeatPassword: "" },
      isUserLoggedIn: false,
    })
  );

  function handleStateChange(value: any, location: string[]) {
    // "Leo", ["account", "username"]
    let newAppState: AppState = structuredClone(appState);
    const len = location.length;

    function recursion(state: any, i: number): any {
      if (Object.keys(state).includes(location[i])) {
        if (i === len - 1) {
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
      newAppState = returnAppState(recursion(newAppState, 0));
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
