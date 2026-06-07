import { ReactNode } from "react";

export const metadata = {
  title: "Your Plant Match",
  description: "You've found your perfect plant match. Discover why it suits you and explore everything about your plant.",
  openGraph: { url: "https://plant-mate.netlify.app/results" },
};

export default function ResultsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
