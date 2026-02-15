"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

import Home from "@/app/home/page";
import supabase from "@/lib/supabase-client";

export default function HomePage() {
  const router = useRouter();

  React.useEffect(() => {
    async function checkAuth() {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        toast.error("Please login to continue using the app");
        router.replace("/auth/login");
      }
      if (!data.session) {
        router.replace("/auth/login");
      }
    }

    checkAuth();
  }, [router]);

  return <Home />;
}
