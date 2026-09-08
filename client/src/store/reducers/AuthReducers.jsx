import { isRejected } from "@reduxjs/toolkit";
import { isPending } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import {
  getDashBoardAction,
  getProfileAction,
  getProfilesAction,
  loginAction,
  registerAction,
} from "../actions/AuthThunks";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    profiles: null,
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
      } // soon
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
      .addCase(getDashBoardAction.fulfilled, (state, action) => {
        state.dashboard = action.payload.dashboard;
        state.isPending = false;
        state.isRejected = false;
      })
      .addCase(getProfilesAction.fulfilled, (state, action) => {
        state.profiles = action.payload.profiles;
        state.pagination = action.payload.pagination;
        state.isPending = false;
        state.isRejected = false;
      })
      
      .addMatcher(
        isPending(loginAction, registerAction, getProfileAction, getDashBoardAction, getProfilesAction),
        (state) => {
          state.isPending = true;
          state.isRejected = false;
          state.error = null;
        },
      )
      
      .addMatcher(
        isRejected(loginAction, registerAction, getProfileAction, getDashBoardAction, getProfilesAction),
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
