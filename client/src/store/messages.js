import { createSlice } from "@reduxjs/toolkit";

const messagesSlice = createSlice({
  name: "messages",
  initialState: {
    messages: [],
    messagesLoading: true,
    arrivalMessage: null,
  },
  reducers: {
    setMessages(state, action) {
      state.messages = action.payload;
    },
    addMessage(state, action) {
      state.messages.push(action.payload);
    },
    setMessagesLoading(state, action) {
      state.messagesLoading = action.payload;
    },
    setArrivalMessage(state, action) {
      state.arrivalMessage = action.payload;
    },
  },
});

export const messagesActions = messagesSlice.actions;
export default messagesSlice.reducer;
