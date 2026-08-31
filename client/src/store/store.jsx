import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./reducers/AuthReducers.jsx";
import equipmentReducer from "./reducers/EquipmentReducer.jsx";
import projectReducer from "./reducers/ProjectReducers.jsx";

const loadState = () => {
  try {
    const serializedState = localStorage.getItem("reduxState");

    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (error) {
    console.error("Failed to load Redux state:", error);
    return undefined;
  }
};

const store = configureStore({
  reducer: {
    auth: authReducer,
    equipment: equipmentReducer,
    project: projectReducer,
  },

  preloadedState: loadState(),
});

// just auth
store.subscribe(() => {
  try {
    const state = store.getState();

    const stateToSave = {
      auth: state.auth,
    };

    localStorage.setItem(
      "reduxState",
      JSON.stringify(stateToSave)
    );
  } catch (error) {
    console.error("Failed to save Redux state:", error);
  }
});

export default store;