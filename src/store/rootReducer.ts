
import { combineReducers } from "@reduxjs/toolkit";

import SessionSlice from "./sessionSlice";

export const rootReducer = combineReducers({
  getSessions: SessionSlice,
});