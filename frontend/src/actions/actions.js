// actions.js
import {
  UPDATE_BIO,
  UPDATE_BIO_SUCCESS,
  UPDATE_BIO_FAILURE,
  CLEAR_BIO_STATUS,
  UPDATE_PROFESSION,
  UPDATE_PROFESSION_SUCCESS,
  UPDATE_PROFESSION_FAILURE,
  CLEAR_PROFESSION_STATUS,
} from "./actionTypes";

export const updateBio = (payload) => ({
  type: UPDATE_BIO,
  payload, // Just the raw string like "I love coding"
});
export const updateBioSuccess = (bio) => ({
  type: UPDATE_BIO_SUCCESS,
  payload: bio, // The updated bio string
});
export const updateBioFailure = (error) => ({
  type: UPDATE_BIO_FAILURE,
  payload: error, // Error message if the update fails
});

export const clearBioStatus = () => ({
  type: CLEAR_BIO_STATUS,
});

export const updateProfession = (payload) => ({
  type: UPDATE_PROFESSION,
  payload,
});
export const updateProfessionSuccess = (profession) => ({
  type: UPDATE_PROFESSION_SUCCESS,
  payload: profession,
});
export const updateProfessionFailure = (error) => ({
  type: UPDATE_PROFESSION_FAILURE,
  payload: error,
});

export const clearProfessionStatus = () => ({
  type: CLEAR_PROFESSION_STATUS,
});
