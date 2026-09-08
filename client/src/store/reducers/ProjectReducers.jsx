import { createSlice, isPending, isRejected } from "@reduxjs/toolkit";
import {
  createProjectAction,
  getProjectAction,
  getProjectsAction,
  getSearchProjectsAction,
  searchNameProjectAction,
  updateProjectAction,
} from "../actions/ProjectThunks";


const projectSlice = createSlice({
  name: "project",
  initialState: {
    project: null,
    activeEquipment: null,
    equipmentHistory: null,
    projects: [],
    projectsName: [],
    pagination: {
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
      .addCase(getProjectAction.fulfilled, (state, action) => {
        state.project = action.payload.project;
        state.activeEquipment = action.payload.activeEquipment;
        state.equipmentHistory = action.payload.equipmentHistory;
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
      .addCase(searchNameProjectAction.fulfilled, (state, action) => {
        state.projectsName = action.payload.projectsName;
        state.isPending = false;
        state.isRejected = false;
      })
      .addCase(getSearchProjectsAction.fulfilled, (state, action) => {
        state.isPending = false;
        state.isRejected = false;
        state.projects = action.payload.projects;
      })
      .addMatcher(
        isPending(
          createProjectAction,
          getProjectAction,
          getProjectsAction,
          updateProjectAction,
          searchNameProjectAction,
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
          searchNameProjectAction,
        ),
        (state, action) => {
          state.isPending = false;
          state.isRejected = true;
          state.error = action.payload || "Something went Wrong!";
        },
      );
  },
});

export default projectSlice.reducer;
