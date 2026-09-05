import { UserRole, PlanStatus, NomineeAccess, NomineeStatus, ProviderStatus, RequestStatus } from "@/lib/constants";

export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: UserRole;
  createdAt: Date;
}

export interface FuneralPlan {
  id: string;
  userId: string;
  title: string;
  status: PlanStatus;
  progress: number;
  funeralLocation: string | null;
  funeralCity: string | null;
  funeralType: string | null;
  religiousType: string | null;
  specialInstructions: string | null;
  createdAt: Date;
  updatedAt: Date;
  finalizedAt: Date | null;
  user?: User;
  ritualPrefs?: RitualPreference | null;
  ceremonyPrefs?: CeremonyPreference | null;
  budget?: Budget | null;
  nominees?: Nominee[];
  documents?: Document[];
  versions?: PlanVersion[];
  serviceRequests?: ServiceRequest[];
}

export interface RitualPreference {
  id: string;
  planId: string;
  tradition: string | null;
  ritualType: string | null;
  clergyPref: string | null;
  prayers: string | null;
  customs: string | null;
  language: string | null;
  music: string | null;
  instructions: string | null;
  preferNotSpecify: boolean;
}

export interface CeremonyPreference {
  id: string;
  planId: string;
  music: string | null;
  flowers: string | null;
  decoration: string | null;
  clothing: string | null;
  duration: string | null;
  familyInstructions: string | null;
  guestPreferences: string | null;
  personalMessage: string | null;
}

export interface Nominee {
  id: string;
  planId: string;
  userId: string | null;
  name: string;
  relationship: string;
  email: string;
  phone: string | null;
  accessLevel: NomineeAccess;
  status: NomineeStatus;
  invitedAt: Date;
  acceptedAt: Date | null;
  revokedAt: Date | null;
}

export interface Budget {
  id: string;
  planId: string;
  totalBudget: number;
  funeralService: number;
  transportation: number;
  flowers: number;
  clergy: number;
  decoration: number;
  cremation: number;
  other: number;
}

export interface Document {
  id: string;
  userId: string;
  planId: string | null;
  name: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  isPrivate: boolean;
  createdAt: Date;
}

export interface PlanVersion {
  id: string;
  planId: string;
  version: number;
  changes: string;
  createdAt: Date;
}

export interface ServiceProvider {
  id: string;
  userId: string;
  businessName: string;
  description: string | null;
  category: string;
  location: string;
  city: string;
  state: string;
  rating: number;
  reviewCount: number;
  status: ProviderStatus;
  verifiedAt: Date | null;
  createdAt: Date;
  user?: User;
  services?: ProviderService[];
  availability?: ProviderAvailability[];
  requests?: ServiceRequest[];
  reviews?: Review[];
}

export interface ProviderService {
  id: string;
  providerId: string;
  name: string;
  description: string | null;
  price: number;
  duration: string | null;
}

export interface ProviderAvailability {
  id: string;
  providerId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface ServiceRequest {
  id: string;
  planId: string;
  providerId: string;
  userId: string;
  serviceName: string;
  status: RequestStatus;
  notes: string | null;
  price: number | null;
  createdAt: Date;
  updatedAt: Date;
  plan?: FuneralPlan;
  provider?: ServiceProvider;
}

export interface Review {
  id: string;
  userId: string;
  providerId: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  user?: User;
}

export interface AuditLog {
  id: string;
  userId: string | null;
  action: string;
  resourceType: string;
  resourceId: string | null;
  metadata: string | null;
  ipAddress: string | null;
  createdAt: Date;
  user?: User | null;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  type: string;
  createdAt: Date;
}

export interface Reminder {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  frequency: string;
  nextDue: Date;
  isActive: boolean;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface DashboardStats {
  totalPlans: number;
  activePlans: number;
  finalizedPlans: number;
  totalNominees: number;
  totalDocuments: number;
  totalProviders: number;
  pendingVerifications: number;
  totalUsers: number;
}

export type PlanStep = {
  id: number;
  title: string;
  description: string;
  isComplete: boolean;
};
