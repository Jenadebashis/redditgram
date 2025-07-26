// userReducer.js
import {
  UPDATE_BIO_SUCCESS,
  UPDATE_BIO_FAILURE,
} from "../actions/actionTypes";

const initialState = {
  bio: "",
  bioUpdateStatus: null, // 'success' or 'error'
  error: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_BIO_SUCCESS:
      return { ...state, bio: action.payload.bio, error: null, bioUpdateStatus: "success" };

    case UPDATE_BIO_FAILURE:
      return { ...state, error: action.payload, bioUpdateStatus: "error" };

    default:
      return state;
  }
};

export default userReducer;
