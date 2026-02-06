import { create } from 'zustand';
import type { User as FirebaseUser } from 'firebase/auth';
import type { User, Profile } from '@/types';

interface AuthState {
  // State
  firebaseUser: FirebaseUser | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  
  // Actions
  setFirebaseUser: (user: FirebaseUser | null) => void;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

const initialState = {
  firebaseUser: null,
  user: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,
  isOnboarded: false,
};

export const useAuthStore = create<AuthState>()((set) => ({
  ...initialState,
  
  setFirebaseUser: (firebaseUser) =>
    set({
      firebaseUser,
      isAuthenticated: !!firebaseUser,
    }),
  
  setUser: (user) => set({ user }),
  
  setProfile: (profile) =>
    set({
      profile,
      isOnboarded: profile ? profile.completeness_score >= 80 : false,
    }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  reset: () => set(initialState),
}));
