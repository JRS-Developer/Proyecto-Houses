"use client";
import { AvatarFallback, Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import { Skeleton } from "@/components/ui/skeleton";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useChats } from "@/hooks/useChats";
import { useProfile } from "@/hooks/useProfile";
import { ServerToClientEvents, socket } from "@/lib/socket";
import { SendIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";

const Chats = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const chatSearchParam = searchParams.get("chat");
  const listRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const { chats, isLoading, mutate: mutateChats } = useChats();

  const chat = useMemo(() => {
    return chats?.find((c) => c.id?.toString() === chatSearchParam);
  }, [chatSearchParam, chats]);

  let {
    messages,
    isLoading: isLoadingMessages,
    mutate: mutateMessages,
  } = useChatMessages({
    chatId: chat?.id || null,
  });
  const { profile } = useProfile();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!chat?.id) return;

    const formData = new FormData(e.currentTarget);

    const message = formData.get("message");

    if (!message || typeof message !== "string") return;

    socket.emit("message", { chatId: chat.id, message });

    e.currentTarget.reset();
  };

  const handleOwnMessage: ServerToClientEvents["message"] = useCallback(
    ({ id, senderId, body, createdAt }) => {
      mutateMessages(undefined, {
        optimisticData: (currentData) => {
          const newMessages: typeof currentData = [
            ...(currentData ?? []),
            {
              id,
              senderId,
              createdAt,
              message: body,
              read: true,
            },
          ];

          return newMessages;
        },
        revalidate: false,
        rollbackOnError: true,
        populateCache: false,
      });
    },
    [mutateMessages],
  );

  const handleNewMessage: ServerToClientEvents["new-message"] = useCallback(
    ({ sender, message }) => {
      // We update the chat list so it can be sorted by the last message
      mutateChats();
      mutateMessages(undefined, {
        optimisticData: (currentData) => {
          const newMessages: typeof currentData = [
            ...(currentData ?? []),
            {
              id: message.id,
              createdAt: message.createdAt,
              read: message.read,
              message: message.body,
              senderId: sender?.id,
            },
          ];

          return newMessages;
        },
        revalidate: false,
        rollbackOnError: true,
        populateCache: false,
      });
    },
    [mutateChats, mutateMessages],
  );

  useEffect(() => {
    socket.on("message", handleOwnMessage);
    socket.on("new-message", handleNewMessage);
    return () => {
      socket.off("message", handleOwnMessage);
      socket.off("new-message", handleNewMessage);
    };
  }, [handleOwnMessage, handleNewMessage]);

  useLayoutEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [messages]);

  return (
    <div className="border shadow-sm rounded-lg flex">
      <div className="border-r w-[250px]">
        {Boolean(isLoading || !!chats?.length) && (
          <ul>
            {isLoading
              ? new Array(5).fill(undefined).map((_, i) => (
                  <li
                    className="flex items-center p-4 gap-2 cursor-pointer"
                    key={`${i}-loading`}
                  >
                    <Skeleton className="h-10 w-10 rounded-full flex-none" />
                    <div className="w-full flex flex-col gap-1">
                      <Skeleton className="h-[14px] w-full" />
                      <Skeleton className="h-5 w-full" />
                    </div>
                  </li>
                ))
              : chats?.map((c) => {
                  const otherUser =
                    profile?.id === c.creatorId ? c.receiver : c.creator;
                  const isSelected = c.id?.toString() === chatSearchParam;

                  return (
                    <li key={c.id}>
                      <Link
                        href={`${pathname}?chat=${c.id}`}
                        className={`flex items-center p-4 gap-2 cursor-pointer ${
                          isSelected ? "bg-gray-50" : ""
                        } `}
                      >
                        <Avatar>
                          <AvatarImage
                            alt={`${otherUser.firstName ?? ""} ${
                              otherUser.lastName ?? ""
                            }`}
                            src={otherUser.image}
                          />
                          <AvatarFallback>
                            {otherUser.firstName?.[0]}
                            {otherUser?.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium leading-none line-clamp-1">
                            {otherUser.firstName} {otherUser.lastName}
                          </div>
                          {c.lastMessage?.message && (
                            <div className="line-clamp-1 text-sm leading-snug text-gray-500 dark:text-gray-400">
                              {c.lastMessage.message}
                            </div>
                          )}
                        </div>
                      </Link>
                    </li>
                  );
                })}
          </ul>
        )}
        {!isLoading && !chats?.length && (
          <div className="h-full flex items-center justify-center p-4 text-center text-gray-500">
            You don&apos;t have any chats
          </div>
        )}
      </div>
      <div className="flex-1">
        <div className="flex flex-col h-96 overflow-auto p-4" ref={listRef}>
          {Boolean(isLoadingMessages || !chat || !chatSearchParam) && (
            <div className="w-full h-full flex items-center justify-center">
              {isLoadingMessages && <Loader />}
              {chatSearchParam && !chat && !isLoading && <p>Chat Not Found</p>}
              {!chatSearchParam && <p>Select a chat</p>}
            </div>
          )}
          {messages?.map((m) => {
            const isSameUser = m.senderId === profile?.id;
            const sender =
              profile?.id === chat?.creatorId ? chat?.receiver : chat?.creator;

            return (
              <div
                className={`flex items-start gap-2 mb-4 ${
                  isSameUser ? "ml-auto flex-row-reverse" : ""
                }`}
                key={m.id}
              >
                <Avatar>
                  <AvatarImage alt="@shadcn" src={sender?.image} />
                  <AvatarFallback>
                    {sender?.firstName?.[0]}
                    {sender?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <div className="text-sm font-medium leading-none">
                    {isSameUser
                      ? "You"
                      : `${sender?.firstName ?? ""} ${sender?.lastName ?? ""}`}
                  </div>
                  <div className="line-clamp-2 text-sm leading-snug text-gray-500 dark:text-gray-400">
                    {m.message}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
        <div className="border-t p-4">
          <form className="flex items-center gap-2" onSubmit={onSubmit}>
            <Input
              className="flex-1"
              placeholder="Escribe tu mensaje"
              type="text"
              disabled={!chat}
              name="message"
              autoComplete="off"
            />
            <Button type="submit" disabled={!chat}>
              <SendIcon className="h-4 w-4" />
              <span className="sr-only">Enviar</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chats;
