import { z } from "zod";

/*
 * =========================
 * LOGIN
 * =========================
 */

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter a valid email"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

/*
 * =========================
 * REGISTER
 * =========================
 */

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters"),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),

  role: z
    .enum(["PLANNER", "PROVIDER"])
    .default("PLANNER"),
});

/*
 * =========================
 * FUNERAL PLAN
 * =========================
 */

export const planSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required"),

  funeralLocation: z
    .string()
    .trim()
    .optional(),

  funeralCity: z
    .string()
    .trim()
    .optional(),

  funeralType: z
    .enum([
      "Cremation",
      "Burial",
      "Other",
      "",
    ])
    .optional(),

  religiousType: z
    .enum([
      "Religious",
      "Non-religious",
      "Custom",
      "",
    ])
    .optional(),

  specialInstructions: z
    .string()
    .trim()
    .optional(),
});

/*
 * =========================
 * RITUAL PREFERENCES
 * =========================
 */

export const ritualSchema = z.object({
  tradition: z
    .string()
    .trim()
    .optional(),

  ritualType: z
    .string()
    .trim()
    .optional(),

  clergyPref: z
    .string()
    .trim()
    .optional(),

  prayers: z
    .string()
    .trim()
    .optional(),

  customs: z
    .string()
    .trim()
    .optional(),

  language: z
    .string()
    .trim()
    .optional(),

  music: z
    .string()
    .trim()
    .optional(),

  instructions: z
    .string()
    .trim()
    .optional(),

  preferNotSpecify: z
    .boolean()
    .default(false),
});

/*
 * =========================
 * CEREMONY PREFERENCES
 * =========================
 */

export const ceremonySchema = z.object({
  music: z
    .string()
    .trim()
    .optional(),

  flowers: z
    .string()
    .trim()
    .optional(),

  decoration: z
    .string()
    .trim()
    .optional(),

  clothing: z
    .string()
    .trim()
    .optional(),

  duration: z
    .string()
    .trim()
    .optional(),

  familyInstructions: z
    .string()
    .trim()
    .optional(),

  guestPreferences: z
    .string()
    .trim()
    .optional(),

  personalMessage: z
    .string()
    .trim()
    .optional(),
});

/*
 * =========================
 * NOMINEE
 * =========================
 */

export const nomineeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required"),

  relationship: z
    .string()
    .trim()
    .min(1, "Relationship is required"),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email"),

  phone: z
    .string()
    .trim()
    .optional(),

  accessLevel: z.enum([
    "VIEW_ONLY",
    "FULL_ACCESS",
    "EXECUTION_ACCESS",
  ]),
});

/*
 * =========================
 * BUDGET
 * =========================
 */

export const budgetSchema = z.object({
  totalBudget: z
    .number()
    .finite()
    .min(0, "Budget cannot be negative"),

  funeralService: z
    .number()
    .finite()
    .min(0, "Budget cannot be negative"),

  transportation: z
    .number()
    .finite()
    .min(0, "Budget cannot be negative"),

  flowers: z
    .number()
    .finite()
    .min(0, "Budget cannot be negative"),

  clergy: z
    .number()
    .finite()
    .min(0, "Budget cannot be negative"),

  decoration: z
    .number()
    .finite()
    .min(0, "Budget cannot be negative"),

  cremation: z
    .number()
    .finite()
    .min(0, "Budget cannot be negative"),

  other: z
    .number()
    .finite()
    .min(0, "Budget cannot be negative"),
});

/*
 * =========================
 * DOCUMENT
 * =========================
 */

export const documentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required"),

  fileType: z
    .string()
    .trim()
    .min(1, "File type is required"),

  isPrivate: z
    .boolean()
    .default(true),

  /*
   * These fields are optional because the current
   * upload flow may not always send them.
   */
  fileUrl: z
    .string()
    .optional(),

  fileSize: z
    .number()
    .int()
    .finite()
    .min(0)
    .optional(),

  planId: z
    .string()
    .trim()
    .optional(),
});

/*
 * =========================
 * TYPES
 * =========================
 */

export type LoginInput =
  z.infer<typeof loginSchema>;

export type RegisterInput =
  z.infer<typeof registerSchema>;

export type PlanInput =
  z.infer<typeof planSchema>;

export type RitualInput =
  z.infer<typeof ritualSchema>;

export type CeremonyInput =
  z.infer<typeof ceremonySchema>;

export type NomineeInput =
  z.infer<typeof nomineeSchema>;

export type BudgetInput =
  z.infer<typeof budgetSchema>;

export type DocumentInput =
  z.infer<typeof documentSchema>;