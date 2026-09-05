"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProviderStatus } from "@/lib/constants";

interface PendingProvider {
  id: string;
  businessName: string;
  category: string;
  city: string;
  state: string;
  status: string;
  user: { name: string | null; email: string };
}

interface ProviderVerificationProps {
  providers: PendingProvider[];
}

export function ProviderVerification({ providers }: ProviderVerificationProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function updateStatus(id: string, status: string) {
    setLoadingId(id);
    setError(null);
    try {
      const res = await fetch("/api/admin/providers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to update provider");
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoadingId(null);
    }
  }

  if (providers.length === 0) {
    return <p className="text-sm text-ink-secondary">No providers awaiting verification.</p>;
  }

  return (
    <div className="space-y-4">
      {error && <p className="text-sm text-editorial-red">{error}</p>}
      {providers.map((provider) => (
        <div
          key={provider.id}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 border-b border-paper-raised last:border-0"
        >
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-ink">{provider.businessName}</h4>
              <Badge variant="warning">{provider.status}</Badge>
            </div>
            <p className="text-xs text-ink-secondary mt-1">
              {provider.category} • {provider.city}, {provider.state}
            </p>
            <p className="text-xs text-ink-tertiary mt-1">
              {provider.user.name || "Unnamed"} • {provider.user.email}
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Button
              size="sm"
              disabled={loadingId === provider.id}
              onClick={() => updateStatus(provider.id, ProviderStatus.VERIFIED)}
            >
              Approve
            </Button>
            <Button
              size="sm"
              variant="destructive"
              disabled={loadingId === provider.id}
              onClick={() => updateStatus(provider.id, ProviderStatus.REJECTED)}
            >
              Reject
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
