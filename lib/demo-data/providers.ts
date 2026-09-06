export type DemoProviderService = {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
};

export type DemoProviderAvailability = {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
};

export type DemoProviderReview = {
  id: string;
  rating: number;
  comment: string;
  user: { name: string };
};

export type DemoProvider = {
  id: string;
  businessName: string;
  description: string;
  category: string;
  location: string;
  city: string;
  state: string;
  rating: number;
  reviewCount: number;
  status: "VERIFIED";
  services: DemoProviderService[];
  availability: DemoProviderAvailability[];
  reviews: DemoProviderReview[];
};

const weekdayAvailability = (providerId: string): DemoProviderAvailability[] =>
  [1, 2, 3, 4, 5].map((dayOfWeek) => ({
    id: `${providerId}-availability-${dayOfWeek}`,
    dayOfWeek,
    startTime: "08:00",
    endTime: "18:00",
    isAvailable: true,
  }));

export const demoProviders: DemoProvider[] = [
  {
    id: "eternal-peace-funeral-services",
    businessName: "Eternal Peace Funeral Services",
    description: "Compassionate funeral services with over 20 years of experience serving families with dignity and care.",
    category: "FUNERAL_SERVICES",
    location: "123 Memorial Drive, Boston, MA",
    city: "Boston",
    state: "MA",
    rating: 4.8,
    reviewCount: 124,
    status: "VERIFIED",
    services: [
      { id: "eternal-standard", name: "Standard Funeral Package", description: "Complete funeral service including viewing and ceremony", price: 4500, duration: "3 hours" },
      { id: "eternal-memorial", name: "Memorial Service", description: "A personal memorial service without a viewing", price: 2800, duration: "2 hours" },
      { id: "eternal-cremation", name: "Direct Cremation", description: "Simple cremation with professional care and documentation", price: 1200, duration: "By arrangement" },
    ],
    availability: weekdayAvailability("eternal"),
    reviews: [
      { id: "eternal-review-1", rating: 5, comment: "The team guided our family with patience, clarity, and genuine compassion.", user: { name: "Maya R." } },
      { id: "eternal-review-2", rating: 5, comment: "Every detail was handled respectfully and exactly as requested.", user: { name: "Daniel K." } },
    ],
  },
  {
    id: "bloom-and-grace-florals",
    businessName: "Bloom & Grace Florals",
    description: "Thoughtful floral tributes designed to reflect a life, a memory, and a family's wishes.",
    category: "FLOWERS",
    location: "48 Beacon Street, Boston, MA",
    city: "Boston",
    state: "MA",
    rating: 4.9,
    reviewCount: 203,
    status: "VERIFIED",
    services: [
      { id: "bloom-casket", name: "Casket Arrangement", description: "Seasonal casket spray customized to your preferences", price: 325, duration: "48 hours notice" },
      { id: "bloom-tribute", name: "Memorial Tribute", description: "Personalized standing floral tribute", price: 185, duration: "24 hours notice" },
    ],
    availability: weekdayAvailability("bloom"),
    reviews: [{ id: "bloom-review-1", rating: 5, comment: "Beautiful, understated arrangements delivered exactly on time.", user: { name: "Priya S." } }],
  },
  {
    id: "sacred-journey-transport",
    businessName: "Sacred Journey Transport",
    description: "Professional, discreet transportation for loved ones and family members throughout the service.",
    category: "TRANSPORTATION",
    location: "310 Harbor Way, Boston, MA",
    city: "Boston",
    state: "MA",
    rating: 4.5,
    reviewCount: 67,
    status: "VERIFIED",
    services: [
      { id: "journey-hearse", name: "Hearse Service", description: "Professional hearse and coordinated procession service", price: 650, duration: "Up to 4 hours" },
      { id: "journey-family", name: "Family Vehicle", description: "Chauffeured family transportation", price: 280, duration: "Up to 4 hours" },
    ],
    availability: weekdayAvailability("journey"),
    reviews: [{ id: "journey-review-1", rating: 5, comment: "Punctual, calm, and exceptionally professional throughout the day.", user: { name: "Thomas A." } }],
  },
  {
    id: "reverend-thomas-williams",
    businessName: "Reverend Thomas Williams",
    description: "Inclusive spiritual guidance and personalized ceremonies for families of all backgrounds.",
    category: "CLERGY",
    location: "75 Commonwealth Avenue, Boston, MA",
    city: "Boston",
    state: "MA",
    rating: 5,
    reviewCount: 89,
    status: "VERIFIED",
    services: [
      { id: "williams-service", name: "Funeral Ceremony", description: "Planning consultation and personalized ceremony", price: 450, duration: "60-90 minutes" },
      { id: "williams-graveside", name: "Graveside Service", description: "A focused and personal graveside ceremony", price: 275, duration: "30-45 minutes" },
    ],
    availability: weekdayAvailability("williams"),
    reviews: [{ id: "williams-review-1", rating: 5, comment: "He listened carefully and created a ceremony that truly felt like our family.", user: { name: "Elena M." } }],
  },
  {
    id: "cremation-care-center",
    businessName: "Cremation Care Center",
    description: "Clear, respectful cremation arrangements with transparent pricing and compassionate support.",
    category: "CREMATION",
    location: "220 Garden Street, Cambridge, MA",
    city: "Cambridge",
    state: "MA",
    rating: 4.7,
    reviewCount: 156,
    status: "VERIFIED",
    services: [
      { id: "care-direct", name: "Direct Cremation", description: "Complete direct cremation and required permits", price: 1095, duration: "By arrangement" },
      { id: "care-memorial", name: "Cremation with Memorial", description: "Cremation care with a private memorial gathering", price: 2100, duration: "2 hours" },
    ],
    availability: weekdayAvailability("care"),
    reviews: [{ id: "care-review-1", rating: 5, comment: "Transparent, responsive, and kind during a difficult week.", user: { name: "James L." } }],
  },
  {
    id: "rose-memorial-florists",
    businessName: "Rose Memorial Florists",
    description: "Classic and contemporary memorial flowers prepared with care by an experienced local team.",
    category: "FLOWERS",
    location: "18 Cypress Road, Brookline, MA",
    city: "Brookline",
    state: "MA",
    rating: 4.7,
    reviewCount: 112,
    status: "VERIFIED",
    services: [
      { id: "rose-wreath", name: "Memorial Wreath", description: "Hand-finished wreath in a selected color palette", price: 195, duration: "24 hours notice" },
      { id: "rose-family", name: "Family Tribute Collection", description: "Coordinated collection of three floral pieces", price: 475, duration: "48 hours notice" },
    ],
    availability: weekdayAvailability("rose"),
    reviews: [{ id: "rose-review-1", rating: 5, comment: "The flowers were fresh, elegant, and exactly matched our request.", user: { name: "Nora B." } }],
  },
];

export function getDemoProvider(id: string) {
  return demoProviders.find((provider) => provider.id === id);
}
