import { ReactNode } from "react";

export const metadata = {
  title: "Find Your Plant Match",
  description: "Answer a few questions and discover the houseplant that perfectly fits your lifestyle, personality, and home.",
  openGraph: { url: "https://plant-mate.netlify.app/quiz" },
};

export default function QuizLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
