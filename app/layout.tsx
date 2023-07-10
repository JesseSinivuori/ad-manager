import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "../components/nav/navbar";
import Providers from "@/providers/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "The Ad Manager",
  description: "The ultimate ad manager.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-stone-50 text-stone-950 flex justify-center">
      <body className={`${inter.className} flex flex-col w-full`}>
        <Navbar />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
