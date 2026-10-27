import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSidebarOpen: false,
  isRoleSwitcherOpen: false,
  activeToast: null,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.isSidebarOpen = action.payload;
    },
    openRoleSwitcher: (state) => {
      state.isRoleSwitcherOpen = true;
    },
    closeRoleSwitcher: (state) => {
      state.isRoleSwitcherOpen = false;
    },
    toggleRoleSwitcher: (state) => {
      state.isRoleSwitcherOpen = !state.isRoleSwitcherOpen;
    },
    setRoleSwitcherOpen: (state, action) => {
      state.isRoleSwitcherOpen = action.payload;
    },
    showToast: (state, action) => {
      state.activeToast = action.payload;
    },
    hideToast: (state) => {
      state.activeToast = null;
    }
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  openRoleSwitcher,
  closeRoleSwitcher,
  toggleRoleSwitcher,
  setRoleSwitcherOpen,
  showToast,
  hideToast
} = uiSlice.actions;

export default uiSlice.reducer;