import DashboardContainer from "@/components/DashboardContainer";
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

  return (
    <DashboardContainer title="Actualizar propiedad">
      <HouseForm house={house} isEdit />
    </DashboardContainer>
  );
};

export default EditHouse;
