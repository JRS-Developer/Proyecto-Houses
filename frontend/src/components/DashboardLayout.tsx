"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import { ReactNode, useRef, useState } from "react";
import { HomeIcon, MenuIcon, MessageCircleIcon, UserIcon } from "lucide-react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { usePathname } from "next/navigation";

const navigation: { icon: ReactNode; title: string; href: string }[] = [
  {
    title: "Home",
    icon: <HomeIcon className="h-4 w-4" />,
    href: "/dashboard",
  },
  {
    title: "Chats",
    icon: <MessageCircleIcon className="h-4 w-4" />,
    href: "/dashboard/chats",
  },
];

const ActiveLink = ({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 ${
        isActive ? "bg-gray-100 text-gray-900" : "text-gray-500 "
      }`}
      href={href}
    >
      {children}
    </Link>
  );
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const navigationRef = useRef(null);

  useClickOutside(navigationRef, () => open && setOpen(false));

  return (
    <div className="grid min-h-screen w-full overflow-hidden lg:grid-cols-[280px_1fr]">
      <div
        className={`${
          open ? "left-0" : "-left-full lg:left-0"
        } fixed h-full z-10 bg-white lg:relative border-r lg:bg-gray-100/40 lg:block transition-all`}
        ref={navigationRef}
      >
        <div className="flex flex-col gap-2">
          <div className="flex h-[60px] items-center px-6">
            <Link className="flex items-center gap-2 font-semibold" href="#">
              <span className="">Dashboard</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-4 text-sm font-medium">
              {navigation.map((nav) => (
                <ActiveLink key={nav.title} href={nav.href}>
                  {nav.icon}
                  {nav.title}
                </ActiveLink>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setOpen(!open)}
            className="lg:hidden"
          >
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Open Navigation</span>
          </Button>
          <div className="ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="rounded-full border border-gray-200 w-8 h-8 dark:border-gray-800"
                  size="icon"
                  variant="ghost"
                >
                  <UserIcon />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                {/* <DropdownMenuSeparator /> */}
                {/* <DropdownMenuItem>Settings</DropdownMenuItem> */}
                {/* <DropdownMenuItem>Support</DropdownMenuItem> */}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a href={"/auth/logout"}>Cerrar Sesion</a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 p-4  md:p-6">{children}</main>
      </div>
    </div>
  );
}
