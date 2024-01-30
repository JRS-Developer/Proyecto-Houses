import { axiosAPI } from "@/lib/axios";
import { House } from "@/types/house";
import { CookieValueTypes } from "cookies-next";
import { API_ROUTES } from "./api-routes";

type GetHousesResponse = House[];
type CreateHouseData = {
  title: string;
  address: string;
  garageCars: number;
  yearBuilt: number;
  salePrice: number;
  kitchenAbvGr: number;
  bedRoomAbvGr: number;
  fullBath: number;
  image: string;
};

export type SearchHousesResponse = {
  data: House[];
  total: number;
  limit: number;
  offset: number;
};

export const getHouses = async (token?: CookieValueTypes) => {
  const response = await axiosAPI.get<GetHousesResponse>(
    API_ROUTES.houses.list,
    {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
    },
  );
  return response.data;
};

export const getHouse = async (id: number, token?: CookieValueTypes) => {
  const res = await axiosAPI.get<
    House & {
      user: {
        id: number;
      };
    }
  >(API_ROUTES.houses.one(id), {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  });

  return res.data;
};

export const searchHouses = async (query: {
  q?: string;
  limit?: string;
  offset?: string;
}) => {
  const searchParams = new URLSearchParams(query);
  const { data } = await axiosAPI.get<SearchHousesResponse>(
    `/houses/search?${searchParams.toString()}`,
  );

  return data;
};

export const getPriceRecommendation = async (
  data: Omit<CreateHouseData, "salePrice" | "title">,
) => {
  const res = await axiosAPI.post<{
    data: {
      price: number;
    };
  }>(API_ROUTES.houses.calculatePrice, data);

  return res.data;
};

export const updateHouse = async (
  id: number,
  data: Partial<CreateHouseData>,
) => {
  const res = await axiosAPI.put<{ message: string }>(
    API_ROUTES.houses.update(id),
    data,
  );

  return res.data;
};

export const createHouse = async (data: CreateHouseData) => {
  const res = await axiosAPI.post<{ message: string }>(
    API_ROUTES.houses.create,
    data,
  );

  return res.data;
};

export const deleteHouse = async (id: number, token?: CookieValueTypes) => {
  const response = await axiosAPI.delete<House>(API_ROUTES.houses.delete(id), {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  });

  return response.data;
};
