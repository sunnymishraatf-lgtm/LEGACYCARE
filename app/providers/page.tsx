import { db } from "@/lib/db";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin } from "lucide-react";

export const dynamic = "force-dynamic";


export default async function ProvidersPage() {
  const providers = await db.serviceProvider.findMany({
    where: { status: "VERIFIED" },
    include: { services: true, reviews: true },
    orderBy: { rating: "desc" },
  });

  return (
    <div className="min-h-screen bg-paper pt-24 pb-12">
      <div className="section-padding max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="font-display text-step-4 font-black text-ink mb-2">Service Providers</h1>
          <p className="text-ink-secondary">Verified professionals to help with your plan</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((provider) => (
            <Link key={provider.id} href={`/providers/${provider.id}`}>
              <Card className="h-full hover:border-ink transition-colors cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-step-0">{provider.businessName}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-2">
                        <MapPin className="w-3 h-3" />{provider.city}, {provider.state}
                      </CardDescription>
                    </div>
                    <Badge variant="success">Verified</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-ink-secondary line-clamp-2 mb-4">{provider.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-action text-action" />
                      <span className="font-mono text-sm font-bold">{provider.rating}</span>
                      <span className="text-xs text-ink-tertiary">({provider.reviewCount})</span>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-ink-secondary">{provider.category.replace("_"," ")}</span>
                  </div>
                  {provider.services.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-paper-raised">
                      <p className="text-xs text-ink-tertiary uppercase tracking-wider mb-2">Services</p>
                      <div className="space-y-1">
                        {provider.services.slice(0,2).map((s) => (
                          <div key={s.id} className="flex justify-between text-sm">
                            <span className="text-ink">{s.name}</span>
                            <span className="font-mono text-ink-secondary">${s.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
