
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/AuthReducers.jsx";
import equipmentReducer from "./reducers/EquipmentReducer.jsx";


const store = configureStore({
  reducer: {
    auth: authReducer,
    equipment: equipmentReducer,
  }
});

export default store;