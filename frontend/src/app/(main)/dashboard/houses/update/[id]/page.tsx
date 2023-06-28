import HouseForm from "@/components/HouseForm";
import { COOKIES_KEYS } from "@/lib/cookies";
import { getHouse } from "@/services/houses";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const EditHouse = async ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const id = Number(params?.id);
  const token = cookies().get(COOKIES_KEYS.TOKEN)?.value;

  if (!id || isNaN(id)) {
    return notFound();
  }

  const house = await getHouse(id, token);

  console.log({ house });

  return (
    <div className="flex flex-col gap-6">
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Actualizar propiedad
          </h2>
        </div>
      </div>

      <HouseForm house={house} isEdit />
    </div>
  );
};

export default EditHouse;
