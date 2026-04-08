import { create } from "zustand";

type OnboardingState = {
  currentStep: number;
  fullName: string;
  workspaceName: string;
};

type OnboardingActions = {
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setFullName: (name: string) => void;
  setWorkspaceName: (name: string) => void;
  reset: () => void;
};

const initialState: OnboardingState = {
  currentStep: 0,
  fullName: "",
  workspaceName: "",
};

export const useOnboardingStore = create<OnboardingState & OnboardingActions>()((set) => ({
  ...initialState,
  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  prevStep: () => set((state) => ({ currentStep: Math.max(0, state.currentStep - 1) })),
  setFullName: (name) => set({ fullName: name }),
  setWorkspaceName: (name) => set({ workspaceName: name }),
  reset: () => set(initialState),
}));
