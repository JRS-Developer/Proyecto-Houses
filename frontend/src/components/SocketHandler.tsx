"use client";
import { ServerToClientEvents, socket } from "@/lib/socket";
import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect } from "react";
import { toast } from "sonner";

const SocketHandler = () => {
  const token = useAuthStore((s) => s.token);

  const onDisconnect = () => {
    console.log("disconnected");
  };

  const handleException: ServerToClientEvents["exception"] = (error) => {
    let message: string = "";

    if (Array.isArray(error)) {
      message = error.join(", ");
    } else if (typeof error === "object") {
      message = error.message;
    } else {
      message = error;
    }

    toast.dismiss();
    toast.error(message);
  };

  useEffect(() => {
    if (token) {
      socket.auth = {
        token: `Bearer ${token}`,
      };
      socket.connect();
      socket.emit("subscribe");
    }
  }, [token]);

  useEffect(() => {
    socket.on("disconnect", onDisconnect);

    socket.on("exception", handleException);

    return () => {
      socket.off("disconnect", onDisconnect);

      socket.off("exception", handleException);

      socket.disconnect();
    };
  }, []);

  return null;
};

export default SocketHandler;
