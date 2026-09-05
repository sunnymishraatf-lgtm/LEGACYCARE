// SQLite doesn't support native enum columns, so these fields are stored as
// plain strings in the database. These const objects + union types give us
// the same type-safety and call-site ergonomics (e.g. UserRole.ADMIN) that
// Prisma's generated enums would otherwise provide.

export const UserRole = {
  PLANNER: "PLANNER",
  NOMINEE: "NOMINEE",
  PROVIDER: "PROVIDER",
  ADMIN: "ADMIN",
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const PlanStatus = {
  DRAFT: "DRAFT",
  ACTIVE: "ACTIVE",
  FINALIZED: "FINALIZED",
  ARCHIVED: "ARCHIVED",
} as const;
export type PlanStatus = (typeof PlanStatus)[keyof typeof PlanStatus];

export const NomineeAccess = {
  VIEW_ONLY: "VIEW_ONLY",
  FULL_ACCESS: "FULL_ACCESS",
  EXECUTION_ACCESS: "EXECUTION_ACCESS",
} as const;
export type NomineeAccess = (typeof NomineeAccess)[keyof typeof NomineeAccess];

export const NomineeStatus = {
  INVITED: "INVITED",
  ACCEPTED: "ACCEPTED",
  DECLINED: "DECLINED",
  ACTIVE: "ACTIVE",
  REVOKED: "REVOKED",
} as const;
export type NomineeStatus = (typeof NomineeStatus)[keyof typeof NomineeStatus];

export const ProviderStatus = {
  PENDING: "PENDING",
  UNDER_REVIEW: "UNDER_REVIEW",
  VERIFIED: "VERIFIED",
  REJECTED: "REJECTED",
  SUSPENDED: "SUSPENDED",
} as const;
export type ProviderStatus = (typeof ProviderStatus)[keyof typeof ProviderStatus];

export const RequestStatus = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;
export type RequestStatus = (typeof RequestStatus)[keyof typeof RequestStatus];
