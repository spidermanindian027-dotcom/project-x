# VAYN — Your Style. Smarter. With AI.

> **"Same You. Better Outfits."**

[![Next.js](https://img.shields.io/badge/Next.js-16.4.0-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Turbopack](https://img.shields.io/badge/Turbopack-Ready-blueviolet?style=flat)](https://turbo.build/pack)
[![Prisma](https://img.shields.io/badge/Prisma-6.4.0-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat&logo=postgresql)](https://www.postgresql.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Vitest-63%2F63%20Passing-brightgreen?style=flat&logo=vitest)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-MIT-A95239?style=flat)](#license)

---

## 🌟 Welcome to VAYN

**VAYN** is an expressive, modern AI fashion companion engineered for Gen Z, young professionals, and modern men and women who want to elevate their personal style, refine their daily outfits, and unlock the hidden potential of their existing wardrobes.

Combining state-of-the-art multimodal artificial intelligence, computer vision, meteorological intelligence, and high-fashion editorial styling principles, VAYN acts as your private 24/7 digital personal stylist.

---

## 💡 What Real-World Problems Does VAYN Solve?

Most people face persistent daily friction when managing their clothing, getting dressed, and making fashion decisions:

1. **"A Closet Full of Clothes, But Nothing to Wear"**:
   - **The Problem**: The average person wears less than 20% of their closet regularly. Garments get buried, forgotten, or never paired beyond one predictable combination.
   - **VAYN's Solution**: The **VAYN Wardrobe Vault** digitizes your garments and the **AI Capsule Matching Engine** dynamically pairs tops, bottoms, outerwear, footwear, and accessories solely from pieces you already own — discovering fresh silhouettes without buying new clothes.

2. **Subjective Insecurity & Second-Guessing Before Leaving Home**:
   - **The Problem**: *"Do these colors clash?", "Does this silhouette flatter my proportions?", "Is this too formal or too underdressed?"*
   - **VAYN's Solution**: The **VAYN Outfit Scanner** evaluates real-time camera captures or uploaded photos against a 6-factor weighted sartorial matrix (*Fit & Proportions 25%, Colour Harmony 20%, Coordination 20%, Occasion 15%, Accessories 10%, Style Coherence 10%*).

3. **Weather Disasters & Destination Event Misalignments**:
   - **The Problem**: Wearing breathable linen on a windy 10°C evening or wearing heavy wool when unexpected humidity hits.
   - **VAYN's Solution**: **Location & Occasion Styling** blends real-time meteorological data with 12 distinct event contexts (Corporate Office, Gala, Interview, College, Date, Airport, Trekking, etc.) to tailor comfort-calibrated ensembles.

4. **Fast-Fashion Waste & Impulsive Shopping Spirals**:
   - **The Problem**: Buying cheap single-wear garments because you can't visualize how they integrate into your existing wardrobe.
   - **VAYN's Solution**: **Ask VAYN (Conversational Stylist)** and the **Neural Virtual Try-On Studio** allow you to test combinations and style advice digitally first.

5. **Lack of Objective Style Identity & Aesthetic Direction**:
   - **The Problem**: People don't know what their "archetype" is (Quiet Luxury, Streetwear Edge, Minimal Tailored, Old Money, Bohemian, etc.) or which color palettes complement their skin tone.
   - **VAYN's Solution**: The **Multi-Step Onboarding Calibration** creates an immutable Client Dossier matching undertones, body proportions, and aesthetic archetypes.

---

## 🏛️ System Architecture

VAYN is architected as a full-stack, modular Next.js 16 App Router application powered by PostgreSQL, Prisma ORM, and high-contrast editorial tokens:

```mermaid
flowchart TD
    subgraph Client ["Client Presentation Layer (VAYN Atelier UI)"]
        UI["Next.js 16 App Router (Tailwind CSS v4 + Framer Motion)"]
        ScannerView["Camera Stream & Canvas Capture (/scan)"]
        WardrobeView["Digital Garment Vault & Filters (/wardrobe)"]
        TryOnView["Virtual Fitting Studio & Split Previews (/try-on)"]
        AnalyticsView["Sartorial Telemetry & Recharts (/analytics)"]
    end

    subgraph Security ["Edge Security & Verification"]
        Proxy["Proxy Route Guard (proxy.ts - RBAC & Session Auth)"]
        RateLimit["Sliding-Window Rate Limiter (lib/rate-limit.ts)"]
        AuditLog["Admin Incident Audit Redactor (lib/logger/index.ts)"]
    end

    subgraph Backend ["Server & AI Business Logic"]
        AuthModule["Session Engine (bcryptjs, crypto, async cookies)"]
        MatchingEngine["AI Capsule Matcher (Zero-Hallucination Inventory Binding)"]
        ScannerEngine["Weighted 6-Factor Evaluator (Overall Score Formula)"]
        WeatherStylist["Meteorological Synthesis (Open-Meteo & City Geocoding)"]
        TryOnDiffusion["Diffusion Preview Generation Adapter"]
    end

    subgraph Storage ["Data & Storage Layer"]
        DB[("PostgreSQL 16 (vestra_db Schema)")]
        Prisma["Prisma ORM (Strict Models & Relations)"]
        StorageAdapter["Storage Provider (Local Disk & Cloud S3 Ingestion)"]
    end

    UI --> Proxy
    Proxy --> AuthModule
    Proxy --> RateLimit
    RateLimit --> ScannerEngine
    RateLimit --> MatchingEngine
    RateLimit --> WeatherStylist
    RateLimit --> TryOnDiffusion
    Backend --> Prisma
    Prisma --> DB
    ScannerEngine --> StorageAdapter
```

---

## 🎯 How Every Option & Feature Works

### 1. 🏠 Discover & Archetypes (`/`)
- **What it does**: The high-impact editorial landing page introducing the VAYN philosophy.
- **Key Sections**:
  - **Hero**: Dynamic call-to-actions ("Find My Style", "Scan An Outfit") and floating real-time aesthetic harmony badges.
  - **Aesthetic Archetypes**: Showcase of core design directions (Quiet Luxury, Streetwear Edge, Minimal Tailored, Old Money).
  - **4 Atelier Pillars**: Feature breakdowns with high-resolution photography.
  - **The 3-Step Methodology**: Explaining Digitize & Scan → Calibrate Archetype → Dress with Distinction.

### 2. 🎛️ Fashion Fit Onboarding Calibration (`/onboarding`)
- **What it does**: 6-step guided profile wizard to establish the user's styling baseline.
- **How it works**:
  - **Step 1 — Welcome**: Privacy-first mission statement.
  - **Step 2 — Style Archetypes**: Selection of 1 to 2 target aesthetics from 10 calibrated archetypes.
  - **Step 3 — Chromatic Profile**: 16 palette swatches + 4 skin tone undertones (Warm, Cool, Neutral, Unset).
  - **Step 4 — Proportion Blueprint**: 8 proportion categories (Petite, Straight, Athletic, Pear, Apple, Hourglass, Rectangular, Prefer not to say).
  - **Step 5 — Reference Silhouette**: Optional camera capture or file upload for the Neural Try-On engine.
  - **Step 6 — Final Calibration**: Persists all parameters to the `StyleProfile` model and unlocks the Atelier.

### 3. 📊 Daily Briefing & Atelier Dashboard (`/dashboard`)
- **What it does**: The primary authenticated hub for everyday outfit decisions.
- **Features**:
  - **Today's Look Rationale**: Curated ensemble tailored to current day and context.
  - **Sartorial Quick Stats**: Total wardrobe pieces, curated looks, and average aesthetic score.
  - **Quick Action Bar**: Direct paths to Scan, Match, Style, and Try-On.

### 4. 📸 The VAYN Outfit Scanner (`/scan`)
- **What it does**: Upload or snap a live full-body photo to receive instant editorial critique.
- **How it works**:
  - **Live Camera Stream**: Uses `navigator.mediaDevices.getUserMedia` with facing mode toggle and human silhouette framing overlay.
  - **6-Factor Evaluation**:
    1. *Fit & Proportion* (25%)
    2. *Colour Harmony* (20%)
    3. *Coordination* (20%)
    4. *Occasion Suitability* (15%)
    5. *Accessories Balance* (10%)
    6. *Style Coherence* (10%)
  - **Actionable Critique**: Returns "What Works", "Areas to Improve", and recommended footwear/accessory swaps.

### 5. 🧥 VAYN Wardrobe Vault (`/wardrobe`)
- **What it does**: Complete digital cataloging system for your clothing and footwear.
- **How it works**:
  - **Upload & Tagging**: Add garments with custom name, category (Tops, Bottoms, Jackets, Shoes, etc.), dominant color, fabric, and formality.
  - **Search & Filtering**: Instant filter by category, favorite bookmark, or text query.
  - **Safe Deletion**: Deletes database records and purges stored image assets to prevent orphaned files.

### 6. ✨ AI Capsule Matching & Lookbook (`/outfits`)
- **What it does**: Generates cohesive looks exclusively from garments cataloged in your vault.
- **How it works**:
  - **Zero-Hallucination Guarantee**: Outfits are assembled only from your real wardrobe IDs.
  - **Occasion Matching**: Filters by Formal, Casual, Date Night, Travel, or Party.
  - **Save to Lookbook**: Store winning outfits for 1-click morning access.

### 7. 🌦️ Location & Meteorological Styling (`/styling`)
- **What it does**: Algorithmic styling that adapts to live outdoor conditions.
- **How it works**:
  - **GPS or City Input**: Detects coordinates or accepts city names (Paris, Tokyo, New York, London).
  - **Weather Adaptation**: Reads temperature (°C), precipitation, and wind to suggest warm layers, breathable linens, or waterproof outerwear.
  - **12 Occasion Presets**: Tailored for Office, College, Wedding, Concert, Beach, Trekking, and bespoke events.

### 8. 💬 Ask VAYN — AI Personal Stylist (`/chat`)
- **What it does**: Conversational fashion consultant informed by your personal wardrobe and style dossier.
- **How it works**:
  - Users can ask: *"What should I wear to a dinner in Soho tonight?", "How do I style my oversized blazer?", "Which shoes go with wide-leg trousers?"*
  - Responses prioritize pieces already in your wardrobe vault.

### 9. 🪞 Neural Virtual Try-On Studio (`/try-on`)
- **What it does**: Neural drape preview allowing you to visualize cataloged clothes on your silhouette.
- **How it works**:
  - Combines your stored reference portrait with up to 4 selected wardrobe garments.
  - Renders side-by-side Before/After comparisons and archives sessions in your historical try-on shelf.

### 10. 📈 Sartorial Analytics (`/analytics`)
- **What it does**: Visual telemetry tracking your wardrobe wear cadence, score progression, and color balance.
- **How it works**:
  - Interactive Recharts visualizing score history over time.
  - Distribution of garment categories (Tops vs Bottoms vs Outerwear).
  - Identification of "Anchor Pieces" (your most rotated wardrobe champions).

### 11. 👤 Client Dossier (`/profile`)
- **What it does**: Manage account credentials, edit aesthetic keywords, update body proportion archetypes, and replace reference portraits.

### 12. 🛡️ Administrative Command Console (`/admin`)
- **What it does**: Restricted governance dashboard for platform admins (`Role.ADMIN`).
- **Features**: Live user count, active sessions, scan metrics, and real-time security audit incident logs with 1-click resolution.

---

## 🛠️ Technology Stack

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Framework** | Next.js 16.4.0 (App Router) | React Server Components, Turbopack, and async Request APIs. |
| **Language** | TypeScript 5 | End-to-end type safety across database models and API payloads. |
| **Design System** | Tailwind CSS v4 + VAYN Palette | High-contrast editorial palette (Ivory `#F4EFE6`, Terracotta `#A95239`, Olive `#737A60`, Deep Ink `#1C1B18`). |
| **Animation** | Framer Motion | Smooth, slow editorial page fades and multi-step wizard slides. |
| **Database** | PostgreSQL 16 + Prisma 6.4.0 | ACID transactional safety, foreign key cascades, and automated schema migrations. |
| **Validation** | Zod | Strict runtime schema parsing on all untrusted API inputs and AI outputs. |
| **Visualizations** | Recharts v3 | Responsive SVG data charts for analytics and admin dashboards. |
| **Testing** | Vitest v5 | Fast node-native testing environment (63/63 passing tests). |
| **Security** | bcryptjs & crypto | 12-round salted password hashing and timing-attack resistant session comparisons. |

---

## 🚀 Quick Start (Local Setup)

### 1. Prerequisites
- Node.js 20+ (LTS)
- PostgreSQL 15+ running locally or via Docker

### 2. Clone & Install
```bash
git clone https://github.com/spidermanindian027-dotcom/project-x.git
cd project-x
npm install --legacy-peer-deps
```

### 3. Environment Variables
Create `.env` file in the project root:
```env
# Database Connection String
DATABASE_URL="postgresql://ccuser:ccpassword@localhost:5433/vestra_db?schema=public"

# Session Security Key (32+ chars)
AUTH_SECRET="vayn_secret_session_encryption_key_32chars_min_production"

# Default Administrator Seed Credentials
ADMIN_EMAIL="admin@vestra.ai"
ADMIN_PASSWORD="AdminSecurePassword2026!"
ADMIN_NAME="VAYN Atelier Director"

# Optional Cloud AI Providers (Fallbacks to deterministic development adapter)
OPENAI_API_KEY=""
GEMINI_API_KEY=""

# Optional S3 Storage Providers (Fallbacks to local uploads)
S3_BUCKET=""
S3_REGION=""
S3_ACCESS_KEY_ID=""
S3_SECRET_ACCESS_KEY=""

NODE_ENV="development"
```

### 4. Push Schema & Seed
```bash
npm run db:push
npm run db:seed
```

### 5. Launch Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🔑 Default Accounts (Local & Staging)

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Atelier Director** | `admin@vestra.ai` | `AdminSecurePassword2026!` | Administrative Command (`/admin`) + Full Atelier |
| **Private Client** | `client@vestra.ai` | `ClientPassword2026!` | Wardrobe Vault, Scanner, Try-On, Looks |

*(Or register a new account instantly at [/register](http://localhost:3000/register))*

---

## 🧪 Automated Testing & Verification

Run the full Vitest regression suite:
```bash
npm run test
```
**Results: 63 tests passing across 5 test suites (100% pass rate)**:
- `tests/auth.test.ts` (15 tests)
- `tests/phase3-phase4.test.ts` (16 tests)
- `tests/phase5-6-7.test.ts` (13 tests)
- `tests/phase8-9-10.test.ts` (11 tests)
- `tests/phase11-12-13.test.ts` (8 tests)

Static analysis & build checks:
```bash
npx tsc --noEmit    # 0 errors
npm run lint         # 0 errors
npm run build        # Production Turbopack build succeeds
```

---

## 🌐 Deployment Guide (Vercel & Render)

### Deploying to Vercel
1. Import repository `spidermanindian027-dotcom/project-x` on **[Vercel Dashboard](https://vercel.com)**.
2. Set **Framework Preset**: `Next.js`.
3. Set **Root Directory**: `./`.
4. Configure Environment Variables:
   - `DATABASE_URL`: Hosted PostgreSQL connection URL (e.g. Neon, Supabase, or AWS RDS).
   - `AUTH_SECRET`: Random 32+ character string.
   - `ADMIN_EMAIL`: `admin@vestra.ai` (or your email).
   - `ADMIN_PASSWORD`: Your chosen secure password.
   - `ADMIN_NAME`: `VAYN Director`.
   - `NODE_ENV`: `production`.
5. Click **Deploy**.

### Deploying to Render
1. Create a **Web Service** on **[Render Dashboard](https://render.com)** connected to this GitHub repo.
2. Select **Runtime**: `Node`.
3. Configure build & start commands:
   - **Build Command**: `npm install && npm run db:push && npm run build`
   - **Start Command**: `npm run start`
4. Add Environment Variables:
   - `DATABASE_URL`: PostgreSQL connection string with SSL (`?sslmode=require`).
   - `AUTH_SECRET`: 32-character encryption key.
   - `NODE_ENV`: `production`.
5. Deploy Web Service.

---

## 📄 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
