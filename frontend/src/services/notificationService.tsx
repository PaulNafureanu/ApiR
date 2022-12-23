import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function init() {
  return (
    <ToastContainer
      position="bottom-right"
      autoClose={5000}
      limit={1}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
    />
  );
}

function warn(
  message: string,
  options: Object = {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  }
) {
  toast.warn(message, options);
}

function info(
  message: string,
  options: Object = {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  }
) {
  toast.info(message, options);
}

function success(
  message: string,
  options: Object = {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  }
) {
  toast.success(message, options);
}

function pending<Type>(promise: Promise<Type>) {
  toast.promise(promise, {
    pending: "Request is pending . . .",
  });
}

export default {
  init,
  warn,
  info,
  success,
  pending,
};
