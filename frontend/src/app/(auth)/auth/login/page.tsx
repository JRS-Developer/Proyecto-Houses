import { COOKIES_KEYS } from "@/lib/cookies";
import { getProfile } from "@/services/auth/profile";
import { cookies } from "next/dist/client/components/headers";
import { redirect } from "next/navigation";
import LoginPage from "./LoginPage";

export const metadata = {
  title: "Login",
};

const Login = async () => {
  const token = cookies().get(COOKIES_KEYS.TOKEN)?.value;
  const [profile] = await Promise.allSettled([getProfile(token)]);

  if (token && profile.status === "fulfilled") {
    return redirect("/dashboard");
  }

  return <LoginPage />;
};
export default Login;
