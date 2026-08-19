import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

export const registerAction = createAsyncThunk(
  "AuthRegisterAction",
  async (userData, thunkAPI) => {
    try {
      console.log("Auth register");
      const response = await api("/auth/register", {
        method: "POST",
        body: userData,
      });
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.data.message);
    }
  },
);

export const loginAction = createAsyncThunk(
  "AuthLoginAction",
  async (userData, thunkAPI) => {
    try {
      const response = await api("/auth/login", {
        method: "POST",
        body: userData,
      });
      console.log(response);
      return response ;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.data.message);
    }
  },
);

export const getProfileAction = createAsyncThunk(
  "AuthGetProfile",
  async (userData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await api("/auth/profile", {
        method: "GET",
        token,
      });
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.data.message);
    }
  },
);
