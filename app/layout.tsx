import "./globals.css";
import { ReactNode } from "react";
import ClientProviders from "./ClientProviders";
import { Akaya_Kanadaka } from "next/font/google";

const akayaKanadaka = Akaya_Kanadaka({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-akaya",
});

export const metadata = {
  metadataBase: new URL("https://plant-mate.netlify.app"),
  title: {
    default: "PlantMate+ | Find Your Perfect Plant Match",
    template: "%s | PlantMate+",
  },
  description: "PlantMate+ matches you with plants that fit your lifestyle, personality, and home. No guilt. No guesswork. Just plants you'll actually keep alive.",
  openGraph: {
    siteName: "PlantMate+",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "PlantMate+" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={akayaKanadaka.variable}>
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
