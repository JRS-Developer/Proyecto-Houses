"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProfile } from "@/hooks/useProfile";
import { Disclosure } from "@headlessui/react";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import {
  X,
  Menu as MenuIcon,
  ArrowRight,
  UserIcon,
  HomeIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode, useMemo } from "react";

export const Navbar = () => {
  const { profile } = useProfile();
  const { push } = useRouter();

  const navigation = useMemo(() => {
    const links: {
      name: string;
      href: string;
      icon?: ReactNode;
      current: boolean;
    }[] = [];

    return links;
  }, []);

  return (
    <Disclosure as="nav" className="border-solid border-b">
      {({ open }) => (
        <>
          <div className="mx-auto container ">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <X className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <Link href="/" className="flex flex-shrink-0 items-center">
                  <HomeIcon size={32} />
                </Link>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        aria-current={item.current ? "page" : undefined}
                        className={buttonVariants({ variant: "ghost" })}
                      >
                        {item?.icon}
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {!profile && (
                  <Button
                    variant="ghost"
                    rightIcon={<ArrowRight />}
                    onClick={() => push("/auth/login")}
                  >
                    Login
                  </Button>
                )}
                {profile && (
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
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard">Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <a href="/auth/logout">Cerrar Sesion</a>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};
