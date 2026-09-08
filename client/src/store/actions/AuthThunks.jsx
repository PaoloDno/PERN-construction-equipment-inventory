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
      console.log(error.message);
      return thunkAPI.rejectWithValue(error.message);
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
      console.log(error.message);
      return thunkAPI.rejectWithValue(error.message);
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
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const getProfilesAction = createAsyncThunk(
  "AuthGetProfiles",
  async({
    page = 1,
    search = "",
    role = "",
  },
  thunkAPI
) => {

  try{
    const token = thunkAPI.getState().auth.token;

    const params = new URLSearchParams({
      page: String(page),
      search,
      role,
    });

    const response = await api(
      `/auth/search/pages?${params.toString()}`,
      {
        method: "GET",
        token
      }
    );

    return response;
  }
   catch (error) {
    console.log(error)
    return thunkAPI.rejectWithValue(
        error.message
      );
   }
}
);


export const getDashBoardAction = createAsyncThunk(
  "GetDashboardAction",
  async (_ , thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await api("/auth/dashboard", {
        method: "GET",
        token,
      });
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
)