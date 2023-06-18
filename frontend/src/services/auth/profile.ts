import { AxiosResponse } from "axios";
import { CookieValueTypes } from "cookies-next";
import { axiosAPI } from "@/lib/axios";
import { Profile } from "@/types/user";
import { cache } from "react";

interface ProfileResponse extends AxiosResponse {
  data: Profile;
}

export const getProfile = cache(async (token?: CookieValueTypes) => {
  const response: ProfileResponse = await axiosAPI.get("/auth/profile", {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  });
  return response.data;
});
