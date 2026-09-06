"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { findLocalDemoAccount } from "@/lib/demo-auth";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    try {
      const email = String(formData.get("email") || "");
      const password = String(formData.get("password") || "");
      const browserAccount = findLocalDemoAccount(email, password);
      const res = await signIn("credentials", {
        email,
        password,
        demoLocal: browserAccount ? "true" : "false",
        demoName: browserAccount?.name,
        demoRole: browserAccount?.role,
        redirect: false,
      });
      if (!res || res.error) {
        setError("Invalid email or password");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Unable to sign in right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="mb-12">
          <Link href="/" className="font-display text-2xl font-black text-ink">LEGACYCARE</Link>
          <h1 className="mt-6 font-display text-step-3 font-black text-ink">Welcome Back</h1>
          <p className="mt-2 text-ink-secondary">Sign in to access your plan</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="label-default">Email</label>
            <Input name="email" type="email" required placeholder="you@example.com" />
          </div>
          <div>
            <label className="label-default">Password</label>
            <Input name="password" type="password" required placeholder="••••••••" />
          </div>
          {error && (
            <div className="p-4 bg-editorial-red/10 border border-editorial-red text-editorial-red text-sm">{error}</div>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
        <div className="mt-8 text-center">
          <p className="text-sm text-ink-secondary">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-ink font-bold hover:text-editorial-red transition-colors">Create one</Link>
          </p>
        </div>
        <div className="mt-12 p-4 bg-paper-soft border border-paper-raised">
          <p className="text-xs text-ink-tertiary mb-2 font-bold uppercase tracking-wider">Demo Accounts</p>
          <div className="space-y-1 text-xs text-ink-secondary font-mono">
            <p>admin@legacycare.app / password123</p>
            <p>planner@legacycare.app / password123</p>
            <p>provider@legacycare.app / password123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
