import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { EditPlanForm } from "@/components/plan/edit-plan-form";

export const dynamic = "force-dynamic";

export default async function EditPlanPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const plan = await db.funeralPlan.findUnique({ where: { id: params.id } });

  if (!plan || plan.userId !== session.user.id) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-paper pt-24 pb-12">
      <div className="section-padding max-w-3xl mx-auto">
        <h1 className="font-display text-step-3 font-black text-ink mb-8">Edit Plan</h1>
        <EditPlanForm
          planId={plan.id}
          initialValues={{
            title: plan.title,
            funeralLocation: plan.funeralLocation || "",
            funeralCity: plan.funeralCity || "",
            funeralType: plan.funeralType || "",
            religiousType: plan.religiousType || "",
            specialInstructions: plan.specialInstructions || "",
          }}
        />
      </div>
    </div>
  );
}
