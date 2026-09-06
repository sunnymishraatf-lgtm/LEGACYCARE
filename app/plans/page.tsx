import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";


export default async function PlansListPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  // DEMO MODE: show the existing empty state without requiring DATABASE_URL.
  const plans: Array<{ id: string; title: string; updatedAt: Date; status: string; progress: number; _count: { nominees: number; documents: number } }> = [];

  return (
    <div className="min-h-screen bg-paper pt-24 pb-12">
      <div className="section-padding max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-step-3 font-black text-ink">My Plans</h1>
          <Link href="/plans/new"><Button>Create New Plan</Button></Link>
        </div>

        {plans.length === 0 ? (
          <Card className="p-12 text-center">
            <h3 className="font-display text-step-2 font-bold text-ink mb-4">No Plans Yet</h3>
            <p className="text-ink-secondary mb-8">Create your first funeral plan to get started.</p>
            <Link href="/plans/new"><Button>Create Plan</Button></Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {plans.map((plan) => (
              <Link key={plan.id} href={`/plans/${plan.id}`}>
                <Card className="hover:border-ink transition-colors cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-display text-step-1 font-bold text-ink">{plan.title}</h3>
                        <p className="text-sm text-ink-secondary mt-1">Updated {formatDate(plan.updatedAt)}</p>
                      </div>
                      <Badge variant={plan.status==="FINALIZED"?"success":plan.status==="ACTIVE"?"default":"secondary"}>{plan.status}</Badge>
                    </div>
                    <div className="flex gap-6 mt-4 text-xs text-ink-secondary font-mono">
                      <span>{plan.progress}% Complete</span>
                      <span>{plan._count.nominees} Nominees</span>
                      <span>{plan._count.documents} Documents</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
