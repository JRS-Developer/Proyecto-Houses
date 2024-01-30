import { Socket, io } from "socket.io-client";

export interface ServerToClientEvents {
  message: (props: {
    id: number;
    chatId: number;
    body: string;
    senderId: number;
    createdAt: Date;
  }) => void;
  ["new-message"]: (props: {
    message: { id: number; body: string; createdAt: Date; read: boolean };
    sender: { id: number; firstName: string; lastName: string; image: string };
    receiverId: number;
  }) => void;
  exception: (
    error:
      | string
      | string[]
      | {
          message: string;
        },
  ) => void;
}
interface ClientToServerEvents {
  message: ({ chatId, message }: { chatId: number; message: string }) => void;
  subscribe: () => void;
}

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  "http://localhost:3000",
  {
    autoConnect: false,
  },
);
