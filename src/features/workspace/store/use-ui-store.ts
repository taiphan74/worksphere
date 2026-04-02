import { create } from "zustand";

type WorkspaceUiState = {
  isCommandPaletteOpen: boolean;
  isSidebarOpen: boolean;
  isWorkspacePanelOpen: boolean;
};

type WorkspaceUiActions = {
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

const initialState: WorkspaceUiState = {
  isCommandPaletteOpen: false,
  isSidebarOpen: false,
  isWorkspacePanelOpen: false,
};

export const useWorkspaceUiStore = create<WorkspaceUiState & WorkspaceUiActions>()((set) => ({
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
