import React from "react";
import SearchPage from "./SearchPage";
import { searchHouses } from "@/services/houses";
import { isAxiosError } from "axios";

const Search = async ({
  searchParams,
}: {
  searchParams: { q?: string; page?: string };
}) => {
  const offset = searchParams.page ? (Number(searchParams.page) - 1) * 10 : 0;
  try {
    const data = await searchHouses({
      q: searchParams.q,
      limit: "10",
      offset: offset.toString(),
    });

    return <SearchPage data={data} />;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(error.response?.data);
    }
  }
};

export default Search;
