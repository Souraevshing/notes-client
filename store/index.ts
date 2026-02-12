import { configureStore } from "@reduxjs/toolkit";
import notesReducer from "./notes-slice";

export const store = configureStore({
  reducer: {
    notes: notesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
