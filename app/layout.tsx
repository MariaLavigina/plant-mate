import "./globals.css";
import { ReactNode } from "react";
import ClientProviders from "./ClientProviders"; // just import directly

// ✅ metadata is server-only
export const metadata = {
  title: "PlantMate",
  description: "Matching people with plants",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* ClientProviders is a client component, server layout can wrap it directly */}
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}