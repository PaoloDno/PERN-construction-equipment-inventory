import { isRejected } from "@reduxjs/toolkit";
import { isPending } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import {
  createEquipmentAction,
  deleteEquipmentAction,
  getEquipmentAction,
  getEquipmentsAction,
  updateEquipmentAction,
} from "../actions/EquipmentThunks";

const equipmentSlice = createSlice({
  name: "equipment",
  initialState: {
    equipment: null,
    equipments: [],
    isPending: null,
    isRejected: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getEquipmentAction.fulfilled, (state, action) => {
        state.equipment = action.payload.equipment;
        state.isPending = false;
        state.isRejected = false;
        state.error = null;
      })
      .addCase(getEquipmentsAction.fulfilled, (state, action) => {
        state.equipments = action.payload.equipments;
        state.isPending = false;
        state.isRejected = false;
        state.error = null;
      })
      .addCase(createEquipmentAction.fulfilled, (state, action) => {
        state.equipment = action.payload.equipment;
        state.isPending = false;
        state.isRejected = false;
        state.error = null;
      })
      .addCase(updateEquipmentAction.fulfilled, (state, action) => {
        state.equipment = action.payload.equipment;
        state.isPending = false;
        state.isRejected = false;
        state.error = null;
      })
      .addCase(deleteEquipmentAction.fulfilled, (state, action) => {
        state.equipment = null;
        state.isPending = false;
        state.isRejected = false;
        state.error = null;
      })
      .addMatcher(
        isPending(
          getEquipmentAction,
          getEquipmentsAction,
          createEquipmentAction,
          updateEquipmentAction,
          deleteEquipmentAction,
        ),
        (state) => {
          state.isPending = true;
          state.isRejected = false;
          state.error = null;
        },
      )
      .addMatcher(
        isRejected(
          getEquipmentAction,
          getEquipmentsAction,
          createEquipmentAction,
          updateEquipmentAction,
          deleteEquipmentAction,
        ),
        (state) => {
          state.isPending = false;
          state.isRejected = true;
          state.error = action.payload || "Something went Wrong!";
        },
      );
  },
});

export default equipmentSlice.reducer;