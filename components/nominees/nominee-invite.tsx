"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NomineeAccess } from "@/lib/constants";

const ACCESS_OPTIONS: { value: string; label: string }[] = [
  { value: NomineeAccess.VIEW_ONLY, label: "View Only" },
  { value: NomineeAccess.FULL_ACCESS, label: "Full Access" },
  { value: NomineeAccess.EXECUTION_ACCESS, label: "Execution Access" },
];

export function NomineeInvite() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    relationship: "",
    email: "",
    phone: "",
    accessLevel: NomineeAccess.VIEW_ONLY as string,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/nominees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to add trusted person");
      }
      setFormData({ name: "", relationship: "", email: "", phone: "", accessLevel: NomineeAccess.VIEW_ONLY });
      setOpen(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} className="mb-8">
        Add Trusted Person
      </Button>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-step-0">Add a Trusted Person</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-editorial-red">{error}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-default">Name</label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                placeholder="Full name"
              />
            </div>
            <div>
              <label className="label-default">Relationship</label>
              <Input
                value={formData.relationship}
                onChange={(e) => setFormData((p) => ({ ...p, relationship: e.target.value }))}
                placeholder="e.g. Spouse, Child, Friend"
              />
            </div>
            <div>
              <label className="label-default">Email</label>
              <Input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="label-default">Phone</label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                placeholder="Optional"
              />
            </div>
          </div>
          <div>
            <label className="label-default">Access Level</label>
            <select
              className="flex h-11 w-full border-2 border-paper-raised bg-paper px-4 py-2 text-sm text-ink focus:border-ink focus:outline-none"
              value={formData.accessLevel}
              onChange={(e) => setFormData((p) => ({ ...p, accessLevel: e.target.value }))}
            >
              {ACCESS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Trusted Person"}
            </Button>
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
