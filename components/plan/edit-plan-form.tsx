"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EditPlanFormValues {
  title: string;
  funeralLocation: string;
  funeralCity: string;
  funeralType: string;
  religiousType: string;
  specialInstructions: string;
}

interface EditPlanFormProps {
  planId: string;
  initialValues: EditPlanFormValues;
}

export function EditPlanForm({ planId, initialValues }: EditPlanFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<EditPlanFormValues>(initialValues);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/plans/${planId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, changes: "Updated plan details" }),
      });
      if (!res.ok) throw new Error("Failed to update");
      router.push(`/plans/${planId}`);
      router.refresh();
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-sm text-editorial-red">{error}</p>}
          <div>
            <label className="label-default">Plan Title</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
              placeholder="Plan title"
            />
          </div>
          <div>
            <label className="label-default">Location</label>
            <Input
              value={formData.funeralLocation}
              onChange={(e) => setFormData((p) => ({ ...p, funeralLocation: e.target.value }))}
              placeholder="Funeral location"
            />
          </div>
          <div>
            <label className="label-default">City</label>
            <Input
              value={formData.funeralCity}
              onChange={(e) => setFormData((p) => ({ ...p, funeralCity: e.target.value }))}
              placeholder="City"
            />
          </div>
          <div>
            <label className="label-default">Type</label>
            <Input
              value={formData.funeralType}
              onChange={(e) => setFormData((p) => ({ ...p, funeralType: e.target.value }))}
              placeholder="Cremation, Burial, Other"
            />
          </div>
          <div>
            <label className="label-default">Religious Preference</label>
            <Input
              value={formData.religiousType}
              onChange={(e) => setFormData((p) => ({ ...p, religiousType: e.target.value }))}
              placeholder="Religious, Non-religious, Custom"
            />
          </div>
          <div>
            <label className="label-default">Special Instructions</label>
            <Input
              value={formData.specialInstructions}
              onChange={(e) => setFormData((p) => ({ ...p, specialInstructions: e.target.value }))}
              placeholder="Anything else your family should know"
            />
          </div>
          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
            <Button type="button" variant="secondary" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
