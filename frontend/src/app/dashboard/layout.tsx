import AuthProvider from "@/components/providers/AuthProvider";
import { COOKIES_KEYS } from "@/lib/cookies";
import { getProfile } from "@/services/auth/profile";
import { cookies } from "next/dist/client/components/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = cookies().get(COOKIES_KEYS.TOKEN)?.value;
  const [profile] = await Promise.allSettled([getProfile(token)]);

  if (!token || profile.status === "rejected") {
    return redirect("/auth/login");
  }

  return (
    <AuthProvider token={token} profile={profile.value}>
      {children}
    </AuthProvider>
  );
}
