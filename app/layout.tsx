import "./globals.css";
import { ReactNode } from "react";
import ClientProviders from "./ClientProviders";
import DevPanel from "../components/DevPanel";

export const metadata = {
  title: "PlantMate",
  description: "Matching people with plants",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>{children}</ClientProviders>
        <DevPanel />
      </body>
    </html>
  );
}
