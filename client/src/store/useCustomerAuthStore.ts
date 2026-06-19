import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ─── Public user profile (no passwordHash) ──────────────────────────────────
export interface UserProfile {
  id: string;
  fullName: string;
  address: string;
  phoneNumber: string;
  username: string;
  createdAt: string;
}

interface CustomerAuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: UserProfile) => void;
  logout: () => void;
  setUser: (user: UserProfile) => void;
}

export const useCustomerAuthStore = create<CustomerAuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (token, user) => set({ token, user, isAuthenticated: true }),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
      setUser: (user) => set({ user }),
    }),
    {
      name: 'bb_customer_session', // separate key from admin's bb_admin_session
    }
  )
);
