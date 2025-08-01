// apiConfigMap.js
import {
  UPDATE_BIO,
  UPDATE_BIO_SUCCESS,
  UPDATE_BIO_FAILURE,
  UPDATE_PROFESSION,
  UPDATE_PROFESSION_SUCCESS,
  UPDATE_PROFESSION_FAILURE,
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
  [UPDATE_PROFESSION]: {
    method: "PUT",
    url: "/profile/bio/",
    data: (profession) => ({ profession }),
    onSuccessType: UPDATE_PROFESSION_SUCCESS,
    onErrorType: UPDATE_PROFESSION_FAILURE,
    toastSuccess: "Profession updated ✅",
    toastError: "Failed to update profession ❌",
  },
};

export const getApiConfig = (actionType) => {
  return apiConfigMap[actionType] || {};
};
