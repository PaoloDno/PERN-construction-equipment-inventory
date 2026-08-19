import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";


export const createProjectAction = createAsyncThunk(
  "CreateProjectAction",
  async (projectData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;

      const formData = new FormData();

      formData.append("project_name", projectData.project_name);
      formData.append("description", projectData.description);
      formData.append("location", projectData.location);
      formData.append("status", projectData.status);

      if (projectData.image) {
        formData.append("image", projectData.image);
      }

      const response = await api("/project/create", {
        method: "POST",
        body: formData,
        token,
      });

      console.log("Project Created:", response);

      return response;

    } catch (error) {
      console.log(error);

      return thunkAPI.rejectWithValue(
        error.message || "Failed to create project"
      );
    }
  }
);

export const getProjectAction = createAsyncThunk(
  "GetProjectAction",
  async (projectId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      console.log("Project Get");
      const response = await api(`/project/${projectId}`, {
        method: "GET",
        token,
      });
      console.log("asas");
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.data.message);
    }
  },
);

export const getProjectsAction = createAsyncThunk(
  "projects/getProjects",
  async (page = 1, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;

      const response = await api(`/project/s/page/${page}`, {
        method: "GET",
        token,
      });
      console.log("asas");
      console.log(response);

      return response;

    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.data?.message ||
        error?.message ||
        "Failed to get projects"
      );
    }
  }
);

export const updateProjectAction = createAsyncThunk(
  "UpdateProjectAction",
  async (projectData, thunkAPI) => {
    try {
      console.log("Update Project");
      const response = await api('/project/update', {
        method: 'POST',
        body: projectData,
      });
      console.log(response);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.data.message);
    }
  }
)