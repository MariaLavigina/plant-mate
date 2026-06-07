import { ReactNode } from "react";

export const metadata = {
  title: "About Me",
  description: "Designer turned developer. Edinburgh-based. The story behind PlantMate+ and the person who built it.",
  openGraph: { url: "https://plant-mate.netlify.app/about" },
};

export default function AboutLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
