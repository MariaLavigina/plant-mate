import "./globals.css";
import { ReactNode } from "react";
import ClientProviders from "./ClientProviders";
import DevPanel from "../components/DevPanel";
import { Akaya_Kanadaka } from "next/font/google";

const akayaKanadaka = Akaya_Kanadaka({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-akaya",
});

export const metadata = {
  title: "PlantMate",
  description: "Matching people with plants",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={akayaKanadaka.variable}>
      <body>
        <ClientProviders>{children}</ClientProviders>
        <DevPanel />
      </body>
    </html>
  );
}
