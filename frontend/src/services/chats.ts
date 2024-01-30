import { axiosAPI } from "@/lib/axios";

type Message = {
  id: number;
  createdAt: Date;
  read: boolean;
  senderId: number;
  message: string;
};

export const getChats = async () => {
  const res = await axiosAPI.get<
    {
      id: number;
      creator: {
        id: number;
        firstName: string;
        lastName: string;
        image: string;
      };
      creatorId: number;
      receiver: {
        id: number;
        firstName: string;
        lastName: string;
        image: string;
      };
      receiverId: number;
      lastMessage: Message | null;
    }[]
  >("/chats");

  return res.data;
};

export const getChatMessages = async ({ chatId }: { chatId: number }) => {
  const res = await axiosAPI.get<Message[]>(`/chats/${chatId}/messages`);

  return res.data;
};

export const createChat = async (data: { receiverId: number }) => {
  const res = await axiosAPI.post<{
    id: number;
  }>("/chats", data);

  return res.data;
};
