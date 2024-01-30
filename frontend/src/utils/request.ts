import { isAxiosError } from "axios";

export const getRequestErrorMessage = (error: unknown) => {
  let message = "Unknown error";
  if (isAxiosError(error)) {
    message = error.response?.data?.message || error.message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return Array.isArray(message) ? message[0] : message;
};
