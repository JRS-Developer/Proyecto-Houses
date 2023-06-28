import { axiosAPI } from "@/lib/axios";
import { House } from "@/types/house";
import { CookieValueTypes } from "cookies-next";
import { API_ROUTES } from "./api-routes";

type GetHousesResponse = House[];
type CreateHouseData = {
  title: string;
  salePrice: number;
  yearBuilt: number;
  garageCars: number;
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
    }
  );
  return response.data;
};

export const getHouse = async (id: number, token?: CookieValueTypes) => {
  const res: House = await fetch(
    `http://localhost:3000${API_ROUTES.houses.one(id)}`,
    {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
    }
  ).then((res) => res.json());

  return res;
};

export const updateHouse = async (
  id: number,
  data: Partial<CreateHouseData>
) => {
  const res = await axiosAPI.put<{ message: string }>(
    API_ROUTES.houses.update(id),
    data
  );

  return res.data;
};

export const createHouse = async (data: CreateHouseData) => {
  const res = await axiosAPI.post<{ message: string }>(
    API_ROUTES.houses.create,
    data
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
