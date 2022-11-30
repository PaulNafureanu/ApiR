import http from "./httpService";
import config from "./config.json";
import notifier from "./notificationService";
import logger from "./logService";

async function createUser(email: string, password: string) {
  try {
    const obj = {
      email: email,
      username: email.split("@")[0],
      password: password,
    };
    const { data: response } = await http.post(
      config.AuthApiEndpoint + "users/",
      obj
    );
    return true;
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      const { data } = error.response;
      logger.log(error);
      if (data["email"])
        notifier.warn("This email address already exists (please log in)");
      if (data["password"]) notifier.info(data["password"][0]);
    }
    return false;
  }
}

async function createJWT(email: string, password: string) {
  try {
    const obj = { username: email.split("@")[0], password: password };
    const { data: response } = await http.post(
      config.AuthApiEndpoint + "jwt/create/",
      obj
    );

    let isRefresh = false,
      isAccess = false;
    if (response["refresh"]) {
      window.localStorage.setItem("refresh", response["refresh"]);
      isRefresh = true;
    }
    if (response["access"]) {
      window.localStorage.setItem("access", response["access"]);
      isAccess = true;
    }

    if (isRefresh && isAccess) return true;
    else
      throw new Error(
        "Refresh token or access token not received from the server."
      );
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      logger.log(error);
      notifier.warn("Email and/or password are invalid.");
    }
    return false;
  }
}

async function resetPassword(email: string) {
  try {
    const obj = { email: email };
    const { data: response } = await http.post(
      config.AuthApiEndpoint + "users/reset_password/",
      obj
    );
    return true;
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      logger.log(error);
      notifier.warn("Something went wrong, try again later.");
    }
    return false;
  }
}

export default { createUser, createJWT, resetPassword };
