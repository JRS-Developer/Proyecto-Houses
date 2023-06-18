import {
  getAccessToken,
  removeAccessToken,
  setAccessToken,
} from "@/lib/cookies";
import { getProfile } from "@/services/auth/profile";
import { Profile } from "@/types/user";
import axios from "axios";
import { create } from "zustand";

interface State {
  token: string | null;
  profile: Profile | null;
  isLoggedIn: boolean;
  isLoading: boolean;
}

interface Actions {
  setToken: (token: string | null) => void;
  setAuth: (token: string | null, profile: Profile | null) => void;
  initialize: () => void;
}

export const useAuthStore = create<State & Actions>((set, get) => ({
  token: null,
  profile: null,
  isLoggedIn: false,
  isLoading: true,

  initialize: async () => {
    const token = get().token ?? getAccessToken();

    if (!token) {
      set({ isLoading: false, isLoggedIn: false });
      return;
    }

    try {
      const res = await getProfile(token);

      set({
        profile: res,
        isLoading: false,
        token: token,
        isLoggedIn: true,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          removeAccessToken();
          set({ token: null, isLoggedIn: false, isLoading: false });
        }
      } else {
        console.error(error);
      }
    }
  },
  setToken: (token) => {
    if (token) {
      setAccessToken(token);
      set({ token, isLoggedIn: true });
    } else {
      removeAccessToken();
      set({ token: null, isLoggedIn: false });
    }
  },
  setAuth: (token, profile) => {
    set({ token, profile, isLoading: false, isLoggedIn: Boolean(profile) });
  },
}));
