import { COOKIES_KEYS } from "@/lib/cookies";
import { getProfile } from "@/services/auth/profile";
import { cookies } from "next/dist/client/components/headers";
import { redirect } from "next/navigation";

const Register = async () => {
  const token = cookies().get(COOKIES_KEYS.TOKEN)?.value;
  const [profile] = await Promise.allSettled([getProfile(token)]);

  if (token && profile.status === "fulfilled") {
    return redirect("/dashboard");
  }

  return <div>Register</div>;
};

export default Register;
