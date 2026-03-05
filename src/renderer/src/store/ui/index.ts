import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TypeInitialStateUi = {
  responsive_content: string;
  studentTheme: string;
  sidebar: string;
  isOnline: boolean;
  version: string;
};

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    responsive_content: "mobile",
    studentTheme: "white",
    sidebar: "lg",
    isOnline: true,
    version: "1.0.4",
  },
  reducers: {
    restoreUi(state: TypeInitialStateUi, action: PayloadAction<any>): void {
      if (
        action.payload.student_theme &&
        action.payload.student_theme &&
        action.payload.student_theme !== "{}"
      ) {
        state.studentTheme = action.payload.student_theme;
      }
    },
    customContentResponsive(
      state: TypeInitialStateUi,
      action: PayloadAction<any>
    ) {
      state.responsive_content = action.payload.size;
    },
    changeStudentTheme(state: TypeInitialStateUi, action: PayloadAction<any>) {
      state.studentTheme = state.studentTheme === "white" ? "black" : "white";
    },
    manageSidebar(state: TypeInitialStateUi, action: PayloadAction<any>) {
      state.sidebar = state.sidebar === "lg" ? "xs" : "lg";
    },
    manageSidebarCustom(state: TypeInitialStateUi, action: PayloadAction<any>) {
      state.sidebar = action.payload.sidebarType;
    },
    handleNetwork(
      state: TypeInitialStateUi,
      action: PayloadAction<{ isOnline: boolean }>
    ) {
      state.isOnline = action.payload.isOnline;
    },
  },
});

export const {
  restoreUi,
  customContentResponsive,
  changeStudentTheme,
  manageSidebar,
  manageSidebarCustom,
  handleNetwork,
} = uiSlice.actions;

export default uiSlice;
