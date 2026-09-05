"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  { id: 1, title: "PERSONAL" },
  { id: 2, title: "FUNERAL" },
  { id: 3, title: "RITUALS" },
  { id: 4, title: "CEREMONY" },
  { id: 5, title: "SERVICES" },
  { id: 6, title: "BUDGET" },
  { id: 7, title: "DOCUMENTS" },
  { id: 8, title: "NOMINEE" },
  { id: 9, title: "REVIEW" },
  { id: 10, title: "FINALIZE" },
];

type FormData = {
  title: string;
  funeralLocation: string;
  funeralCity: string;
  funeralType: string;
  religiousType: string;
  specialInstructions: string;

  tradition: string;
  ritualType: string;
  clergyPref: string;
  prayers: string;
  customs: string;

  music: string;
  flowers: string;
  decoration: string;
  clothing: string;
  duration: string;

  totalBudget: number;
  funeralService: number;
  transportation: number;
  budgetFlowers: number;
  budgetClergy: number;
  budgetDecoration: number;
  cremation: number;
  other: number;

  nomineeName: string;
  nomineeRelationship: string;
  nomineeEmail: string;
  nomineePhone: string;
  nomineeAccessLevel: string;
};

const initialFormData: FormData = {
  title: "",
  funeralLocation: "",
  funeralCity: "",
  funeralType: "",
  religiousType: "",
  specialInstructions: "",

  tradition: "",
  ritualType: "",
  clergyPref: "",
  prayers: "",
  customs: "",

  music: "",
  flowers: "",
  decoration: "",
  clothing: "",
  duration: "",

  totalBudget: 0,
  funeralService: 0,
  transportation: 0,
  budgetFlowers: 0,
  budgetClergy: 0,
  budgetDecoration: 0,
  cremation: 0,
  other: 0,

  nomineeName: "",
  nomineeRelationship: "",
  nomineeEmail: "",
  nomineePhone: "",
  nomineeAccessLevel: "VIEW_ONLY",
};

export default function NewPlanPage() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] =
    useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateField<K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function updateNumberField(
    field:
      | "totalBudget"
      | "funeralService"
      | "transportation"
      | "budgetFlowers"
      | "budgetClergy"
      | "budgetDecoration"
      | "cremation"
      | "other",
    value: string
  ) {
    const numberValue = Number(value);

    updateField(
      field,
      Number.isFinite(numberValue) && numberValue >= 0
        ? numberValue
        : 0
    );
  }

  function validateCurrentStep() {
    setError("");

    if (currentStep === 0) {
      if (!formData.title.trim()) {
        setError("Please enter a plan title.");
        return false;
      }
    }

    if (currentStep === 1) {
      if (!formData.funeralType) {
        setError("Please select a funeral type.");
        return false;
      }

      if (!formData.religiousType) {
        setError("Please select a religious type.");
        return false;
      }
    }

    if (currentStep === 7) {
      if (formData.nomineeEmail.trim() && !formData.nomineeName.trim()) {
        setError("Please enter the nominee's name.");
        return false;
      }

      if (formData.nomineeName.trim() && !formData.nomineeEmail.trim()) {
        setError("Please enter the nominee's email.");
        return false;
      }
    }

    return true;
  }

  function handleContinue() {
    if (!validateCurrentStep()) {
      return;
    }

    setCurrentStep((step) =>
      Math.min(step + 1, steps.length - 1)
    );
  }

  function handleBack() {
    setError("");

    setCurrentStep((step) =>
      Math.max(step - 1, 0)
    );
  }

  async function createPlan() {
    if (!validateCurrentStep()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      /*
       * STEP 1:
       * Create the main FuneralPlan first.
       *
       * The /api/plans endpoint already supports these fields.
       */
      const planResponse = await fetch("/api/plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title:
            formData.title.trim() ||
            "My Funeral Plan",

          funeralLocation:
            formData.funeralLocation.trim() || undefined,

          funeralCity:
            formData.funeralCity.trim() || undefined,

          funeralType:
            formData.funeralType || undefined,

          religiousType:
            formData.religiousType || undefined,

          specialInstructions:
            formData.specialInstructions.trim() || undefined,
        }),
      });

      if (!planResponse.ok) {
        const result = await planResponse.json().catch(() => null);

        throw new Error(
          result?.error ||
            "Failed to create the funeral plan."
        );
      }

      const plan = await planResponse.json();

      if (!plan?.id) {
        throw new Error(
          "The server did not return a valid plan ID."
        );
      }

      /*
       * STEP 2:
       * Save budget using the existing budget API.
       */
      const hasBudget =
        formData.totalBudget > 0 ||
        formData.funeralService > 0 ||
        formData.transportation > 0 ||
        formData.budgetFlowers > 0 ||
        formData.budgetClergy > 0 ||
        formData.budgetDecoration > 0 ||
        formData.cremation > 0 ||
        formData.other > 0;

      if (hasBudget) {
        const budgetResponse = await fetch("/api/budget", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            planId: plan.id,
            totalBudget: formData.totalBudget,
            funeralService: formData.funeralService,
            transportation: formData.transportation,
            flowers: formData.budgetFlowers,
            clergy: formData.budgetClergy,
            decoration: formData.budgetDecoration,
            cremation: formData.cremation,
            other: formData.other,
          }),
        });

        if (!budgetResponse.ok) {
          console.error(
            "Budget could not be saved."
          );
        }
      }

      /*
       * NOTE:
       *
       * Ritual preferences, ceremony preferences,
       * nominee, services and documents are collected
       * separately by the full application.
       *
       * The current project does not have dedicated
       * API routes for rituals or ceremony preferences,
       * so we do NOT pretend that those fields were saved.
       *
       * We will add those APIs in the next fixes.
       */

      router.push(`/plans/${plan.id}`);
    } catch (err) {
      console.error("Create plan error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );

      setLoading(false);
    }
  }

  const step = steps[currentStep];

  return (
    <div className="min-h-screen bg-paper pt-24 pb-12">
      <div className="section-padding max-w-3xl mx-auto">

        {/* Progress */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-1 bg-paper-raised">
              <div
                className="h-full bg-ink transition-all duration-300"
                style={{
                  width: `${
                    ((currentStep + 1) /
                      steps.length) *
                    100
                  }%`,
                }}
              />
            </div>

            <span className="font-mono text-xs text-ink-secondary">
              {String(currentStep + 1).padStart(2, "0")}/
              {String(steps.length).padStart(2, "0")}
            </span>
          </div>

          <h1 className="font-display text-step-3 font-black text-ink">
            {step.title}
          </h1>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 border-2 border-red-500 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <Card>
          <CardContent className="pt-6">

            {/* STEP 1 — PERSONAL */}
            {currentStep === 0 && (
              <div className="space-y-6">

                <div>
                  <label className="label-default">
                    Plan Title
                  </label>

                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      updateField(
                        "title",
                        e.target.value
                      )
                    }
                    placeholder="e.g., My Funeral Plan"
                  />
                </div>

                <div>
                  <label className="label-default">
                    Preferred Funeral Location
                  </label>

                  <Input
                    value={formData.funeralLocation}
                    onChange={(e) =>
                      updateField(
                        "funeralLocation",
                        e.target.value
                      )
                    }
                    placeholder="e.g., St. Mary's Church"
                  />
                </div>

                <div>
                  <label className="label-default">
                    City
                  </label>

                  <Input
                    value={formData.funeralCity}
                    onChange={(e) =>
                      updateField(
                        "funeralCity",
                        e.target.value
                      )
                    }
                    placeholder="e.g., Boston"
                  />
                </div>
              </div>
            )}

            {/* STEP 2 — FUNERAL */}
            {currentStep === 1 && (
              <div className="space-y-6">

                <div>
                  <label className="label-default">
                    Funeral Type
                  </label>

                  <select
                    value={formData.funeralType}
                    onChange={(e) =>
                      updateField(
                        "funeralType",
                        e.target.value
                      )
                    }
                    className="w-full h-11 border-2 border-paper-raised bg-paper px-4 text-sm text-ink focus:border-ink focus:outline-none"
                  >
                    <option value="">
                      Select type
                    </option>
                    <option value="Cremation">
                      Cremation
                    </option>
                    <option value="Burial">
                      Burial
                    </option>
                    <option value="Other">
                      Other
                    </option>
                  </select>
                </div>

                <div>
                  <label className="label-default">
                    Religious Type
                  </label>

                  <select
                    value={formData.religiousType}
                    onChange={(e) =>
                      updateField(
                        "religiousType",
                        e.target.value
                      )
                    }
                    className="w-full h-11 border-2 border-paper-raised bg-paper px-4 text-sm text-ink focus:border-ink focus:outline-none"
                  >
                    <option value="">
                      Select
                    </option>
                    <option value="Religious">
                      Religious
                    </option>
                    <option value="Non-religious">
                      Non-religious
                    </option>
                    <option value="Custom">
                      Custom
                    </option>
                  </select>
                </div>

                <div>
                  <label className="label-default">
                    Special Instructions
                  </label>

                  <textarea
                    value={formData.specialInstructions}
                    onChange={(e) =>
                      updateField(
                        "specialInstructions",
                        e.target.value
                      )
                    }
                    rows={4}
                    className="w-full border-2 border-paper-raised bg-paper px-4 py-3 text-sm text-ink focus:border-ink focus:outline-none resize-none"
                    placeholder="Any specific instructions..."
                  />
                </div>
              </div>
            )}

            {/* STEP 3 — RITUALS */}
            {currentStep === 2 && (
              <div className="space-y-6">

                <div>
                  <label className="label-default">
                    Tradition
                  </label>

                  <Input
                    value={formData.tradition}
                    onChange={(e) =>
                      updateField(
                        "tradition",
                        e.target.value
                      )
                    }
                    placeholder="e.g., Hindu, Christian, Buddhist"
                  />
                </div>

                <div>
                  <label className="label-default">
                    Ritual Type
                  </label>

                  <Input
                    value={formData.ritualType}
                    onChange={(e) =>
                      updateField(
                        "ritualType",
                        e.target.value
                      )
                    }
                    placeholder="Preferred ritual type"
                  />
                </div>

                <div>
                  <label className="label-default">
                    Clergy Preference
                  </label>

                  <Input
                    value={formData.clergyPref}
                    onChange={(e) =>
                      updateField(
                        "clergyPref",
                        e.target.value
                      )
                    }
                    placeholder="Any preferred clergy"
                  />
                </div>

                <div>
                  <label className="label-default">
                    Prayers
                  </label>

                  <textarea
                    value={formData.prayers}
                    onChange={(e) =>
                      updateField(
                        "prayers",
                        e.target.value
                      )
                    }
                    rows={3}
                    className="w-full border-2 border-paper-raised bg-paper px-4 py-3 text-sm text-ink focus:border-ink focus:outline-none resize-none"
                    placeholder="Prayer preferences"
                  />
                </div>

                <div>
                  <label className="label-default">
                    Customs
                  </label>

                  <textarea
                    value={formData.customs}
                    onChange={(e) =>
                      updateField(
                        "customs",
                        e.target.value
                      )
                    }
                    rows={3}
                    className="w-full border-2 border-paper-raised bg-paper px-4 py-3 text-sm text-ink focus:border-ink focus:outline-none resize-none"
                    placeholder="Custom rituals or traditions"
                  />
                </div>
              </div>
            )}

            {/* STEP 4 — CEREMONY */}
            {currentStep === 3 && (
              <div className="space-y-6">

                <div>
                  <label className="label-default">
                    Music
                  </label>

                  <Input
                    value={formData.music}
                    onChange={(e) =>
                      updateField(
                        "music",
                        e.target.value
                      )
                    }
                    placeholder="Music preferences"
                  />
                </div>

                <div>
                  <label className="label-default">
                    Flowers
                  </label>

                  <Input
                    value={formData.flowers}
                    onChange={(e) =>
                      updateField(
                        "flowers",
                        e.target.value
                      )
                    }
                    placeholder="Flower preferences"
                  />
                </div>

                <div>
                  <label className="label-default">
                    Decoration
                  </label>

                  <Input
                    value={formData.decoration}
                    onChange={(e) =>
                      updateField(
                        "decoration",
                        e.target.value
                      )
                    }
                    placeholder="Decoration preferences"
                  />
                </div>

                <div>
                  <label className="label-default">
                    Clothing
                  </label>

                  <Input
                    value={formData.clothing}
                    onChange={(e) =>
                      updateField(
                        "clothing",
                        e.target.value
                      )
                    }
                    placeholder="Clothing preferences"
                  />
                </div>

                <div>
                  <label className="label-default">
                    Ceremony Duration
                  </label>

                  <Input
                    value={formData.duration}
                    onChange={(e) =>
                      updateField(
                        "duration",
                        e.target.value
                      )
                    }
                    placeholder="e.g., 60 minutes"
                  />
                </div>
              </div>
            )}

            {/* STEP 5 — SERVICES */}
            {currentStep === 4 && (
              <div className="py-12 text-center">
                <h3 className="font-display text-step-2 font-bold text-ink mb-4">
                  Service Selection
                </h3>

                <p className="text-ink-secondary">
                  Service provider selection will be
                  connected after the plan is created.
                </p>

                <p className="text-sm text-ink-tertiary mt-2">
                  You can continue and add services
                  from the plan page.
                </p>
              </div>
            )}

            {/* STEP 6 — BUDGET */}
            {currentStep === 5 && (
              <div className="space-y-6">

                <div>
                  <label className="label-default">
                    Total Budget
                  </label>

                  <Input
                    type="number"
                    min="0"
                    value={formData.totalBudget}
                    onChange={(e) =>
                      updateNumberField(
                        "totalBudget",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div>
                  <label className="label-default">
                    Funeral Service
                  </label>

                  <Input
                    type="number"
                    min="0"
                    value={formData.funeralService}
                    onChange={(e) =>
                      updateNumberField(
                        "funeralService",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div>
                  <label className="label-default">
                    Transportation
                  </label>

                  <Input
                    type="number"
                    min="0"
                    value={formData.transportation}
                    onChange={(e) =>
                      updateNumberField(
                        "transportation",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div>
                  <label className="label-default">
                    Flowers
                  </label>

                  <Input
                    type="number"
                    min="0"
                    value={formData.budgetFlowers}
                    onChange={(e) =>
                      updateNumberField(
                        "budgetFlowers",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div>
                  <label className="label-default">
                    Clergy
                  </label>

                  <Input
                    type="number"
                    min="0"
                    value={formData.budgetClergy}
                    onChange={(e) =>
                      updateNumberField(
                        "budgetClergy",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div>
                  <label className="label-default">
                    Decoration
                  </label>

                  <Input
                    type="number"
                    min="0"
                    value={formData.budgetDecoration}
                    onChange={(e) =>
                      updateNumberField(
                        "budgetDecoration",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div>
                  <label className="label-default">
                    Cremation
                  </label>

                  <Input
                    type="number"
                    min="0"
                    value={formData.cremation}
                    onChange={(e) =>
                      updateNumberField(
                        "cremation",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div>
                  <label className="label-default">
                    Other
                  </label>

                  <Input
                    type="number"
                    min="0"
                    value={formData.other}
                    onChange={(e) =>
                      updateNumberField(
                        "other",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
            )}

            {/* STEP 7 — DOCUMENTS */}
            {currentStep === 6 && (
              <div className="py-12 text-center">
                <h3 className="font-display text-step-2 font-bold text-ink mb-4">
                  Documents
                </h3>

                <p className="text-ink-secondary">
                  Documents can be uploaded from the
                  plan page after the plan is created.
                </p>
              </div>
            )}

            {/* STEP 8 — NOMINEE */}
            {currentStep === 7 && (
              <div className="space-y-6">

                <div>
                  <label className="label-default">
                    Nominee Name
                  </label>

                  <Input
                    value={formData.nomineeName}
                    onChange={(e) =>
                      updateField(
                        "nomineeName",
                        e.target.value
                      )
                    }
                    placeholder="Full name"
                  />
                </div>

                <div>
                  <label className="label-default">
                    Relationship
                  </label>

                  <Input
                    value={formData.nomineeRelationship}
                    onChange={(e) =>
                      updateField(
                        "nomineeRelationship",
                        e.target.value
                      )
                    }
                    placeholder="e.g., Brother"
                  />
                </div>

                <div>
                  <label className="label-default">
                    Email
                  </label>

                  <Input
                    type="email"
                    value={formData.nomineeEmail}
                    onChange={(e) =>
                      updateField(
                        "nomineeEmail",
                        e.target.value
                      )
                    }
                    placeholder="nominee@example.com"
                  />
                </div>

                <div>
                  <label className="label-default">
                    Phone
                  </label>

                  <Input
                    value={formData.nomineePhone}
                    onChange={(e) =>
                      updateField(
                        "nomineePhone",
                        e.target.value
                      )
                    }
                    placeholder="Phone number"
                  />
                </div>

                <div>
                  <label className="label-default">
                    Access Level
                  </label>

                  <select
                    value={formData.nomineeAccessLevel}
                    onChange={(e) =>
                      updateField(
                        "nomineeAccessLevel",
                        e.target.value
                      )
                    }
                    className="w-full h-11 border-2 border-paper-raised bg-paper px-4 text-sm text-ink focus:border-ink focus:outline-none"
                  >
                    <option value="VIEW_ONLY">
                      View Only
                    </option>

                    <option value="FULL_ACCESS">
                      Full Access
                    </option>

                    <option value="EXECUTION_ACCESS">
                      Execution Access
                    </option>
                  </select>
                </div>
              </div>
            )}

            {/* STEP 9 — REVIEW */}
            {currentStep === 8 && (
              <div className="space-y-6">

                <div>
                  <h3 className="font-display text-xl font-bold text-ink">
                    Plan Summary
                  </h3>
                </div>

                <div className="space-y-3 text-sm">
                  <p>
                    <strong>Title:</strong>{" "}
                    {formData.title || "Not provided"}
                  </p>

                  <p>
                    <strong>Location:</strong>{" "}
                    {formData.funeralLocation || "Not provided"}
                  </p>

                  <p>
                    <strong>City:</strong>{" "}
                    {formData.funeralCity || "Not provided"}
                  </p>

                  <p>
                    <strong>Funeral Type:</strong>{" "}
                    {formData.funeralType || "Not provided"}
                  </p>

                  <p>
                    <strong>Religious Type:</strong>{" "}
                    {formData.religiousType || "Not provided"}
                  </p>

                  <p>
                    <strong>Tradition:</strong>{" "}
                    {formData.tradition || "Not provided"}
                  </p>

                  <p>
                    <strong>Ritual Type:</strong>{" "}
                    {formData.ritualType || "Not provided"}
                  </p>

                  <p>
                    <strong>Music:</strong>{" "}
                    {formData.music || "Not provided"}
                  </p>

                  <p>
                    <strong>Flowers:</strong>{" "}
                    {formData.flowers || "Not provided"}
                  </p>

                  <p>
                    <strong>Total Budget:</strong>{" "}
                    {formData.totalBudget}
                  </p>

                  <p>
                    <strong>Nominee:</strong>{" "}
                    {formData.nomineeName || "Not provided"}
                  </p>

                  <p>
                    <strong>Nominee Email:</strong>{" "}
                    {formData.nomineeEmail || "Not provided"}
                  </p>
                </div>
              </div>
            )}

            {/* STEP 10 — FINALIZE */}
            {currentStep === 9 && (
              <div className="py-12 text-center">

                <h3 className="font-display text-step-2 font-bold text-ink mb-4">
                  Ready to Create Your Plan?
                </h3>

                <p className="text-ink-secondary mb-8">
                  Your basic plan information and budget
                  will be saved. You can continue adding
                  documents, nominees, rituals and services
                  from the plan page.
                </p>

                <div className="text-sm text-ink-tertiary">
                  Click &quot;Create Plan&quot; below to
                  continue.
                </div>
              </div>
            )}

          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">

          <Button
            variant="secondary"
            onClick={handleBack}
            disabled={
              currentStep === 0 ||
              loading
            }
          >
            Back
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button
              onClick={handleContinue}
              disabled={loading}
            >
              Continue
            </Button>
          ) : (
            <Button
              onClick={createPlan}
              disabled={loading}
            >
              {loading
                ? "Creating..."
                : "Create Plan"}
            </Button>
          )}

        </div>
      </div>
    </div>
  );
}