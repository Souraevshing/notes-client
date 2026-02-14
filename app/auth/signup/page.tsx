"use client";

import Link from "next/link";
import React from "react";
import { toast } from "sonner";

import AuthLayout from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoaderIcon } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";

export default function Signup() {
  const { signup } = useAuth();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function handleSignup() {
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      await signup(email, password);
      toast.success("Signup successful! Check your email.");
      setEmail("");
      setPassword("");
    } catch (err) {
      if (err instanceof Error) toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">
            Create Account
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              required
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              required
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button onClick={handleSignup} className="w-full" disabled={loading}>
            {loading ? (
              <div className="flex items-center gap-2">
                <LoaderIcon className="w-4 h-4 animate-spin" />
              </div>
            ) : (
              "Sign Up"
            )}
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="underline">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
