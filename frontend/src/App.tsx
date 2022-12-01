import React from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Start from "./components/start/start";
import WorkSpace from "./components/workspace/workspace";
import PageNotFound from "./components/pageNotFound";
import notifier from "./services/notificationService";
import "./App.css";
import ProtectedRoute from "./components/protectedRoute";

export interface AppState {
  account: {
    username: string;
    email: string;
    password: string;
    repeatPassword: string;
  };
  errors: {};
  isRegistrationSent: boolean;
  isSettingNewPassword: boolean;
  isUserLoggedIn: boolean;
  isNotificationPossible: boolean;
}

function App() {
  //State for the main interactions of the user with the app

  const [appState, setAppState] = React.useState({
    account: { username: "", email: "", password: "", repeatPassword: "" },
    errors: {},
    isRegistrationSent: false,
    isSettingNewPassword: false,
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

  //Render (protected) routes
  const renderCurrentElement = (
    <ProtectedRoute
      appState={appState}
      element={
        useLocation().pathname === "/workspace" ? (
          <WorkSpace appState={appState} onChange={handleStateChange} />
        ) : (
          <Start appState={appState} onChange={handleStateChange} />
        )
      }
    />
  );

  return (
    <div className="App">
      {notifier.init()}
      <Routes>
        <Route index element={<Navigate to={"/log-in"} />} />
        <Route path="/">
          <Route path=":id" element={renderCurrentElement} />
        </Route>
        <Route path="/not-found" element={<PageNotFound />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;
