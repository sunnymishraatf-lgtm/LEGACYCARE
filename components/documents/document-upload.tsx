"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload } from "lucide-react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB, kept small since files are stored inline in SQLite

interface DocumentUploadProps {
  planId?: string;
}

export function DocumentUpload({ planId }: DocumentUploadProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function readFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Could not read file"));
      reader.readAsDataURL(file);
    });
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setError("File is too large. Please choose a file under 5MB.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: file.name,
          fileType: file.type || "application/octet-stream",
          fileSize: file.size,
          fileUrl: dataUrl,
          isPrivate: true,
          planId,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to upload document");
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <Card className="mb-8 border-dashed">
      <CardContent className="pt-6">
        {error && <p className="text-sm text-editorial-red mb-4">{error}</p>}
        <div className="flex flex-col items-center justify-center text-center py-6">
          <Upload className="w-8 h-8 text-ink-tertiary mb-3" />
          <p className="text-sm text-ink-secondary mb-4">
            Upload a will, insurance policy, or other important document (max 5MB)
          </p>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
          <Button type="button" onClick={() => inputRef.current?.click()} disabled={loading}>
            {loading ? "Uploading..." : "Choose File"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
