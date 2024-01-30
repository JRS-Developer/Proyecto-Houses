import { getChatMessages } from "@/services/chats";
import useSWR from "swr";

export const useChatMessages = ({ chatId }: { chatId: number | null }) => {
  const { data, error, mutate } = useSWR(
    chatId ? `/chats/${chatId}/messages` : null,
    () => getChatMessages({ chatId: chatId! }),
  );

  return {
    messages: data,
    isLoading: !error && data === undefined && !!chatId,
    isError: error,
    mutate,
  };
};
