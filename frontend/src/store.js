// store.js
import { createStore, applyMiddleware, combineReducers } from "redux";
import { thunk } from "redux-thunk";
import { apiMiddleware } from "./apiMiddleware";
import userReducer from "./reducers/UserReducer";

const rootReducer = combineReducers({
  user: userReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk, apiMiddleware));

export default store;
