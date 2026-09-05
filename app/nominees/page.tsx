import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NomineeInvite } from "@/components/nominees/nominee-invite";

export const dynamic = "force-dynamic";


export default async function NomineesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const nominees = await db.nominee.findMany({
    where: { plan: { userId: session.user.id } },
    include: { plan: true },
    orderBy: { invitedAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-paper pt-24 pb-12">
      <div className="section-padding max-w-5xl mx-auto">
        <h1 className="font-display text-step-3 font-black text-ink mb-8">Trusted People</h1>

        <NomineeInvite />

        {nominees.length === 0 ? (
          <Card className="p-12 text-center">
            <h3 className="font-display text-step-2 font-bold text-ink mb-4">No Trusted Person Yet</h3>
            <p className="text-ink-secondary">Add someone you trust to your plan.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {nominees.map((n) => (
              <Card key={n.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-display text-step-1 font-bold text-ink">{n.name}</h3>
                      <p className="text-sm text-ink-secondary">{n.relationship}</p>
                    </div>
                    <Badge variant={n.status==="ACTIVE"?"success":n.status==="INVITED"?"warning":"secondary"}>{n.status}</Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="text-ink-secondary">{n.email}</p>
                    {n.phone && <p className="text-ink-secondary">{n.phone}</p>}
                    <p className="font-mono text-xs text-ink-tertiary uppercase tracking-wider">Access: {n.accessLevel.replace("_"," ")}</p>
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
