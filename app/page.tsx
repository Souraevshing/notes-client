"use client";

import { useRouter } from "next/navigation";
import React from "react";

import Home from "@/app/home/page";
import supabase from "@/lib/supabase-client";

export default function HomePage() {
  const router = useRouter();

  React.useEffect(() => {
    async function checkAuth() {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace("/auth/login");
      }
    }

    checkAuth();
  }, [router]);

  return <Home />;
}
