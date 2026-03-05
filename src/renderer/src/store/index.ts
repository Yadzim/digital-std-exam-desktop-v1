import { configureStore } from "@reduxjs/toolkit";
import uiSlice from "./ui";
import SignInSlice from "./auth";
import UserSlice from "./user";
import examSlice from "./exam";
import faceIDSlice from "./faceID";

const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
    auth: SignInSlice.reducer,
    user: UserSlice.reducer,
    exam: examSlice.reducer,
    faceID: faceIDSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = ReturnType<typeof store.dispatch>;

export default store;
