import http from "./httpService";
import config from "./config.json";
import notifier from "./notificationService";
import logger from "./logService";

//Log-in endpoint:

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

async function refreshJWT(refreshToken: string) {
  try {
    const obj = { refresh: refreshToken };
    const { data: response } = await http.post(
      config.AuthApiEndpoint + "jwt/verify/",
      obj
    );
    let isAccess = false;
    if (response["access"]) {
      window.localStorage.setItem("access", response["access"]);
      isAccess = true;
    }
    if (isAccess) {
      return true;
    } else {
      throw new Error(
        "Refresh token or access token not valid from the server."
      );
    }
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      notifier.warn("Please log in.");
    }
    return false;
  }
}

async function verifyJWT(accessToken: string): Promise<boolean> {
  try {
    const obj = { token: accessToken };
    const { data: response } = await http.post(
      config.AuthApiEndpoint + "jwt/verify/",
      obj
    );
    return true;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      let refreshToken = localStorage.getItem("refresh");
      if (refreshToken) {
        refreshJWT(refreshToken);
        let accessToken = localStorage.getItem("access");
        if (accessToken) {
          return verifyJWT(accessToken);
        }
      }
    }
    return false;
  }
}

//Sign-up endpoint:

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
    console.log("Create user: ", response);
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

async function resendActivationEmail(email: string) {
  try {
    const obj = { email: email };
    const { data: response } = await http.post(
      config.AuthApiEndpoint + "users/resend_activation/",
      obj
    );
    return true;
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      logger.log(error);
      notifier.warn("Something went wrong, please try later.");
    }
    return false;
  }
}

async function activateUser(uid: string, token: string) {
  try {
    const obj = { uid: uid, token: token };
    const { data: response } = await http.post(
      config.AuthApiEndpoint + "users/activation/",
      obj
    );
    return true;
  } catch (error: any) {
    if (
      error.response &&
      error.response.status === 400 &&
      error.response.status < 500
    ) {
      logger.log(error);
      notifier.warn("Something went wrong, please try later.");
    }
    return false;
  }
}

//Reset-password endpoint:

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

async function setNewPassword(uid: string, token: string, password: string) {
  try {
    const obj = { uid: uid, token: token, password: password };
    const { data: response } = await http.post(
      config.AuthApiEndpoint + "users/reset_password_confirm/",
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

export default {
  createUser,
  activateUser,
  resendActivationEmail,
  createJWT,
  refreshJWT,
  verifyJWT,
  resetPassword,
  setNewPassword,
};
