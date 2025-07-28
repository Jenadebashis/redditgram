// actions.js
import {
  UPDATE_BIO,
  UPDATE_BIO_SUCCESS,
  UPDATE_BIO_FAILURE,
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
