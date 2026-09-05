import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function calculatePlanProgress(plan: any): number {
  let completed = 0;
  const total = 8;
  if (plan.funeralLocation) completed++;
  if (plan.funeralType) completed++;
  if (plan.ritualPrefs) completed++;
  if (plan.ceremonyPrefs) completed++;
  if (plan.budget) completed++;
  if (plan.documents?.length > 0) completed++;
  if (plan.nominees?.length > 0) completed++;
  if (plan.status === "FINALIZED") completed++;
  return Math.round((completed / total) * 100);
}
