import { combineReducers } from "@reduxjs/toolkit";

import userReducer from "./user";
import messagesReducer from "./messages";
import uiReducer from "./ui";

const rootReducer = combineReducers({
  user: userReducer,
  messages: messagesReducer,
  ui: uiReducer,
});

export default rootReducer;
