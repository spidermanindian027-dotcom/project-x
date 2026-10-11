# VESTRA AI — Haute Couture Digital Atelier & AI Fashion Intelligence Platform

> **"See it. Style it. Own it."**

[![Next.js](https://img.shields.io/badge/Next.js-16.4.0-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Turbopack](https://img.shields.io/badge/Turbopack-Ready-blueviolet?style=flat)](https://turbo.build/pack)
[![Prisma](https://img.shields.io/badge/Prisma-6.4.0-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat&logo=postgresql)](https://www.postgresql.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Vitest-63%2F63%20Passing-brightgreen?style=flat&logo=vitest)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-MIT-gold?style=flat)](#license)

---

## 🏛️ Overview

**VESTRA AI** is a production-grade, editorial fashion styling and digital wardrobe management platform. Designed with minimalist luxury aesthetics (*dark charcoal `#1a1a1a`, warm ivory `#f5f0e8`, electric gold accent `#e8c547`*), VESTRA AI pairs cutting-edge multimodal vision models with algorithmic capsule wardrobe synthesis, virtual neural try-on simulation, and dedicated fashion director administration.

---

## ✨ Features by Phase

| Phase | Module | Capabilities |
| :--- | :--- | :--- |
| **Phase 1** | **Editorial Foundation** | Next.js 16 App Router, Tailwind v4 design system, Playfair Display & Inter typography, Framer Motion transitions, responsive mobile bottom nav. |
| **Phase 2** | **Database & Auth** | PostgreSQL + Prisma ORM, bcrypt salted hashing, HTTP-only cookie session engine, `USER` & `ADMIN` RBAC, timing-attack resistance. |
| **Phase 3** | **Fashion Fit Profile** | 6-step onboarding wizard, 10 style archetypes, 16-color swatches, proportion archetypes, camera silhouette overlay, zero medical/racial inference. |
| **Phase 4** | **Outfit Scanner** | 6-category weighted scoring rubric (*Fit 25%, Colour 20%, Coordination 20%, Occasion 15%, Accessories 10%, Style 10%*), live environmental camera capture, deterministic AI analysis. |
| **Phase 5** | **Digital Wardrobe** | 17 garment categories (*tops, shirts, trousers, jeans, jackets, boots, watches, etc.*), multi-tenant storage cleanup, live search, color/favorites filtering. |
| **Phase 6** | **AI Wardrobe Matching** | Algorithmic capsule matching using pieces the user actually owns, color and proportion rationales, lookbook persistence. |
| **Phase 7** | **Ask VESTRA (Stylist)** | Conversational fashion consultant with live wardrobe context injection and clickable garment chips. |
| **Phase 8** | **Personal Analytics** | Recharts score trajectories, category breakdown, dominant colors meter, anchor pieces tracking, zero synthetic metrics. |
| **Phase 9** | **Location & Styling** | 12 occasion matrices (*College, Office, Wedding, Gala, Trekking, etc.*), meteorological engine, climate-aware garment selection. |
| **Phase 10** | **Virtual Try-On Studio** | Interactive Before/After slider, neural diffusion simulation preview, multi-item garment compositing. |
| **Phase 11** | **Admin Dashboard** | Executive telemetry KPIs, registration velocity chart, client roster, and live operational audit log viewer. |
| **Phase 12** | **Security & Auditing** | Structured enterprise logging, zero-leakage sensitive data deep redaction, rate limiting (10 scans/hr), CSRF protections. |
| **Phase 13** | **End-to-End Verification** | 63 automated unit/integration tests with 100% pass rate across 5 test suites. |

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Node.js 20+ (LTS recommended)
- PostgreSQL 15+ running locally or in Docker

### 2. Clone Repository
```bash
git clone https://github.com/spidermanindian027-dotcom/project-x.git
cd project-x
```

### 3. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 4. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your database URL and secrets:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/vestra_db?schema=public"
AUTH_SECRET="vestra_secret_session_encryption_key_32chars_min_production"
ADMIN_EMAIL="admin@vestra.ai"
ADMIN_PASSWORD="AdminSecurePassword2026!"
ADMIN_NAME="Atelier Director"
NODE_ENV="development"
```

### 5. Initialize Database & Seed
```bash
npm run db:push
npm run db:seed
```

### 6. Start Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🔑 Default Seeded Accounts

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Atelier Director** | `admin@vestra.ai` | `AdminSecurePassword2026!` | Full Admin Command (`/admin`) + Atelier |
| **Private Client** | `client@vestra.ai` | `ClientPassword2026!` | Wardrobe, Outfits, Scanner, Try-On |

*(You can also register a fresh account at [/register](http://localhost:3000/register))*

---

## 🧪 Testing & Verification

Run the complete Vitest test suite:
```bash
npm run test
```

### Test Coverage Summary:
- **`tests/auth.test.ts`** (15 tests) — Session auth, bcrypt, role enforcement, CSRF guards.
- **`tests/phase3-phase4.test.ts`** (16 tests) — Profile Zod schemas, weighted scoring rubric, camera guards.
- **`tests/phase5-6-7.test.ts`** (13 tests) — Wardrobe CRUD, AI matching ownership, stylist chat context.
- **`tests/phase8-9-10.test.ts`** (11 tests) — Recharts analytics math, meteorological styling, try-on job lifecycle.
- **`tests/phase11-12-13.test.ts`** (8 tests) — Admin RBAC, sensitive key deep-redaction, security incident lifecycle.
- **Total**: **63/63 tests passed (100% pass rate)**.

Typecheck & Linting:
```bash
npx tsc --noEmit    # 0 errors
npm run lint         # 0 errors, 0 warnings
npm run build        # Production Turbopack build: 37 routes compiled
```

---

## 🌐 Production Cloud Deployment

### Deploy on Vercel
1. Import repository `spidermanindian027-dotcom/project-x` on **[vercel.com](https://vercel.com)**.
2. Select **Framework Preset**: `Next.js`.
3. Add Environment Variables:
   - `DATABASE_URL`: Cloud PostgreSQL connection string (from [neon.tech](https://neon.tech) or Supabase).
   - `AUTH_SECRET`: Random 32-character string.
   - `ADMIN_EMAIL`: `admin@vestra.ai`.
   - `ADMIN_PASSWORD`: Your chosen admin password.
   - `ADMIN_NAME`: `Atelier Director`.
   - `NODE_ENV`: `production`.
4. Click **Deploy**.

### Deploy on Render
1. Create a **Web Service** on **[render.com](https://render.com)** connected to this repo.
2. Settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run db:push && npm run build`
   - **Start Command**: `npm run start`
3. Add Environment Variables:
   - `DATABASE_URL`: Your Render PostgreSQL database connection string (`postgresql://...`).
   - `AUTH_SECRET`: Random 32-character string.
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`.
4. Click **Deploy Web Service**.

---

## 📁 Project Architecture

```text
├── app/
│   ├── (admin)/admin/          # Director Atelier Command & Telemetry
│   ├── (app)/
│   │   ├── analytics/          # Personal Analytics & Recharts Charts
│   │   ├── chat/               # Ask VESTRA AI Stylist Consultation
│   │   ├── dashboard/          # Daily Briefing & Capsule Showcase
│   │   ├── onboarding/         # 6-Step Fashion Fit Wizard
│   │   ├── outfits/            # AI Wardrobe Matching & Lookbook
│   │   ├── profile/            # Client Dossier & Palette Calibration
│   │   ├── scan/               # 6-Rubric Outfit Scanner Studio
│   │   ├── styling/            # Location & Meteorological Styling
│   │   ├── try-on/             # Virtual Try-On Studio (Before/After)
│   │   └── wardrobe/           # 17-Category Digital Wardrobe Vault
│   ├── (auth)/                 # Sign In & Registration Screens
│   └── api/                    # 20+ Production REST Route Handlers
├── components/                 # Design System & UI Atoms (shadcn/ui + custom)
├── lib/
│   ├── ai/                     # Multi-modal Vision & Stylist Adapters
│   ├── auth/                   # Bcrypt, Sessions, Admin Provisioning
│   ├── db/                     # Prisma Client Singleton
│   ├── logger/                 # Enterprise Redacted Security Logger
│   ├── storage/                # Object Storage Adapters (Local & S3)
│   ├── try-on/                 # Neural Virtual Try-On Pipeline
│   ├── validations/            # Zod Schemas for All Entities
│   └── weather/                # Meteorological Engine & Geocoding
├── prisma/
│   ├── schema.prisma           # Relational PostgreSQL Schema (10 Models)
│   └── seed.ts                 # Production Seeding Script
├── proxy.ts                    # Next.js 16 Route Guard Middleware
└── tests/                      # 63 Regression & Security Vitest Tests
```

---

## 📄 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
