import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";


export const getEquipmentAction = createAsyncThunk(
  "GetEquipmentAction", 
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await api("/equipment/", {
        method: "GET",
        token,
      });
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.data.message);
    }
  },
);

export const getEquipmentsAction = createAsyncThunk(
  "GetEquipmentsAction", 
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await api("/equipments/", {
        method: "GET",
        token,
      });
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.data.message);
    }
  },
);

export const createEquipmentAction = createAsyncThunk(
  "CreateEquipmentAction",
  async ( equipmentData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await api("/equipment/", {
        method: "POST",
        body: equipmentData,
        token,
      });
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.data.message);
    }
  },
);


export const updateEquipmentAction = createAsyncThunk(
  "UpdateEquipmentAction",
async ( equipmentData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const id = equipmentData.id; 
      const response = await api(`/equipment/${id}`, {
        method: "POST",
        body: equipmentData,
        token,
      });
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.data.message);
    }
  },
);

export const deleteEquipmentAction = createAsyncThunk(
  "DeleteEquipmentAction",
  async ( equipmentId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token; 
      const response = await api(`/equipment/${equipmentId}`, {
        method: "DELETE",
        body: equipmentData,
        token,
      });
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.data.message);
    }
  }
)