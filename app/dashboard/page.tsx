import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

type DashboardPlan = {
  id: string;
  title: string;
  status: string;
  progress: number;
  updatedAt: Date;
  funeralLocation: string | null;
  funeralType: string | null;
  budget: { totalBudget: number } | null;
  versions: Array<{ version: number }>;
  _count: { nominees: number; documents: number };
};

type DashboardNotification = { id: string; title: string; message: string };

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  // DEMO MODE: the dashboard is intentionally database-free so it works on Vercel
  // without DATABASE_URL. Planning APIs remain available for a database deployment.
  const plans: DashboardPlan[] = [];
  const notifications: DashboardNotification[] = [];
  const mainPlan = plans[0];

  return (
    <div className="section-padding max-w-7xl mx-auto py-12">
      <div className="mb-12">
        <h1 className="font-display text-step-4 font-black text-ink mb-2">Your Dashboard</h1>
        <p className="text-ink-secondary">Manage your plans, nominees, and documents</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <Card><CardContent className="pt-6">
          <span className="font-mono text-step-2 font-bold text-ink block">{plans.length}</span>
          <span className="text-xs font-bold uppercase tracking-widest text-ink-secondary">Plans</span>
        </CardContent></Card>
        <Card><CardContent className="pt-6">
          <span className="font-mono text-step-2 font-bold text-ink block">{plans.reduce((a,p)=>a+p._count.nominees,0)}</span>
          <span className="text-xs font-bold uppercase tracking-widest text-ink-secondary">Nominees</span>
        </CardContent></Card>
        <Card><CardContent className="pt-6">
          <span className="font-mono text-step-2 font-bold text-ink block">{plans.reduce((a,p)=>a+p._count.documents,0)}</span>
          <span className="text-xs font-bold uppercase tracking-widest text-ink-secondary">Documents</span>
        </CardContent></Card>
        <Card><CardContent className="pt-6">
          <span className="font-mono text-step-2 font-bold text-ink block">{notifications.length}</span>
          <span className="text-xs font-bold uppercase tracking-widest text-ink-secondary">Notifications</span>
        </CardContent></Card>
      </div>

      {mainPlan ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{mainPlan.title}</CardTitle>
                    <CardDescription className="mt-2">Last updated {formatDate(mainPlan.updatedAt)}</CardDescription>
                  </div>
                  <Badge variant={mainPlan.status==="FINALIZED"?"success":mainPlan.status==="ACTIVE"?"default":"secondary"}>
                    {mainPlan.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-ink-secondary uppercase tracking-wider">Completion</span>
                    <span className="font-mono text-sm font-bold text-ink">{mainPlan.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-paper-soft border border-paper-raised">
                    <div className="h-full bg-action transition-all duration-500" style={{width:`${mainPlan.progress}%`}} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-ink-tertiary block text-xs uppercase tracking-wider mb-1">Location</span><span className="text-ink font-medium">{mainPlan.funeralLocation||"Not set"}</span></div>
                  <div><span className="text-ink-tertiary block text-xs uppercase tracking-wider mb-1">Type</span><span className="text-ink font-medium">{mainPlan.funeralType||"Not set"}</span></div>
                  <div><span className="text-ink-tertiary block text-xs uppercase tracking-wider mb-1">Budget</span><span className="text-ink font-medium font-mono">{mainPlan.budget?formatCurrency(mainPlan.budget.totalBudget):"Not set"}</span></div>
                  <div><span className="text-ink-tertiary block text-xs uppercase tracking-wider mb-1">Version</span><span className="text-ink font-medium font-mono">v{mainPlan.versions[0]?.version||1}</span></div>
                </div>
                <div className="mt-8 flex gap-4">
                  <Link href={`/plans/${mainPlan.id}/edit`}><Button>Edit Plan</Button></Link>
                  <Link href={`/plans/${mainPlan.id}`}><Button variant="secondary">View Details</Button></Link>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="text-step-0">Quick Actions</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Link href="/nominees" className="block w-full"><Button variant="outline" className="w-full justify-start">Manage Nominees</Button></Link>
                <Link href="/documents" className="block w-full"><Button variant="outline" className="w-full justify-start">Upload Documents</Button></Link>
                <Link href="/providers" className="block w-full"><Button variant="outline" className="w-full justify-start">Find Providers</Button></Link>
                <Link href="/plans/new" className="block w-full"><Button variant="outline" className="w-full justify-start">Create New Plan</Button></Link>
              </CardContent>
            </Card>
            {notifications.length > 0 && (
              <Card>
                <CardHeader><CardTitle className="text-step-0">Recent Notifications</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {notifications.map((n) => (
                    <div key={n.id} className="pb-3 border-b border-paper-raised last:border-0 last:pb-0">
                      <p className="text-sm font-medium text-ink">{n.title}</p>
                      <p className="text-xs text-ink-secondary mt-1">{n.message}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      ) : (
        <Card className="p-12 text-center">
          <h3 className="font-display text-step-2 font-bold text-ink mb-4">Your Plan Is Waiting</h3>
          <p className="text-ink-secondary mb-8 max-w-md mx-auto">Start documenting the wishes that matter to you. It only takes a few minutes to begin.</p>
          <Link href="/plans/new"><Button>Create My Plan</Button></Link>
        </Card>
      )}
    </div>
  );
}
