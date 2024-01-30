import { COOKIES_KEYS } from "@/lib/cookies";
import { getProfile } from "@/services/auth/profile";
import { cookies } from "next/dist/client/components/headers";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { ReactNode } from "react";
import SocketHandler from "@/components/SocketHandler";
import AuthProvider from "@/components/providers/AuthProvider";

export default async function Layout({ children }: { children: ReactNode }) {
  const token = cookies().get(COOKIES_KEYS.TOKEN)?.value;
  const [profile] = await Promise.allSettled([getProfile(token)]);

  console.log({ profile, token });
  if (!token || profile.status === "rejected") {
    return redirect("/auth/login");
  }

  return (
    <AuthProvider
      token={token ?? null}
      profile={profile.status === "fulfilled" ? profile?.value : null}
    >
      <DashboardLayout>{children}</DashboardLayout>
      <SocketHandler />
    </AuthProvider>
  );
}
