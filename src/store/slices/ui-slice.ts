import { createSlice } from "@reduxjs/toolkit";

type UiState = {
  isCommandPaletteOpen: boolean;
  isSidebarOpen: boolean;
  isWorkspacePanelOpen: boolean;
};

const initialState: UiState = {
  isCommandPaletteOpen: false,
  isSidebarOpen: false,
  isWorkspacePanelOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openCommandPalette(state) {
      state.isCommandPaletteOpen = true;
    },
    closeCommandPalette(state) {
      state.isCommandPaletteOpen = false;
    },
    toggleCommandPalette(state) {
      state.isCommandPaletteOpen = !state.isCommandPaletteOpen;
    },
    openSidebar(state) {
      state.isSidebarOpen = true;
    },
    closeSidebar(state) {
      state.isSidebarOpen = false;
    },
    toggleSidebar(state) {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    openWorkspacePanel(state) {
      state.isWorkspacePanelOpen = true;
    },
    closeWorkspacePanel(state) {
      state.isWorkspacePanelOpen = false;
    },
    toggleWorkspacePanel(state) {
      state.isWorkspacePanelOpen = !state.isWorkspacePanelOpen;
    },
  },
});

export const {
  openCommandPalette,
  closeCommandPalette,
  toggleCommandPalette,
  openSidebar,
  closeSidebar,
  toggleSidebar,
  openWorkspacePanel,
  closeWorkspacePanel,
  toggleWorkspacePanel,
} = uiSlice.actions;

export const uiReducer = uiSlice.reducer;
