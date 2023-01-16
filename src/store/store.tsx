import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user-state";
import vacationReducer from "./vacation-state";
import modalReducer from "./modal-state";

const store = configureStore({
  reducer: {
    user: userReducer,
    vacations: vacationReducer,
    modal: modalReducer,
  },
});

export default store;
