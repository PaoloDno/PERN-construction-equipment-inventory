
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/AuthReducers.jsx";
import equipmentReducer from "./reducers/EquipmentReducer.jsx";
import projectReducer from "./reducers/ProjectReducers.jsx";

const store = configureStore({
  reducer: {
    auth: authReducer,
    equipment: equipmentReducer,
    project: projectReducer,
  }
});

export default store;