import { useAuthStore } from "@/stores/useAuthStore";
import axios, { AxiosHeaders, isAxiosError } from "axios";
import { getAccessToken } from "./cookies";

const axiosAPI = axios.create({
  baseURL: "http://localhost:3000",
  formSerializer: {
    indexes: null, // INFO: This avoids axios transforming file upload names from images to images[] when using postForm or updateForm
  },
});

axiosAPI.interceptors.request.use((config) => {
  const state = useAuthStore.getState();
  const accessToken = state.isLoading ? getAccessToken() : state.token;

  if (accessToken && config.headers) {
    // https://github.com/axios/axios/issues/5416
    (config.headers as AxiosHeaders).set(
      "Authorization",
      `Bearer ${accessToken}`,
    );
  }

  return config;
});

const handleAxiosError = (
  error: unknown,
  handler: (message: string) => void,
) => {
  let message = "Unknown error";
  if (isAxiosError(error)) {
    message = error.response?.data?.message || error.message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return handler(Array.isArray(message) ? message[0] : message);
};

export { axiosAPI, handleAxiosError };
