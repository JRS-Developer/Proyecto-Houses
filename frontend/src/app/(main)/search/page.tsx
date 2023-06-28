import { axiosAPI } from "@/lib/axios";
import { House } from "@/types/house";
import React from "react";
import SearchPage from "./SearchPage";

const Search = async ({ searchParams }: { searchParams: { q?: string } }) => {
  const { data } = await axiosAPI.get<{ data: House[] }>(
    `/houses/search?q=${searchParams.q}`
  );

  return <SearchPage houses={data?.data ?? []} />;
};

export default Search;
