import { useAuthStore } from "../stores/useAuthStore";
import { shallow } from "zustand/shallow";

export const useProfile = () => {
  // profile empieza siendo null
  // parece un peo relacionado a nextjs 14, algo con las cookies
  const { profile, isLoading, isLoggedIn } = useAuthStore(
    (state) => ({
      profile: state.profile,
      isLoading: state.isLoading,
      isLoggedIn: state.isLoggedIn,
    }),
    shallow,
  );

  return {
    isLoading,
    profile,
    isLoggedIn,
  };
};
