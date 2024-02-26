import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    contacts: [],
    contactsLoading: true,
    userDataLoading: true,
    selectedContactIndex: undefined,
    currentChat: {},
    userOnline: [],
    userOffline: [],
    searchedContact: {
      _id: "",
      email: "",
      username: "",
      avatar: "",
    },
    contactSearchLoading: false,
  },
  reducers: {
    setUserData(state, action) {
      state.user = action.payload;
    },
    setUserContacts(state, action) {
      if (state.user) {
        state.contacts = action.payload;
      }
    },
    addUserContacts(state, action) {
      if (state.user) {
        state.contacts = [...state.contacts, action.payload];
        console.log(state.contacts);
      }
    },
    setUserContactsLoading(state, action) {
      if (state.user) {
        state.contactsLoading = action.payload;
      }
    },
    setUserDataLoading(state, action) {
      state.userDataLoading = action.payload;
    },
    setSelectedContactIndex(state, action) {
      state.selectedContactIndex = action.payload;
    },
    setCurrentChat(state, action) {
      state.currentChat = action.payload;
    },
    addUserOnline(state, action) {
      if (!state.userOnline.includes(action.payload)) {
        state.userOnline = [...state.userOnline, action.payload];
      }
    },
    removeUserOnline(state, action) {
      state.userOnline = state.userOnline.filter(
        (user) => user._id !== action.payload._id
      );
    },
    addUserOffline(state, action) {
      if (!state.userOffline.includes(action.payload)) {
        state.userOffline = [...state.userOffline, action.payload];
      }
    },
    removeUserOffline(state, action) {
      state.userOffline = state.userOffline.filter(
        (user) => user._id !== action.payload._id
      );
    },
    setSearchContact(state, action) {
      state.searchedContact = action.payload;
    },
    setContactSearchLoading(state, action) {
      state.contactSearchLoading = action.payload;
    },
  },
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
