"use client";
import HouseCard from "@/components/HouseCard";
import { House } from "@/types/house";
import React from "react";

const SearchPage = ({ houses }: { houses: House[] }) => {
  console.log({ houses });
  return (
    <div className="mt-4">
      <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        {houses?.map((h) => (
          <HouseCard house={h} key={h.id} />
        ))}
      </ul>
      SearchPage
    </div>
  );
};

export default SearchPage;
