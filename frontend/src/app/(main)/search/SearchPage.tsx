"use client";
import HouseCard from "@/components/HouseCard";
import { Pagination } from "@/components/ui/pagination";
import { SearchHousesResponse } from "@/services/houses";
import { usePathname, useSearchParams } from "next/navigation";

const SearchPage = ({ data }: { data: SearchHousesResponse }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const houses = data?.data;

  const page = searchParams.get("page");
  const total = data.total;

  return (
    <div className="mt-4  mb-8">
      <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        {houses?.map((h) => <HouseCard house={h} key={h.id} />)}
      </ul>
      <Pagination
        page={Number(page || 1)}
        count={total ? Math.ceil(total / 10) : 1}
        getItemHref={(page) => {
          const urlSearchParams = new URLSearchParams(searchParams);
          urlSearchParams.set("page", page.toString());

          return `${pathname}?${urlSearchParams.toString()}`;
        }}
      />
    </div>
  );
};

export default SearchPage;
