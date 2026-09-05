"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

interface BudgetValues {
  totalBudget: number;
  funeralService: number;
  transportation: number;
  flowers: number;
  clergy: number;
  decoration: number;
  cremation: number;
  other: number;
}

const FIELDS: { key: keyof BudgetValues; label: string }[] = [
  { key: "totalBudget", label: "Total Budget" },
  { key: "funeralService", label: "Funeral Service" },
  { key: "transportation", label: "Transportation" },
  { key: "flowers", label: "Flowers" },
  { key: "clergy", label: "Clergy" },
  { key: "decoration", label: "Decoration" },
  { key: "cremation", label: "Cremation/Burial" },
  { key: "other", label: "Other" },
];

const EMPTY_BUDGET: BudgetValues = {
  totalBudget: 0,
  funeralService: 0,
  transportation: 0,
  flowers: 0,
  clergy: 0,
  decoration: 0,
  cremation: 0,
  other: 0,
};

interface BudgetCalculatorProps {
  planId: string;
  initialValues?: Partial<BudgetValues>;
}

export function BudgetCalculator({ planId, initialValues }: BudgetCalculatorProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(!initialValues);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [values, setValues] = useState<BudgetValues>({ ...EMPTY_BUDGET, ...initialValues });

  const allocatedTotal = FIELDS.filter((f) => f.key !== "totalBudget").reduce(
    (sum, f) => sum + (values[f.key] || 0),
    0
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, ...values }),
      });
      if (!res.ok) throw new Error("Failed to save budget");
      setEditing(false);
      router.refresh();
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!editing) {
    return (
      <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>
        Edit Budget
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-sm text-editorial-red">{error}</p>}
      <div className="grid grid-cols-2 gap-4">
        {FIELDS.map((field) => (
          <div key={field.key}>
            <label className="label-default">{field.label}</label>
            <Input
              type="number"
              min={0}
              step="0.01"
              value={values[field.key]}
              onChange={(e) =>
                setValues((p) => ({ ...p, [field.key]: parseFloat(e.target.value) || 0 }))
              }
            />
          </div>
        ))}
      </div>
      <p className="text-xs text-ink-secondary">
        Allocated so far: <span className="font-mono">{formatCurrency(allocatedTotal)}</span>
      </p>
      <div className="flex gap-4">
        <Button type="submit" size="sm" disabled={loading}>
          {loading ? "Saving..." : "Save Budget"}
        </Button>
        {initialValues && (
          <Button type="button" size="sm" variant="secondary" onClick={() => setEditing(false)}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
