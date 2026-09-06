import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Lock, Download } from "lucide-react";
import { DocumentUpload } from "@/components/documents/document-upload";

export const dynamic = "force-dynamic";

export default async function DocumentsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  // DEMO MODE: document storage is unavailable without an external persistence service.
  const documents: Array<{ id: string; name: string; isPrivate: boolean; fileUrl: string; fileType: string; fileSize: number; plan: { title: string } | null }> = [];
  const plan = undefined as { id: string } | undefined;

  return (
    <div className="min-h-screen bg-paper pt-24 pb-12">
      <div className="section-padding max-w-5xl mx-auto">
        <h1 className="font-display text-step-3 font-black text-ink mb-8">Documents</h1>

        <DocumentUpload planId={plan?.id} />

        {documents.length === 0 ? (
          <Card className="p-12 text-center">
            <h3 className="font-display text-step-2 font-bold text-ink mb-4">No Documents</h3>
            <p className="text-ink-secondary">Keep important instructions securely in one place.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {documents.map((doc) => (
              <Card key={doc.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-paper-soft border border-paper-raised flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-ink-secondary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <h3 className="font-medium text-ink truncate">{doc.name}</h3>
                          {doc.isPrivate && <Lock className="w-3 h-3 text-ink-tertiary flex-shrink-0" />}
                        </div>
                        <a
                          href={doc.fileUrl}
                          download={doc.name}
                          className="text-ink-secondary hover:text-ink flex-shrink-0"
                          aria-label={`Download ${doc.name}`}
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </div>
                      <p className="text-xs text-ink-secondary mt-1">{doc.fileType} • {(doc.fileSize/1024).toFixed(0)} KB</p>
                      {doc.plan && <p className="text-xs text-ink-tertiary mt-1">Linked to: {doc.plan.title}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
