import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NotesState {
  selectedNoteId: number | null;
  filter: "all" | "favorites";
}

const initialState: NotesState = {
  selectedNoteId: null,
  filter: "all",
};

export const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    setSelectedNoteId: (state, action: PayloadAction<number | null>) => {
      state.selectedNoteId = action.payload;
    },
    setFilter: (state, action: PayloadAction<"all" | "favorites">) => {
      state.filter = action.payload;
    },
  },
});

export const { setSelectedNoteId, setFilter } = notesSlice.actions;
export default notesSlice.reducer;
