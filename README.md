# WORKIVO 2.0 — Mobile & Cloud Ecosystem

> **Tagline:** Small task, Big relief.  
> **Brand Identity:** Deep Teal (`#2F6860`), Dark Teal (`#234F49`), Warm Cream (`#FBF1EE`), Vibrant Coral (`#E9847D`), Terracotta (`#8F453F`), Soft Green (`#6BB26E`), and Charcoal text (`#1F2F2C`).

---

## 📱 Mobile Architecture (React Native + Expo Router)
Located in [`mobile/`](./mobile):

* **Expo SDK 57 + Expo Router** with TypeScript.
* **Navigation**:
  * **Customer Tabs**: `Home`, `Explore`, `Bookings`, `Profile`
  * **Worker Tabs**: `Jobs`, `Schedule`, `Earnings`, `Profile`
  * **Interactive Mode Switcher**: Toggle dynamically between Customer and Worker experiences.
* **Onboarding & Splash**:
  * Deep teal branded splash with official Workivo hot-air balloon logo.
  * 3-slide onboarding tour featuring real worker photography.
* **The 10 Core Services (Storytelling & Discovery)**:
  1. `01` Electrician
  2. `02` Home cooking
  3. `03` Barber at home
  4. `04` Nails and beauty
  5. `05` Furniture repair
  6. `06` Plumbing
  7. `07` Home cleaning
  8. `08` AC service
  9. `09` Packers and movers
  10. `10` Laundry
* **Worker Marketplace & Profiles**:
  * Verified worker cards with ratings, real photos, completed jobs, specialties, and hourly rates.
* **Booking & Live Tracker Flow**:
  * Interactive doorstep booking sheet (Date, time slot, address, notes, price breakdown).
  * Live status pipeline tracker (`Requested` → `Pro Matched` → `On The Way` → `In Progress` → `Completed`) with interactive status simulation controls.
* **Worker Mode**:
  * Pro dashboard, online/offline availability switch, today's payout tracker, incoming job acceptance, and active job status management.

---

## ⚡ Cloud & Backend Architecture

### 1. Supabase (PostgreSQL Database)
* **Client**: Configured in `src/lib/supabase.ts` and `mobile/src/lib/supabase.ts`.
* **Database Schema**: Full DDL in [`supabase/schema.sql`](./supabase/schema.sql):
  * `services`: 10 pre-seeded categories.
  * `bookings`: Customer orders, assigned pros, scheduled slots, statuses.
  * `pro_applications`: Technician onboarding registrations.
* **Resilience**: Zero-crash local persistence fallback when `.env.local` credentials are pending.

### 2. AWS (S3 Media Storage & API Routes)
* **Client**: `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner` in `src/lib/aws.ts`.
* **Endpoints**:
  * `POST /api/aws/upload-url`: Generates S3 pre-signed upload URLs for task photos and verification documents.
  * `POST /api/bookings`: Creates doorstep service bookings.
  * `PATCH /api/bookings`: Updates live status.
  * `POST /api/pro`: Registers new technicians.
  * `GET /api/cloud-status`: Live healthcheck for AWS and Supabase connections.

---

## 🚀 Running the Project

### Start the Mobile App (Expo)
```bash
# Start Expo development server (iOS / Android / Web)
npm run mobile

# Or start directly with target:
npm run mobile:android
npm run mobile:ios
npm run mobile:web
```

### Start the Next.js Web App & APIs
```bash
npm run dev
# Serves website and APIs on http://localhost:3000
```
