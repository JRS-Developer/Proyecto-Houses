import { COOKIES_KEYS } from "@/lib/cookies";
import { getProfile } from "@/services/auth/profile";
import { cookies } from "next/headers";
import { Navbar } from "./Navbar";
import AuthProvider from "@/components/providers/AuthProvider";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const token = cookies().get(COOKIES_KEYS.TOKEN)?.value;
  const [profile] = await Promise.allSettled([getProfile(token)]);

  return (
    <>
      <AuthProvider
        token={token ?? null}
        profile={profile.status === "fulfilled" ? profile?.value : null}
      >
        <div className="flex flex-col h-full">
          <header>
            <Navbar />
          </header>
          <main className="mx-auto container px-2 sm:px-6 lg:px-8 flex-1">
            {children}
          </main>
        </div>
      </AuthProvider>
    </>
  );
};

export default Layout;
