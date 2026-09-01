import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";


export const getEquipmentAction = createAsyncThunk(
  "GetEquipmentAction", 
  async (equipmentId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await api(`/equipment/${equipmentId}`, {
        method: "GET",
        token,
      });
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const getEquipmentsAction = createAsyncThunk(
  "GetEquipmentsAction", 
  async (page = 1, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await api(`/equipment/page/${page}`, {
        method: "GET",
        token,
      });
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const createEquipmentAction = createAsyncThunk(
  "CreateEquipmentAction",
  async ( equipmentData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;

      const formData = new FormData();

      formData.append("equipment_name", equipmentData.equipment_name);
      formData.append("category", equipmentData.category);
      formData.append("condition", equipmentData.condition);
      formData.append("note", equipmentData.note);
      formData.append("status", equipmentData.status);
      formData.append("serial_number", equipmentData.serial_number);
      
      if (equipmentData.image) {
        formData.append("image", equipmentData.image);
      }

      const response = await api("/equipment/", {
        method: "POST",
        body: formData,
        token,
      });
      
      console.log("Project Created:", response);
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);


export const updateEquipmentAction = createAsyncThunk(
  "UpdateEquipmentAction",
async ( equipmentData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;

      const formData = new FormData();

      formData.append("equipment_name", equipmentData.equipment_name);
      formData.append("category", equipmentData.category);
      formData.append("condition", equipmentData.condition);
      formData.append("note", equipmentData.note);
      
      if (equipmentData.image) {
        formData.append("image", equipmentData.image);
      }

      const id = equipmentData.id; 
      const response = await api(`/equipment/${id}`, {
        method: "PUT",
        body: formData,
        token,
      });
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const borrowEquipmentAction = createAsyncThunk(
  "BorrowEquipmentAction",
async ( equipmentData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      
      const formData = new FormData();

      formData.append("project_id", equipmentData.project_id);
      formData.append("user_id", equipmentData.user_id);
      formData.append("condition", equipmentData.condition);
      formData.append("note", equipmentData.note);
      
      if (equipmentData.image) {
        formData.append("image", equipmentData.image);
      }

      const id = equipmentData.id; 
      const response = await api(`/equipment/borrow/${id}`, {
        method: "POST",
        body: formData,
        token,
      });
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const returnEquipmentAction = createAsyncThunk(
  "ReturnEquipmentAction",
async ( equipmentData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const id = equipmentData.id; 
      
      const formData = new FormData();

      formData.append("condition", equipmentData.condition);
      
      if (equipmentData.image) {
        formData.append("image", equipmentData.image);
      }
      
      const response = await api(`/equipment/return/${id}`, {
        method: "POST",
        body: formData,
        token,
      });
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const getHistoryEquipmentAction = createAsyncThunk(
  "GetHistoryEquipmentAction",
async ( equipmentId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      
      const response = await api(`/equipment/history/${equipmentId}`, {
        method: "GET",
        token,
      });
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.message);
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
        token,
      });
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getEquipmentSearchAction = createAsyncThunk(
  "GetEquipmentSearchAction",
  async (
    {
      page = 1,
      search = "",
      status = "",
      condition = "",
    },
    thunkAPI
  ) => {
    try {
      const token = thunkAPI.getState().auth.token;

      const params = new URLSearchParams({
        page: String(page),
        search,
        status,
        condition,
      });

      const response = await api(
        `/equipment/search?${params.toString()}`,
        {
          method: "GET",
          token,
        }
      );

      console.log(response);

      return response;
    } catch (error) {
      console.log(error);

      return thunkAPI.rejectWithValue(
        error.message
      );
    }
  }
);