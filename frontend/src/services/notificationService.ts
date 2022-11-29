import { toast } from "react-toastify";

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

export default {
  warn,
  info,
};
