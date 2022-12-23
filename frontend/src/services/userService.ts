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
    } else if (
      error.response &&
      error.response.status >= 400 &&
      error.response.status < 500
    ) {
      notifier.warn("An unexpected error occurred.");
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

    notifier.success("User created. It needs activation (verify email) 👌.");
    return true;
  } catch (error: any) {
    logger.log(error);
    if (error.response && error.response.status === 400) {
      const { data } = error.response;
      if (data["email"])
        notifier.warn("This email address already exists (please log in)");
      if (data["password"]) notifier.info(data["password"][0]);
    } else if (error.response.status >= 400 && error.response.status < 500) {
      notifier.warn("An unexpected error occurred, please retry.");
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
    notifier.success("Activation email resent to your gmail address 👌.");
    return true;
  } catch (error: any) {
    if (
      error.response &&
      error.response.status >= 400 &&
      error.response.status < 500
    ) {
      logger.log(error);
      notifier.warn("Something went wrong, please retry later.");
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
      notifier.warn(
        "An error has occured on activation, please retry to sign up."
      );
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
    notifier.success("Reset password email sent to your gmail address 👌.");
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

// Google Api endpoint:

async function GoogleAPIAuth(accessToken: string) {
  let url = "";
  let name = "";
  let params = `width=0,height=0,left=-1000,top=-1000`;

  try {
    const { data: response } = await http.get(
      config.GoogleApiEndpoint + "authorize",
      { headers: { Authorization: `JWT ${accessToken}` } },
      false
    );
    url = response["data"];
    if (url) {
      let GAuthWin = window.open(url, name, params);
      if (GAuthWin) {
        const wait = (ms: number) =>
          new Promise((resolve) => setTimeout(resolve, ms));

        let result = undefined;
        while (!result) {
          result = await wait(250).then(() => {
            if (GAuthWin?.closed) {
              return true;
            } else return false;
          });
        }

        return result;
      } else {
        notifier.warn(
          "The Google authentication window can not be opened. Please check / enable popup options and retry."
        );
        throw new Error("The Google authentication window can not be opened.");
      }
    } else {
      notifier.success(response);
      return true;
    }
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      logger.log(error);
      notifier.warn(
        "Authentication token and/or credentials were not provided, please retry to log in."
      );
    } else if (
      error.response &&
      error.response.status === 400 &&
      error.response.status < 500
    ) {
      logger.log(error);
      notifier.warn(
        "An error has occured on Google authorization, please retry to log in."
      );
    }
    return false;
  }
}

async function GoogleAPIRevoke() {
  try {
    const { data: response } = await http.get(
      config.GoogleApiEndpoint + "revoke"
    );
    console.log(response);
    return true;
  } catch (error) {
    return false;
  }
}

async function GoogleAPIClear() {
  try {
    const { data: response } = await http.get(
      config.GoogleApiEndpoint + "clear"
    );
    console.log(response);
    return true;
  } catch (error) {
    return false;
  }
}

// Test Endpoints:

async function test(accessToken: string) {
  let url = "";
  let name = "";
  let params = `width=0,height=0,left=-1000,top=-1000`;

  try {
    const { data: response } = await http.get(
      config.GoogleApiEndpoint + "test",
      {
        headers: {
          Authorization: `JWT ${accessToken}`,
        },
      }
    );
    console.log(response);
    url = response["data"];
    if (url) window.open(url, name, params);
    return true;
  } catch (error) {
    return false;
  }
}

async function me(accessToken: string) {
  try {
    const { data: response } = await http.get(
      config.AuthApiEndpoint + "users/me",
      { headers: { Authorization: `JWT ${accessToken}` } }
    );
    console.log("me: ", response);
    return true;
  } catch (error) {
    return false;
  }
}

async function x() {
  // const response = await http.get(
  //   "https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=511154618463-kj05oholr9g7k8kl9nh823d6ac5a9obf.apps.googleusercontent.com&redirect_uri=http%3A%2F%2F127.0.0.1%3A8000%2FGoogleAPI%2Foauth2callback%2F&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive.file&state=uPWIj6Xoh4ysv3gWFgpTnOBuz8O5aM&access_type=offline&include_granted_scopes=true",
  //   {
  //     headers: {
  //       "Access-Control-Allow-Origin":
  //         "https://accounts.google.com/o/oauth2/auth",
  //     },
  //   }
  // );
  // console.log("r", response);
}

//TODO: delete and clear acc
export default {
  createUser,
  activateUser,
  resendActivationEmail,
  createJWT,
  refreshJWT,
  verifyJWT,
  resetPassword,
  setNewPassword,
  GoogleAPIAuth,
  GoogleAPIRevoke,
  GoogleAPIClear,
  test,
  me,
  x,
};
