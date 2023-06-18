import axios from "axios";

const axiosAPI = axios.create({
  baseURL: "http://localhost:3000",
  formSerializer: {
    indexes: null, // INFO: This avoids axios transforming file upload names from images to images[] when using postForm or updateForm
  },
});

const handleAxiosError = (
  error: unknown,
  handler: (message: string) => void
) => {
  if (axios.isAxiosError(error)) {
    const { response } = error;
    const data = response?.data as { message: string };

    if (data?.message) {
      handler(data.message);
    }

    return;
  }

  console.error(error);
};

export { axiosAPI, handleAxiosError };
