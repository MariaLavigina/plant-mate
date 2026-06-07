import { ReactNode } from "react";

export const metadata = {
  title: "My Profile",
  description: "View your plant match, badge history, and quiz stats on PlantMate+.",
  openGraph: { url: "https://plant-mate.netlify.app/profile" },
};

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
