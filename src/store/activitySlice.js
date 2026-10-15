import { createSlice, nanoid } from "@reduxjs/toolkit";

const MAX_ENTRIES = 20;

const activitySlice = createSlice({
  name: "activity",
  initialState: { entries: [] },
  reducers: {
    actionLogged: {
      reducer(state, action) {
        state.entries.unshift(action.payload);
        state.entries = state.entries.slice(0, MAX_ENTRIES);
      },
      prepare(actionType, summary) {
        return { payload: { id: nanoid(), actionType, summary, at: Date.now() } };
      },
    },
    clearActivity(state) {
      state.entries = [];
    },
  },
});

export const { actionLogged, clearActivity } = activitySlice.actions;

export default activitySlice.reducer;
