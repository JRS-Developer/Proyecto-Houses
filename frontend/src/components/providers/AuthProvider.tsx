"use client";
import { useAuthStore } from "@/stores/useAuthStore";
import { Profile } from "@/types/user";

const AuthProvider = ({
  children,
  token,
  profile,
}: {
  children: React.ReactNode;
  token: string | null;
  profile: Profile | null;
}) => {
  if (token && profile) {
    useAuthStore.getState().setAuth(token, profile);
  }

  return children;
};

export default AuthProvider;
