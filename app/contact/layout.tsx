import { ReactNode } from "react";

export const metadata = {
  title: "Contact",
  description: "Get in touch with the creator of PlantMate+. Drop a message - always happy to hear from you.",
  openGraph: { url: "https://plant-mate.netlify.app/contact" },
};

export default function ContactLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
