// apiConfigMap.js
import {
  UPDATE_BIO,
  UPDATE_BIO_SUCCESS,
  UPDATE_BIO_FAILURE,
} from "./actionTypes";

export const apiConfigMap = {
  [UPDATE_BIO]: {
    method: "PUT",
    url: "/profile/bio/", // Example endpoint
    data: (bio) => ({ bio }), // Converts raw string to object
    onSuccessType: UPDATE_BIO_SUCCESS,
    onErrorType: UPDATE_BIO_FAILURE,
    toastSuccess: "Bio updated ✅",
    toastError: "Failed to update bio ❌",
  },
};

export const getApiConfig = (actionType) => {
  return apiConfigMap[actionType] || {};
};