"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          password: formData.get("password"),
          role: formData.get("role"),
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Registration failed");
      }
      router.push("/login?registered=true");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="mb-12">
          <Link href="/" className="font-display text-2xl font-black text-ink">LEGACYCARE</Link>
          <h1 className="mt-6 font-display text-step-3 font-black text-ink">Create Account</h1>
          <p className="mt-2 text-ink-secondary">Start planning with dignity</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="label-default">Full Name</label>
            <Input name="name" required placeholder="Your name" />
          </div>
          <div>
            <label className="label-default">Email</label>
            <Input name="email" type="email" required placeholder="you@example.com" />
          </div>
          <div>
            <label className="label-default">Password</label>
            <Input name="password" type="password" required minLength={8} placeholder="Min 8 characters" />
          </div>
          <div>
            <label className="label-default">Account Type</label>
            <select name="role" className="w-full h-11 border-2 border-paper-raised bg-paper px-4 text-sm text-ink focus:border-ink focus:outline-none">
              <option value="PLANNER">I want to create a plan</option>
              <option value="PROVIDER">I am a service provider</option>
            </select>
          </div>
          {error && (
            <div className="p-4 bg-editorial-red/10 border border-editorial-red text-editorial-red text-sm">{error}</div>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>
        <div className="mt-8 text-center">
          <p className="text-sm text-ink-secondary">
            Already have an account?{" "}
            <Link href="/login" className="text-ink font-bold hover:text-editorial-red transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
