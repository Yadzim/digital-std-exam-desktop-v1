import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import CheckFaceID from "pages/webcam/service";

export type TypeInitialStateFaceID = {
  date?: number;
  isOpen?: boolean;
  isAuth?: boolean;
  file?: string;
  error?: string;
  message?: string;
  isLoading?: boolean;
};

const initialState: TypeInitialStateFaceID = {
  date: undefined,
  isOpen: true,
  isAuth: false,
  file: "",
  error: "",
  message: "",
  isLoading: false,
};

const faceIDSlice = createSlice({
  name: "faceID",
  initialState,
  reducers: {
    resetFaceID(state, action: PayloadAction<any>) {
      state.date = undefined;
      state.isOpen = true;
      state.isAuth = false;
      state.file = "";
      state.error = "";
      state.message = "";
      state.isLoading = false;
    },
    setIsOpen(state, action: PayloadAction<boolean>) {
      if (action.payload) state.file = "";
      state.isOpen = action.payload;
    },
    setFile(state, action: PayloadAction<string>) {
      state.file = action.payload;
    },
    finishTimeLimit(state) {
      state.isAuth = false;
      state.file = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(CheckFaceID.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(CheckFaceID.fulfilled, (state, action: PayloadAction<any>) => {
        if (action.payload && action?.payload?.status === 1) {
          state.isAuth = true;
          state.isOpen = false;
          state.message = action.payload?.data?.message;
          state.isLoading = false;
          state.error = "";
          state.date = action.payload?.data;
        } else {
          state.isLoading = false;
          state.isAuth = false;
        }
      })
      .addCase(CheckFaceID.rejected, (state, action: PayloadAction<any>) => {
        state.message = action.payload?.data?.message;
        state.error = action.payload?.data?.errors;
        state.isLoading = false;
        state.isAuth = false;
        state.date = undefined;
        state.file = "";
      });
  },
});

export const { resetFaceID, setIsOpen, setFile, finishTimeLimit } =
  faceIDSlice.actions;
export default faceIDSlice;
