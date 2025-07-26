import API from "./api";
import { apiConfigMap } from "./actions/apiConfigMap";
import { toast } from "react-toastify";

export const apiMiddleware = (store) => (next) => async (action) => {
  const config = apiConfigMap[action.type];

  if (!config) return next(action);

  const {
    method,
    url,
    data, // optional transformer
    onStartType,
    onSuccessType,
    onErrorType,
    toastSuccess,    // optional toast message
    toastError,      // optional toast message
  } = config;

  const payload = data ? data(action.payload) : action.payload;

  if (onStartType) {
    store.dispatch({ type: onStartType });
  }

  try {
    const response = await API({ method, url, data: payload });

    store.dispatch({ type: onSuccessType, payload: response.data });

    if (toastSuccess) {
      toast.success(toastSuccess); // ✅ show success toast
    }
  } catch (error) {
    store.dispatch({
      type: onErrorType,
      payload: error.response?.data || error.message,
    });

    if (toastError) {
      toast.error(
        typeof toastError === "string"
          ? toastError
          : error.response?.data?.detail || "Something went wrong"
      );
    }
  }
};
