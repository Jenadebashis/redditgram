// userReducer.js
import {
  UPDATE_BIO_SUCCESS,
  UPDATE_BIO_FAILURE,
  CLEAR_BIO_STATUS,
  UPDATE_PROFESSION_SUCCESS,
  UPDATE_PROFESSION_FAILURE,
  CLEAR_PROFESSION_STATUS,
} from "../actions/actionTypes";

const initialState = {
  bio: "",
  profession: "",
  bioUpdateStatus: null, // 'success' or 'error'
  professionUpdateStatus: null,
  error: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_BIO_SUCCESS:
      return {
        ...state,
        bio: action.payload.bio,
        profession: action.payload.profession ?? state.profession,
        error: null,
        bioUpdateStatus: "success",
      };

    case UPDATE_BIO_FAILURE:
      return { ...state, error: action.payload, bioUpdateStatus: "error" };

    case CLEAR_BIO_STATUS:
      return { ...state, bioUpdateStatus: null };

    case UPDATE_PROFESSION_SUCCESS:
      return {
        ...state,
        profession: action.payload.profession,
        error: null,
        professionUpdateStatus: "success",
      };

    case UPDATE_PROFESSION_FAILURE:
      return {
        ...state,
        error: action.payload,
        professionUpdateStatus: "error",
      };

    case CLEAR_PROFESSION_STATUS:
      return { ...state, professionUpdateStatus: null };

    default:
      return state;
  }
};

export default userReducer;
