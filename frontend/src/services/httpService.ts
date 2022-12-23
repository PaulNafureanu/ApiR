import axios, { AxiosRequestConfig } from "axios";
import logger from "./logService";
import notifier from "./notificationService";

axios.interceptors.response.use(undefined, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    console.log(error);
    logger.log(error);
    notifier.warn("An unexpected error occurred.");
  }

  return Promise.reject(error);
});

function httpGet(
  url: string,
  config?: AxiosRequestConfig<any>,
  shouldNotify: boolean = true
) {
  const promise = axios.get(url, config);
  if (shouldNotify) notifier.pending(promise);
  return promise;
}

function httpPost(
  url: string,
  data?: any,
  config?: AxiosRequestConfig<any>,
  shouldNotify: boolean = true
) {
  const promise = axios.post(url, data, config);
  if (shouldNotify) notifier.pending(promise);
  return promise;
}

function httpPut(
  url: string,
  data?: any,
  config?: AxiosRequestConfig<any>,
  shouldNotify: boolean = true
) {
  const promise = axios.put(url, data, config);
  if (shouldNotify) notifier.pending(promise);
  return promise;
}

function httpDelete(
  url: string,
  config?: AxiosRequestConfig<any>,
  shouldNotify: boolean = true
) {
  const promise = axios.delete(url, config);
  if (shouldNotify) notifier.pending(promise);
  return promise;
}

export default {
  get: httpGet,
  post: httpPost,
  put: httpPut,
  delete: httpDelete,
};
