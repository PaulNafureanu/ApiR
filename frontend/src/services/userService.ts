import http from "./httpService";
import config from "./config.json";

export async function registerUser(email: string, password: string) {
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

    return loginUser(obj.email, obj.password);
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function loginUser(email: string, password: string) {
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

    return isRefresh && isAccess;
  } catch (error) {
    console.error(error);
    return false;
  }
}
