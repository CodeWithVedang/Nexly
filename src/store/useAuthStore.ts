import { create } from 'zustand';
import { getDB, clearAllData } from '../lib/idb';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  bio: string;
  hobbies: string[];
  interests: string[];
  isOnline: boolean;
}

interface AuthStore {
  isAuth: boolean;
  profile: UserProfile | null;
  login: (profile: UserProfile) => Promise<void>;
  logout: () => Promise<void>;
  loadProfile: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  isAuth: false,
  profile: null,
  login: async (profile) => {
    const db = await getDB();
    await db.put('profile', profile, 'user');
    set({ isAuth: true, profile });
  },
  logout: async () => {
    await clearAllData();
    set({ isAuth: false, profile: null });
  },
  loadProfile: async () => {
    try {
      const db = await getDB();
      const profile = await db.get('profile', 'user');
      if (profile) {
        set({ isAuth: true, profile });
      }
    } catch(e) {}
  },
  updateProfile: async (updates) => {
    const current = get().profile;
    if (!current) return;
    const newProfile = { ...current, ...updates };
    const db = await getDB();
    await db.put('profile', newProfile, 'user');
    set({ profile: newProfile });
  }
}));