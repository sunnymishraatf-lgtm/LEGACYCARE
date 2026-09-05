import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatCurrency } from "@/lib/utils";
import { BudgetCalculator } from "@/components/plan/budget-calculator";

export const dynamic = "force-dynamic";


export default async function PlanDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const plan = await db.funeralPlan.findUnique({
    where: { id: params.id },
    include: {
      ritualPrefs: true,
      ceremonyPrefs: true,
      budget: true,
      nominees: true,
      documents: true,
      versions: { orderBy: { version: "desc" } },
      serviceRequests: { include: { provider: true } },
    },
  });

  if (!plan || plan.userId !== session.user.id) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-paper pt-24 pb-12">
      <div className="section-padding max-w-5xl mx-auto">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-display text-step-3 font-black text-ink">{plan.title}</h1>
            <p className="text-ink-secondary mt-2">Created {formatDate(plan.createdAt)}</p>
          </div>
          <Badge variant={plan.status==="FINALIZED"?"success":plan.status==="ACTIVE"?"default":"secondary"}>{plan.status}</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader><CardTitle>Funeral Details</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-ink-secondary">Location</span><span className="text-ink font-medium">{plan.funeralLocation||"—"}</span></div>
              <div className="flex justify-between"><span className="text-ink-secondary">City</span><span className="text-ink font-medium">{plan.funeralCity||"—"}</span></div>
              <div className="flex justify-between"><span className="text-ink-secondary">Type</span><span className="text-ink font-medium">{plan.funeralType||"—"}</span></div>
              <div className="flex justify-between"><span className="text-ink-secondary">Religious</span><span className="text-ink font-medium">{plan.religiousType||"—"}</span></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Budget</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              {plan.budget ? (
                <>
                  <div className="flex justify-between"><span className="text-ink-secondary">Total Budget</span><span className="font-mono text-ink font-bold">{formatCurrency(plan.budget.totalBudget)}</span></div>
                  <div className="flex justify-between"><span className="text-ink-secondary">Funeral Service</span><span className="font-mono text-ink">{formatCurrency(plan.budget.funeralService)}</span></div>
                  <div className="flex justify-between"><span className="text-ink-secondary">Transportation</span><span className="font-mono text-ink">{formatCurrency(plan.budget.transportation)}</span></div>
                  <div className="flex justify-between"><span className="text-ink-secondary">Flowers</span><span className="font-mono text-ink">{formatCurrency(plan.budget.flowers)}</span></div>
                  <div className="pt-2">
                    <BudgetCalculator
                      planId={plan.id}
                      initialValues={{
                        totalBudget: plan.budget.totalBudget,
                        funeralService: plan.budget.funeralService,
                        transportation: plan.budget.transportation,
                        flowers: plan.budget.flowers,
                        clergy: plan.budget.clergy,
                        decoration: plan.budget.decoration,
                        cremation: plan.budget.cremation,
                        other: plan.budget.other,
                      }}
                    />
                  </div>
                </>
              ) : (
                <>
                  <p className="text-ink-secondary mb-3">No budget set yet.</p>
                  <BudgetCalculator planId={plan.id} />
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {plan.ritualPrefs && (
          <Card className="mb-6">
            <CardHeader><CardTitle>Ritual Preferences</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div><span className="text-ink-secondary block text-xs uppercase tracking-wider">Tradition</span><span className="text-ink font-medium">{plan.ritualPrefs.tradition||"—"}</span></div>
              <div><span className="text-ink-secondary block text-xs uppercase tracking-wider">Ritual Type</span><span className="text-ink font-medium">{plan.ritualPrefs.ritualType||"—"}</span></div>
              <div><span className="text-ink-secondary block text-xs uppercase tracking-wider">Clergy</span><span className="text-ink font-medium">{plan.ritualPrefs.clergyPref||"—"}</span></div>
              <div><span className="text-ink-secondary block text-xs uppercase tracking-wider">Language</span><span className="text-ink font-medium">{plan.ritualPrefs.language||"—"}</span></div>
            </CardContent>
          </Card>
        )}

        {plan.ceremonyPrefs && (
          <Card className="mb-6">
            <CardHeader><CardTitle>Ceremony Preferences</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div><span className="text-ink-secondary block text-xs uppercase tracking-wider">Music</span><span className="text-ink font-medium">{plan.ceremonyPrefs.music||"—"}</span></div>
              <div><span className="text-ink-secondary block text-xs uppercase tracking-wider">Flowers</span><span className="text-ink font-medium">{plan.ceremonyPrefs.flowers||"—"}</span></div>
              <div><span className="text-ink-secondary block text-xs uppercase tracking-wider">Decoration</span><span className="text-ink font-medium">{plan.ceremonyPrefs.decoration||"—"}</span></div>
              <div><span className="text-ink-secondary block text-xs uppercase tracking-wider">Duration</span><span className="text-ink font-medium">{plan.ceremonyPrefs.duration||"—"}</span></div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-4">
          <Link href={`/plans/${plan.id}/edit`}><Button>Edit Plan</Button></Link>
          <Link href="/dashboard"><Button variant="secondary">Back to Dashboard</Button></Link>
        </div>
      </div>
    </div>
  );
}
