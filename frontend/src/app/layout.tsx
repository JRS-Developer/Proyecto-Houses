import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
    template: "%s | Houses",
    default: "Houses",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full overflow-x-hidden`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
