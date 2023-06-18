import { useAuthStore } from "../stores/useAuthStore";
import { shallow } from "zustand/shallow";

export const useProfile = () => {
  const { profile, isLoading, isLoggedIn } = useAuthStore(
    (state) => ({
      profile: state.profile,
      isLoading: state.isLoading,
      isLoggedIn: state.isLoggedIn,
    }),
    shallow
  );

  return {
    isLoading,
    profile,
    isLoggedIn,
  };
};
