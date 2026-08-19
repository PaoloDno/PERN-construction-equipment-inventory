import { createSlice, isPending, isRejected } from "@reduxjs/toolkit";
import {
  createProjectAction,
  getProjectAction,
  getProjectsAction,
  updateProjectAction,
} from "../actions/ProjectThunks";
import { act } from "react";

const projectSlice = createSlice({
  name: "project",
  initialState: {
    project: null,
    projects: [],
    pagination: {
      currentPage: 1,
      projectsPerPage: 10,
      totalProjects: 0,
      totalPages: 0,
    },
    isPending: false,
    isRejected: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createProjectAction.fulfilled, (state, action) => {
        state.project = action.payload.project;
        state.isPending = false;
        state.isRejected = false;
      })
      .addCase(getProjectAction.fulfilled, (action, state) => {
        state.project = action.payload.project;
        state.isPending = false;
        state.isRejected = false;
      })
      .addCase(getProjectsAction.fulfilled, (state, action) => {
        state.isPending = false;
        state.isRejected = false;
        state.projects = action.payload.projects;

        state.pagination = action.payload.pagination;
      })
      .addCase(updateProjectAction.fulfilled, (state, action) => {
        state.project = action.payload.project;
        state.isPending = false;
        state.isRejected = false;
      })
      .addMatcher(
        isPending(
          createProjectAction,
          getProjectAction,
          getProjectsAction,
          updateProjectAction,
        ),
        (state) => {
          state.isPending = true;
          state.isRejected = false;
          state.error = null;
        },
      )
      .addMatcher(
        isRejected(
          createProjectAction,
          getProjectAction,
          getProjectsAction,
          updateProjectAction,
        ),
        (state) => {
          state.isPending = false;
          state.isRejected = true;
          state.error = action.payload || "Something went Wrong!";
        },
      );
  },
});

export default projectSlice.reducer;
