import { getChats } from "@/services/chats";
import useSWR from "swr";

export const useChats = () => {
  const { data, error, mutate } = useSWR("/chats", async () => getChats());

  return {
    chats: data,
    isLoading: !error && data === undefined,
    isError: error,
    mutate,
  };
};
