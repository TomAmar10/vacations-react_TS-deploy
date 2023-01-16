import { createSlice } from "@reduxjs/toolkit";
import UserModel, { Role } from "../models/user-model";
import jwt_decode from "jwt-decode";

interface UserState {
  user: UserModel;
}

const initialUserState: UserState = {
  user: {
    id: 0,
    first_name: "",
    last_name: "",
    user_name: "",
    password: "",
    image: "",
    role: Role.Guest,
    token: "",
  },
};

const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    login(state, action) {
      const tokenResult: any = jwt_decode(action.payload);
      const user: UserModel = tokenResult.user;
      user.token = action.payload;
      localStorage.setItem("userToken", action.payload);
      state.user = user;
    },
    logout(state) {
      localStorage.clear();
      state.user = {
        id: 0,
        first_name: "",
        last_name: "",
        user_name: "",
        password: "",
        image: "",
        role: Role.Guest,
        token: "",
      };
    },
  },
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
