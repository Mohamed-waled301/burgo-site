import { create } from 'zustand';

interface AuthModalState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

// Global signal store — lets any component trigger the auth modal
// without prop drilling or context providers.
export const useAuthModalStore = create<AuthModalState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
