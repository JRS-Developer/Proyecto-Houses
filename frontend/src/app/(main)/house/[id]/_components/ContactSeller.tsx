"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useProfile } from "@/hooks/useProfile";
import { handleAxiosError } from "@/lib/axios";
import { socket } from "@/lib/socket";
import { createChat } from "@/services/chats";
import { SendIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const SendMessageForm = ({ sellerId }: { sellerId: number }) => {
  const [loading, setLoading] = useState(false);
  const { push } = useRouter();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const message = formData.get("message");

    if (!message || typeof message !== "string") return;

    setLoading(true);

    try {
      const chat = await createChat({
        receiverId: sellerId,
      });

      if (chat.id) {
        socket.emit("message", {
          chatId: chat.id,
          message,
        });

        socket.once("message", ({ chatId }) => {
          toast.success("Mensaje enviado, Redireccionando...");
          setTimeout(() => {
            window.location.href = `/dashboard/chats?chat=${chatId}`;
          }, 1000);
        });
      }
    } catch (error) {
      handleAxiosError(error, (message) => {
        toast.error(message);
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex items-center gap-2 px-4 pb-4" onSubmit={onSubmit}>
      <Input
        className="flex-1"
        placeholder="Escribe tu mensaje"
        type="text"
        name="message"
        required
        disabled={loading}
      />
      <Button type="submit" loading={loading}>
        <SendIcon className="h-4 w-4" />
        <span className="sr-only">Enviar</span>
      </Button>
    </form>
  );
};

const ContactSeller = ({
  seller,
}: {
  seller: {
    id: number;
    firstName: string;
    lastName: string;
    image: string;
  };
}) => {
  const { profile } = useProfile();
  const { push } = useRouter();

  const isDisabled = !profile?.id || profile?.id === seller.id || !seller.id;

  if (!profile) {
    return (
      <Button
        className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
        onClick={() => {
          push("/auth/login");
        }}
        disabled={isDisabled}
      >
        Contactar Vendedor
      </Button>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
          disabled={isDisabled}
        >
          Contactar Vendedor
        </Button>
      </DialogTrigger>
      <DialogContent
        className="left-auto transform-none right-10 bottom-5 top-auto p-0"
        disableAnimation
        hideOverlay
      >
        <DialogHeader className="border-b p-4">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarFallback>{seller.firstName[0]}</AvatarFallback>
              <AvatarImage src={seller.image} />
            </Avatar>
            <div className="flex flex-col">
              <span className="text-xl font-bold">
                {seller.firstName} {seller.lastName}
              </span>
              <span className="text-gray-500">Vendedor</span>
            </div>
          </div>
        </DialogHeader>
        <SendMessageForm sellerId={seller.id} />
      </DialogContent>
    </Dialog>
  );
};

export default ContactSeller;
