import HousePage from "./HousePage";
import { getHouse } from "@/services/houses";
import { notFound } from "next/navigation";

const getData = async (id: number) => {
  try {
    const house = await getHouse(id);
    return { house };
  } catch (error) {
    return notFound();
  }
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return notFound();
  }

  const { house } = await getData(id);

  return <HousePage house={house} />;
}
