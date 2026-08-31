import { isRejected } from "@reduxjs/toolkit";
import { isPending } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import {
  borrowEquipmentAction,
  createEquipmentAction,
  deleteEquipmentAction,
  getEquipmentAction,
  getEquipmentsAction,
  getHistoryEquipmentAction,
  returnEquipmentAction,
  updateEquipmentAction,
} from "../actions/EquipmentThunks";

const equipmentSlice = createSlice({
  name: "equipment",
  initialState: {
    equipment: {},
    equipments: [],
    history: [],
    pagination: {
    },
    isPending: null,
    isRejected: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getEquipmentAction.fulfilled, (state, action) => {
        state.equipment = action.payload;
        state.isPending = false;
        state.isRejected = false;
        state.error = null;
      })
      .addCase(getEquipmentsAction.fulfilled, (state, action) => {
        state.isPending = false;
        state.isRejected = false;
        state.error = null;
        state.equipments = action.payload.equipments;
        state.pagination = action.payload.pagination;
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
      .addCase(borrowEquipmentAction.fulfilled, (state, action) => {
        state.equipment = action.payload.equipment;
        state.isPending = false;
        state.isRejected = false;
        state.error = null;
      })
      .addCase(returnEquipmentAction.fulfilled, (state, action) => {
        state.equipment = action.payload.equipment;
        state.isPending = false;
        state.isRejected = false;
        state.error = null;
      })
      .addCase(getHistoryEquipmentAction.fulfilled, (state, action) => {
        state.history = action.payload.history;
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
          borrowEquipmentAction,
          returnEquipmentAction,
          getHistoryEquipmentAction,
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
          borrowEquipmentAction,
          returnEquipmentAction,
          getHistoryEquipmentAction,
        ),
        (state, action) => {
          state.isPending = false;
          state.isRejected = true;
          state.error = action.payload.error || "Something went Wrong!";
        },
      );
  },
});

export default equipmentSlice.reducer;
