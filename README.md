# LegacyCare

## Dignified End-of-Life & Funeral Planning Platform

LegacyCare is a full-stack Next.js application for documenting funeral, cultural, religious, and personal ceremony preferences in advance. Built with editorial design principles, cinematic storytelling, and enterprise-grade security.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite (Prisma ORM — easily switch to PostgreSQL)
- **Auth**: NextAuth.js with credentials provider
- **Validation**: Zod
- **Animation**: Framer Motion

## Features

### Landing Page
- Full-screen hero with precise animation timing (beam → plate → wordmark → visual → stats → UI)
- Scroll storytelling with 8 sticky planning stages
- SVG trace journey visualization with stroke-dashoffset animation
- Interactive photographic hotspots with popovers
- Mouse-follow nominee cards (desktop only)
- Interactive four-zone journey map with transform-based zoom
- FAQ accordion and final CTA

### Dashboard
- Plan completion progress with real data
- Quick actions for nominees, documents, providers
- Notification center
- Statistics cards with tabular numbers

### Plan Wizard
- 10-step creation flow
- Personal details, funeral preferences, rituals, ceremony, services, budget, documents, nominees, review, finalize
- Form persistence
- Version history tracking

### Security
- bcrypt password hashing
- Role-based access control (Planner, Nominee, Provider, Admin)
- Server-side authorization on every API route
- Audit logging for all sensitive actions
- Zod validation on all inputs
- Document privacy controls

### Admin
- Platform statistics
- User management
- Provider verification workflow
- Audit log viewer

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@legacycare.app` | `password123` |
| Planner | `planner@legacycare.app` | `password123` |
| Nominee | `nominee@legacycare.app` | `password123` |
| Provider | `provider@legacycare.app` | `password123` |

## Setup

```bash
# Install dependencies
npm install

# Generate Prisma client and run migrations
npx prisma generate
npx prisma migrate dev --name init

# Seed the database with demo data
npx prisma db seed

# Start development server
npm run dev

# Open http://localhost:3000
```

## Project Structure

```
app/
  page.tsx                    # Landing page
  login/page.tsx              # Authentication
  register/page.tsx
  dashboard/                  # Planner dashboard
  plans/                      # Plan CRUD
  providers/                  # Provider directory
  nominees/                   # Nominee management
  documents/                  # Document management
  admin/                      # Admin dashboard
  api/                        # API routes

components/
  hero/                       # Hero section + stats
  editorial/                  # Landing page sections
  navigation/                 # Navbar + footer
  ui/                         # Reusable UI components

lib/
  auth.ts                     # NextAuth config
  db.ts                       # Prisma client
  validation.ts               # Zod schemas
  utils.ts                    # Helpers

prisma/
  schema.prisma               # Database schema
  seed.ts                     # Demo data
```

## Design System

### Colors
- **Dark Mode**: `#0B0E12`, `#11151B`, `#EEF3F8`, `#D7FF3E`, `#FF6B3D`
- **Light Mode**: `#FAFAFA`, `#F5F5F5`, `#E5E5E5`, `#0A0A0A`, `#525252`, `#EF4444`

### Typography
- **Display**: Anybody (variable width 50–150, weight 100–900)
- **Body**: Work Sans
- **Monospace**: Martian Mono (tabular nums for all data)
- **Fluid scale**: 1.333 ratio with clamp()

### Geometry
- Zero border-radius everywhere
- Borders for hierarchy (no shadows, no glassmorphism)
- Sharp, geometric cards and inputs

## License

This is a demonstration project. Not for production use without proper legal review.
