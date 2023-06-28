import { API_ROUTES } from "@/services/api-routes";
import { getHouses } from "@/services/houses";
import useSWR from "swr";

export const useHouses = () => {
  const { data, isLoading, error } = useSWR(
    API_ROUTES.houses.list,
    async () => {
      return await getHouses();
    }
  );

  return {
    houses: data,
    isLoading,
    error,
  };
};
