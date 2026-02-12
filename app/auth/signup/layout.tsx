import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Notes | Sign Up",
  description: "Sign up for a new account to manage your notes",
};

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
