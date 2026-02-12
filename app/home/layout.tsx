import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Notes | Dashboard",
  description: "Dashboard for managing your notes",
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
