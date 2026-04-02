import { create } from "zustand";

type UiState = {
  isCommandPaletteOpen: boolean;
  isSidebarOpen: boolean;
  isWorkspacePanelOpen: boolean;
};

type UiActions = {
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  toggleCommandPalette: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
  openWorkspacePanel: () => void;
  closeWorkspacePanel: () => void;
  toggleWorkspacePanel: () => void;
};

const initialState: UiState = {
  isCommandPaletteOpen: false,
  isSidebarOpen: false,
  isWorkspacePanelOpen: false,
};

export const useUiStore = create<UiState & UiActions>()((set) => ({
  ...initialState,
  openCommandPalette: () => set({ isCommandPaletteOpen: true }),
  closeCommandPalette: () => set({ isCommandPaletteOpen: false }),
  toggleCommandPalette: () =>
    set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),
  openSidebar: () => set({ isSidebarOpen: true }),
  closeSidebar: () => set({ isSidebarOpen: false }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  openWorkspacePanel: () => set({ isWorkspacePanelOpen: true }),
  closeWorkspacePanel: () => set({ isWorkspacePanelOpen: false }),
  toggleWorkspacePanel: () =>
    set((state) => ({ isWorkspacePanelOpen: !state.isWorkspacePanelOpen })),
}));
