import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Start from "./components/start/start";
import WorkSpace from "./components/workspace/workspace";
import PageNotFound from "./components/pageNotFound";
import notifier from "./services/notificationService";
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
  isNotificationPossible: boolean;
}

function App() {
  //State for the main interactions of the user with the app

  const [appState, setAppState] = React.useState({
    account: { username: "", email: "", password: "", repeatPassword: "" },
    errors: {},
    isUserLoggedIn: false,
    isNotificationPossible: true,
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
        <Route path="/">
          <Route index element={<Navigate to={"/log-in"} />} />
          <Route
            path=":id"
            element={<Start appState={appState} onChange={handleStateChange} />}
          />
        </Route>
        <Route
          path="/workspace"
          element={
            appState.isUserLoggedIn ? (
              <WorkSpace />
            ) : (
              <Navigate to={"/log-in"} />
            )
          }
        />
        <Route path="/not-found" element={<PageNotFound />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;
