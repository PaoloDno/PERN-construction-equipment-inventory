import { isRejected } from "@reduxjs/toolkit";
import { isPending } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import {
  getProfileAction,
  loginAction,
  registerAction,
} from "../actions/AuthThunks";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    dashboard: null,
    token: localStorage.getItem("token"),
    isPending: false,
    isRejected: false,
    error: null,
  },
  reducers: {
    logoutAction: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
    setThemeInProfile: (state, action) => {
      if (state.user) {
        state.user.theme = action.payload || "light";
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAction.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
        state.isPending = false;
        state.isRejected = false;
      })
      .addCase(registerAction.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
        state.isPending = false;
        state.isRejected = false;
      })
      .addCase(getProfileAction.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isPending = false;
        state.isRejected = false;
      })
      .addMatcher(
        isPending(loginAction, registerAction, getProfileAction),
        (state) => {
          state.isPending = true;
          state.isRejected = false;
          state.error = null;
        },
      )
      .addMatcher(
        isRejected(loginAction, registerAction, getProfileAction),
        (state, action) => {
          state.isPending = false;
          state.isRejected = true;
          state.error = action.payload || "Something went Wrong!";
          console.log(action.payload);
        },
      );
  },
});

export const { logoutAction } = authSlice.actions;
export default authSlice.reducer;
