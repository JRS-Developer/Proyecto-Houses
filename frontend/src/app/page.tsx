import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <Link href="/auth/login" className={buttonVariants()}>
        Login
      </Link>
    </main>
  );
}
