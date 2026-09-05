import { PrismaClient } from "@prisma/client";
import { UserRole, PlanStatus, NomineeAccess, NomineeStatus, ProviderStatus, RequestStatus } from "../lib/constants";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clear existing data
  await prisma.$transaction([
    prisma.auditLog.deleteMany(),
    prisma.notification.deleteMany(),
    prisma.reminder.deleteMany(),
    prisma.review.deleteMany(),
    prisma.serviceRequest.deleteMany(),
    prisma.providerService.deleteMany(),
    prisma.providerAvailability.deleteMany(),
    prisma.document.deleteMany(),
    prisma.nominee.deleteMany(),
    prisma.budget.deleteMany(),
    prisma.ritualPreference.deleteMany(),
    prisma.ceremonyPreference.deleteMany(),
    prisma.planVersion.deleteMany(),
    prisma.funeralPlan.deleteMany(),
    prisma.profile.deleteMany(),
    prisma.serviceProvider.deleteMany(),
    prisma.category.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  // Hash password
  const hashedPassword = await bcrypt.hash("password123", 12);

  // Create admin
  const admin = await prisma.user.create({
    data: {
      email: "admin@legacycare.app",
      name: "System Administrator",
      password: hashedPassword,
      role: UserRole.ADMIN,
      profile: {
        create: { phone: "+1-555-0100", city: "New York", state: "NY", country: "USA" },
      },
    },
  });

  // Create planner
  const planner = await prisma.user.create({
    data: {
      email: "planner@legacycare.app",
      name: "Sarah Mitchell",
      password: hashedPassword,
      role: UserRole.PLANNER,
      profile: {
        create: { phone: "+1-555-0101", dateOfBirth: new Date("1965-03-15"), city: "Boston", state: "MA", country: "USA" },
      },
    },
  });

  // Create nominee user
  const nomineeUser = await prisma.user.create({
    data: {
      email: "nominee@legacycare.app",
      name: "James Mitchell",
      password: hashedPassword,
      role: UserRole.NOMINEE,
      profile: {
        create: { phone: "+1-555-0102", city: "Boston", state: "MA", country: "USA" },
      },
    },
  });

  // Create provider user
  const providerUser = await prisma.user.create({
    data: {
      email: "provider@legacycare.app",
      name: "Eternal Peace Services",
      password: hashedPassword,
      role: UserRole.PROVIDER,
      profile: {
        create: { phone: "+1-555-0103", city: "Boston", state: "MA", country: "USA" },
      },
    },
  });

  // Create provider profile
  const provider = await prisma.serviceProvider.create({
    data: {
      userId: providerUser.id,
      businessName: "Eternal Peace Funeral Services",
      description: "Compassionate funeral services with over 20 years of experience serving families with dignity and care.",
      category: "FUNERAL_SERVICES",
      location: "123 Memorial Drive, Boston, MA",
      city: "Boston",
      state: "MA",
      rating: 4.8,
      reviewCount: 124,
      status: ProviderStatus.VERIFIED,
      verifiedAt: new Date(),
      services: {
        create: [
          { name: "Standard Funeral Package", description: "Complete funeral service including viewing and ceremony", price: 4500, duration: "3 hours" },
          { name: "Memorial Service", description: "Memorial service without viewing", price: 2800, duration: "2 hours" },
          { name: "Direct Cremation", description: "Simple cremation without ceremony", price: 1200, duration: "N/A" },
        ],
      },
      availability: {
        create: [
          { dayOfWeek: 1, startTime: "08:00", endTime: "18:00", isAvailable: true },
          { dayOfWeek: 2, startTime: "08:00", endTime: "18:00", isAvailable: true },
          { dayOfWeek: 3, startTime: "08:00", endTime: "18:00", isAvailable: true },
          { dayOfWeek: 4, startTime: "08:00", endTime: "18:00", isAvailable: true },
          { dayOfWeek: 5, startTime: "08:00", endTime: "18:00", isAvailable: true },
        ],
      },
    },
  });

  // Create more providers
  const providers = [
    { businessName: "Sacred Journey Transport", category: "TRANSPORTATION", city: "Boston", state: "MA", rating: 4.5, reviewCount: 67, status: ProviderStatus.VERIFIED },
    { businessName: "Bloom & Grace Florals", category: "FLOWERS", city: "Boston", state: "MA", rating: 4.9, reviewCount: 203, status: ProviderStatus.VERIFIED },
    { businessName: "Reverend Thomas Williams", category: "CLERGY", city: "Boston", state: "MA", rating: 5.0, reviewCount: 89, status: ProviderStatus.VERIFIED },
    { businessName: "Elegant Arrangements", category: "DECORATION", city: "Cambridge", state: "MA", rating: 4.6, reviewCount: 45, status: ProviderStatus.PENDING },
    { businessName: "Cremation Care Center", category: "CREMATION", city: "Boston", state: "MA", rating: 4.7, reviewCount: 156, status: ProviderStatus.VERIFIED },
    { businessName: "Heritage Ritual Services", category: "RITUAL_ASSISTANCE", city: "Brookline", state: "MA", rating: 4.4, reviewCount: 34, status: ProviderStatus.UNDER_REVIEW },
    { businessName: "Peaceful Passage Funeral Home", category: "FUNERAL_SERVICES", city: "Cambridge", state: "MA", rating: 4.3, reviewCount: 98, status: ProviderStatus.VERIFIED },
    { businessName: "Divine Light Clergy", category: "CLERGY", city: "Somerville", state: "MA", rating: 4.8, reviewCount: 56, status: ProviderStatus.VERIFIED },
    { businessName: "Rose Memorial Florists", category: "FLOWERS", city: "Brookline", state: "MA", rating: 4.7, reviewCount: 112, status: ProviderStatus.VERIFIED },
    { businessName: "Serenity Transport", category: "TRANSPORTATION", city: "Boston", state: "MA", rating: 4.2, reviewCount: 78, status: ProviderStatus.VERIFIED },
  ];

  for (const p of providers) {
    const u = await prisma.user.create({
      data: {
        email: `${p.businessName.toLowerCase().replace(/\s+/g, "-")}@legacycare.app`,
        name: p.businessName,
        password: hashedPassword,
        role: UserRole.PROVIDER,
      },
    });
    await prisma.serviceProvider.create({
      data: {
        userId: u.id,
        businessName: p.businessName,
        description: `Professional ${p.category.toLowerCase().replace("_", " ")} services in ${p.city}, ${p.state}.`,
        category: p.category,
        location: `${Math.floor(Math.random() * 900) + 100} Main St, ${p.city}, ${p.state}`,
        city: p.city,
        state: p.state,
        rating: p.rating,
        reviewCount: p.reviewCount,
        status: p.status,
        verifiedAt: p.status === ProviderStatus.VERIFIED ? new Date() : null,
      },
    });
  }

  // Create categories
  const categories = [
    { name: "FUNERAL_SERVICES", description: "Complete funeral and memorial services", icon: "building", sortOrder: 1 },
    { name: "TRANSPORTATION", description: "Hearse and family transport services", icon: "truck", sortOrder: 2 },
    { name: "CLERGY", description: "Religious and spiritual officiants", icon: "book-open", sortOrder: 3 },
    { name: "FLOWERS", description: "Floral arrangements and tributes", icon: "flower", sortOrder: 4 },
    { name: "DECORATION", description: "Venue decoration and setup", icon: "palette", sortOrder: 5 },
    { name: "CREMATION", description: "Cremation and urn services", icon: "flame", sortOrder: 6 },
    { name: "RITUAL_ASSISTANCE", description: "Cultural and religious ritual support", icon: "hand-heart", sortOrder: 7 },
  ];

  for (const c of categories) {
    await prisma.category.create({ data: c });
  }

  // Create example funeral plan
  const plan = await prisma.funeralPlan.create({
    data: {
      userId: planner.id,
      title: "Sarah's Funeral Plan",
      status: PlanStatus.ACTIVE,
      progress: 78,
      funeralLocation: "St. Mary's Church",
      funeralCity: "Boston",
      funeralType: "Religious",
      religiousType: "Christian",
      specialInstructions: "Please ensure all guests receive a white rose upon entry.",
      ritualPrefs: {
        create: {
          tradition: "Christian",
          ritualType: "Traditional Mass",
          clergyPref: "Father Michael O'Brien",
          prayers: "Psalm 23, Lord's Prayer",
          customs: "Holy Communion, Eulogy by family member",
          language: "English",
          music: "Ave Maria, Amazing Grace",
        },
      },
      ceremonyPrefs: {
        create: {
          music: "Classical piano, church organ",
          flowers: "White lilies, white roses",
          decoration: "White drapery, candles",
          clothing: "Dark formal attire requested",
          duration: "2 hours",
          familyInstructions: "Family to arrive 30 minutes early",
          guestPreferences: "Open to all friends and family",
          personalMessage: "Thank you for being part of my journey. Please celebrate my life with joy.",
        },
      },
      budget: {
        create: {
          totalBudget: 40000,
          funeralService: 20000,
          transportation: 8000,
          flowers: 3000,
          clergy: 5000,
          decoration: 4000,
          cremation: 0,
          other: 0,
        },
      },
      nominees: {
        create: [
          {
            userId: nomineeUser.id,
            name: "James Mitchell",
            relationship: "Son",
            email: "nominee@legacycare.app",
            phone: "+1-555-0102",
            accessLevel: NomineeAccess.FULL_ACCESS,
            status: NomineeStatus.ACTIVE,
            acceptedAt: new Date(),
          },
          {
            name: "Emily Mitchell",
            relationship: "Daughter",
            email: "emily@example.com",
            phone: "+1-555-0104",
            accessLevel: NomineeAccess.VIEW_ONLY,
            status: NomineeStatus.INVITED,
          },
        ],
      },
      versions: {
        create: [
          { version: 1, changes: "Initial plan created" },
          { version: 2, changes: "Updated ritual preferences" },
          { version: 3, changes: "Added ceremony details and budget" },
        ],
      },
    },
  });

  // Create documents
  await prisma.document.create({
    data: {
      userId: planner.id,
      planId: plan.id,
      name: "Funeral_Instructions.pdf",
      fileType: "PDF",
      fileSize: 245760,
      fileUrl: "/documents/funeral-instructions.pdf",
      isPrivate: true,
    },
  });

  // Create service request
  await prisma.serviceRequest.create({
    data: {
      planId: plan.id,
      providerId: provider.id,
      userId: planner.id,
      serviceName: "Standard Funeral Package",
      status: RequestStatus.ACCEPTED,
      notes: "Please confirm availability for tentative date",
      price: 4500,
    },
  });

  // Create notifications
  const notifications = [
    { userId: planner.id, title: "Plan Updated", message: "Your funeral plan has been updated successfully.", type: "PLAN" },
    { userId: planner.id, title: "Nominee Accepted", message: "James Mitchell has accepted your invitation.", type: "NOMINEE" },
    { userId: planner.id, title: "Provider Verified", message: "Eternal Peace Funeral Services has been verified.", type: "PROVIDER" },
    { userId: planner.id, title: "Reminder", message: "Review your plan details. Last reviewed 3 months ago.", type: "REMINDER" },
    { userId: planner.id, title: "Document Uploaded", message: "Funeral_Instructions.pdf uploaded successfully.", type: "DOCUMENT" },
  ];

  for (const n of notifications) {
    await prisma.notification.create({ data: n });
  }

  // Create reminders
  await prisma.reminder.create({
    data: {
      userId: planner.id,
      title: "Review Plan",
      description: "Review and update your funeral plan details",
      frequency: "EVERY_6_MONTHS",
      nextDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  // Create audit logs
  const auditActions = [
    { userId: planner.id, action: "LOGIN", resourceType: "SESSION" },
    { userId: planner.id, action: "PLAN_CREATED", resourceType: "FUNERAL_PLAN", resourceId: plan.id },
    { userId: planner.id, action: "NOMINEE_ADDED", resourceType: "NOMINEE" },
    { userId: planner.id, action: "DOCUMENT_UPLOADED", resourceType: "DOCUMENT" },
    { userId: admin.id, action: "LOGIN", resourceType: "SESSION" },
    { userId: admin.id, action: "PROVIDER_VERIFIED", resourceType: "PROVIDER", resourceId: provider.id },
  ];

  for (const a of auditActions) {
    await prisma.auditLog.create({ data: a });
  }

  // Create review
  await prisma.review.create({
    data: {
      userId: planner.id,
      providerId: provider.id,
      rating: 5,
      comment: "Exceptional service and compassionate staff.",
    },
  });

  console.log("Seed completed successfully!");
  console.log("Demo accounts:");
  console.log("  Admin:    admin@legacycare.app / password123");
  console.log("  Planner:  planner@legacycare.app / password123");
  console.log("  Nominee:  nominee@legacycare.app / password123");
  console.log("  Provider: provider@legacycare.app / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
