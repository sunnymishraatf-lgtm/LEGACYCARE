import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserTable } from "@/components/admin/user-table";
import { ProviderVerification } from "@/components/admin/provider-verification";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [users, plans, providers, pendingProviders, auditLogs, recentUsers, pendingProviderList] = await Promise.all([
    db.user.count(),
    db.funeralPlan.count(),
    db.serviceProvider.count(),
    db.serviceProvider.count({ where: { status: "PENDING" } }),
    db.auditLog.findMany({ take: 10, orderBy: { createdAt: "desc" }, include: { user: true } }),
    db.user.findMany({ take: 10, orderBy: { createdAt: "desc" }, include: { _count: { select: { funeralPlans: true } } } }),
    db.serviceProvider.findMany({ where: { status: "PENDING" }, include: { user: true }, orderBy: { createdAt: "desc" } }),
  ]);
  const finalizedPlans = await db.funeralPlan.count({ where: { status: "FINALIZED" } });

  return (
    <div className="section-padding max-w-7xl mx-auto py-12">
      <div className="mb-12">
        <h1 className="font-display text-step-4 font-black text-ink mb-2">Admin Dashboard</h1>
        <p className="text-ink-secondary">Platform overview and management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <Card><CardContent className="pt-6"><span className="font-mono text-step-2 font-bold text-ink block">{users}</span><span className="text-xs font-bold uppercase tracking-widest text-ink-secondary">Users</span></CardContent></Card>
        <Card><CardContent className="pt-6"><span className="font-mono text-step-2 font-bold text-ink block">{plans}</span><span className="text-xs font-bold uppercase tracking-widest text-ink-secondary">Plans</span></CardContent></Card>
        <Card><CardContent className="pt-6"><span className="font-mono text-step-2 font-bold text-ink block">{finalizedPlans}</span><span className="text-xs font-bold uppercase tracking-widest text-ink-secondary">Finalized</span></CardContent></Card>
        <Card><CardContent className="pt-6"><span className="font-mono text-step-2 font-bold text-ink block">{pendingProviders}</span><span className="text-xs font-bold uppercase tracking-widest text-ink-secondary">Pending Verifications</span></CardContent></Card>
      </div>

      <Card className="mb-12">
        <CardHeader><CardTitle>Provider Verification</CardTitle></CardHeader>
        <CardContent>
          <ProviderVerification providers={pendingProviderList} />
        </CardContent>
      </Card>

      <Card className="mb-12">
        <CardHeader><CardTitle>Users</CardTitle></CardHeader>
        <CardContent>
          <UserTable users={recentUsers} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Recent Audit Logs</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-paper-raised">
                  <th className="text-left py-3 px-4 font-bold uppercase tracking-wider text-xs text-ink-secondary">Action</th>
                  <th className="text-left py-3 px-4 font-bold uppercase tracking-wider text-xs text-ink-secondary">User</th>
                  <th className="text-left py-3 px-4 font-bold uppercase tracking-wider text-xs text-ink-secondary">Resource</th>
                  <th className="text-left py-3 px-4 font-bold uppercase tracking-wider text-xs text-ink-secondary">Time</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id} className="border-b border-paper-raised last:border-0">
                    <td className="py-3 px-4"><Badge variant="secondary">{log.action}</Badge></td>
                    <td className="py-3 px-4">{log.user?.name||"System"}</td>
                    <td className="py-3 px-4">{log.resourceType}</td>
                    <td className="py-3 px-4 font-mono text-ink-secondary">{new Date(log.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
