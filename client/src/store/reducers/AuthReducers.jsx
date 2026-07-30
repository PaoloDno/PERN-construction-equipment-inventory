import { isRejected } from "@reduxjs/toolkit";
import { isPending } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { getProfileAction, loginAction, registerAction } from "../actions/AuthThunks";



const authSlice = createSlice({
  name: "auth",
  initialState: {
    profile: null,
    token: null,
    isPending: false,
    isRejected: false,
    error: null,
  },
  reducers: {
    setThemeInProfile: (state, action) => {
      if(state.profile) {
        state.profile.theme = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAction.fulfilled, (state, action) => {
        state.profile = action.payload.profile;
        state.token = action.payload.token;
        state.isPending = false;
        state.isRejected = false;
      })
      .addCase(registerAction.fulfilled, (state, action) => {
        state.profile = action.payload.profile;
        state.token = action.payload.token;
        state.isPending = false;
        state.isRejected = false;
      })
      .addCase(getProfileAction.fulfilled, (state, action) => {
        state.profile = action.payload.profile;
        state.token = action.payload.token;
        state.isPending = false;
        state.isRejected = false;
      })
      .addMatcher(
        isPending(
          loginAction,
          registerAction,
          getProfileAction,
        ), (state) => {
          state.isPending = true;
          state.isRejected = false;
          state.error = null;
        },
      )
      .addMatcher(
        isRejected(
          loginAction,
          registerAction,
          getProfileAction,
        ), (state) => {
          state.isPending = false;
          state.isRejected = true;
          state.error = action.payload || "Something went Wrong!";
        }
      )
  }
})

export default authSlice.reducer;