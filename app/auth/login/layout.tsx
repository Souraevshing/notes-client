import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Notes | Login",
  description: "Login to your account to manage your notes",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
