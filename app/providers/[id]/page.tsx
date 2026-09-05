import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock } from "lucide-react";

export const dynamic = "force-dynamic";


export default async function ProviderDetailPage({ params }: { params: { id: string } }) {
  const provider = await db.serviceProvider.findUnique({
    where: { id: params.id },
    include: { services: true, availability: true, reviews: { include: { user: true } } },
  });

  if (!provider) notFound();

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="min-h-screen bg-paper pt-24 pb-12">
      <div className="section-padding max-w-4xl mx-auto">
        <div className="mb-8">
          <Badge variant={provider.status==="VERIFIED"?"success":"warning"} className="mb-4">{provider.status}</Badge>
          <h1 className="font-display text-step-3 font-black text-ink">{provider.businessName}</h1>
          <p className="flex items-center gap-2 text-ink-secondary mt-2">
            <MapPin className="w-4 h-4" />{provider.location}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card><CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-action text-action" />
              <span className="font-mono text-step-2 font-bold">{provider.rating}</span>
            </div>
            <span className="text-xs text-ink-secondary uppercase tracking-wider">Rating</span>
          </CardContent></Card>
          <Card><CardContent className="pt-6">
            <span className="font-mono text-step-2 font-bold text-ink block">{provider.reviewCount}</span>
            <span className="text-xs text-ink-secondary uppercase tracking-wider">Reviews</span>
          </CardContent></Card>
          <Card><CardContent className="pt-6">
            <span className="font-mono text-step-2 font-bold text-ink block">{provider.services.length}</span>
            <span className="text-xs text-ink-secondary uppercase tracking-wider">Services</span>
          </CardContent></Card>
        </div>

        <Card className="mb-8">
          <CardHeader><CardTitle>Services</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {provider.services.map((service) => (
              <div key={service.id} className="flex items-center justify-between py-3 border-b border-paper-raised last:border-0">
                <div>
                  <p className="font-medium text-ink">{service.name}</p>
                  <p className="text-sm text-ink-secondary">{service.description}</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-ink">${service.price}</span>
                  {service.duration && <p className="text-xs text-ink-tertiary flex items-center gap-1"><Clock className="w-3 h-3"/>{service.duration}</p>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader><CardTitle>Availability</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2 text-center">
              {days.map((day, i) => {
                const avail = provider.availability.find((a) => a.dayOfWeek === i);
                return (
                  <div key={day} className={`p-3 border ${avail?.isAvailable ? "border-ink bg-paper-soft" : "border-paper-raised opacity-40"}`}>
                    <span className="text-xs font-bold uppercase">{day}</span>
                    {avail?.isAvailable && <p className="text-xs text-ink-secondary mt-1">{avail.startTime}-{avail.endTime}</p>}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {provider.reviews.length > 0 && (
          <Card>
            <CardHeader><CardTitle>Reviews</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {provider.reviews.map((review) => (
                <div key={review.id} className="pb-4 border-b border-paper-raised last:border-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">{Array.from({length:5}).map((_,i)=>(<Star key={i} className={`w-3 h-3 ${i<review.rating?"fill-action text-action":"text-paper-raised"}`}/>))}</div>
                    <span className="text-xs text-ink-tertiary">{review.user?.name||"Anonymous"}</span>
                  </div>
                  <p className="text-sm text-ink-secondary">{review.comment}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
