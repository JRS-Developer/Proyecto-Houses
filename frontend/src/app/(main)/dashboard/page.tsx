import { COOKIES_KEYS } from "@/lib/cookies";
import { cookies } from "next/headers";
import DashboardPage from "./DashboardPage";
import { getHouses } from "@/services/houses";
import SWRProvider from "@/components/providers/SWRProvider";
import { API_ROUTES } from "@/services/api-routes";

export const metadata = {
  title: "Dashboard",
};

export const dynamic = "force-dynamic";

const Dashboard = async () => {
  const token = cookies().get(COOKIES_KEYS.TOKEN)?.value;
  const [houses] = await Promise.all([getHouses(token)]);

  return (
    <SWRProvider
      fallback={{
        [API_ROUTES.houses.list]: houses,
      }}
    >
      <DashboardPage />
    </SWRProvider>
  );
};

export default Dashboard;
