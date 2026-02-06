import { create } from 'zustand';
import type { Profile } from '@/types';

interface ProfileState {
  // Cache for other users' profiles
  profiles: Record<string, Profile>;
  
  // Actions
  setProfile: (uid: string, profile: Profile) => void;
  getProfile: (uid: string) => Profile | undefined;
  clearProfile: (uid: string) => void;
  clearAll: () => void;
}

export const useProfileStore = create<ProfileState>()((set, get) => ({
  profiles: {},
  
  setProfile: (uid, profile) =>
    set((state) => ({
      profiles: { ...state.profiles, [uid]: profile },
    })),
  
  getProfile: (uid) => get().profiles[uid],
  
  clearProfile: (uid) =>
    set((state) => {
      const { [uid]: _, ...rest } = state.profiles;
      return { profiles: rest };
    }),
  
  clearAll: () => set({ profiles: {} }),
}));
