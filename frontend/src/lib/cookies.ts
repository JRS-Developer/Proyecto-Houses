import { deleteCookie, getCookie, setCookie } from "cookies-next";
import dayjs from "dayjs";

type OptionsType = NonNullable<Parameters<typeof getCookie>["1"]>;

export const COOKIES_KEYS = {
  TOKEN: "token_house",
};

export const getCookieExpiration = (key: keyof typeof COOKIES_KEYS): Date => {
  const SIX_MONTHS: Date = dayjs().add(6, "month").toDate();

  switch (key) {
    case "TOKEN":
      return SIX_MONTHS;
  }
};

export const setAccessToken = (token: string, options?: OptionsType) =>
  setCookie(COOKIES_KEYS.TOKEN, token, {
    expires: getCookieExpiration("TOKEN"),
    ...options,
  });

export const getAccessToken = (options?: OptionsType) => {
  const token = getCookie(COOKIES_KEYS.TOKEN, options);
  return token as string;
};

export const removeAccessToken = (options?: OptionsType) =>
  deleteCookie(COOKIES_KEYS.TOKEN, options);
