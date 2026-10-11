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

## 💡 What Real-World Problems Does VESTRA AI Solve?

Most people face persistent daily friction when managing their clothing, getting dressed, and making fashion decisions:

1. **"The Closet Full of Clothes, But Nothing to Wear" Paradox**:
   - People own dozens or hundreds of items, yet wear only 20% of their wardrobe repeatedly because they cannot visualize new combinations across categories.
   - **VESTRA's Solution**: The **AI Wardrobe Matching Engine** automatically synthesizes cohesive outfits solely from garments you already own, rediscovering forgotten pieces and eliminating decision fatigue.

2. **Subjective Uncertainty Before Stepping Out**:
   - Am I dressed appropriately for this event? Do these colors clash? Are my proportions balanced?
   - **VESTRA's Solution**: The **Outfit Scanner** grades your look using a 6-dimension weighted rubric (*Fit & Proportions 25%, Colour Harmony 20%, Coordination 20%, Occasion 15%, Accessories 10%, Style 10%*) providing objective, constructive, editorial critiques.

3. **Weather, Travel, and Event Misalignments**:
   - Dressing for destination weather, evening dress codes, or transitioning from day meetings to night dinners often results in being over- or under-dressed or physically uncomfortable.
   - **VESTRA's Solution**: **Location & Occasion Styling** takes local weather, time of day, and specific event rules (*College, Interview, Boardroom, Gala, Trekking*) into account before suggesting ensembles.

4. **Fast Fashion Waste & Impulsive Shopping**:
   - Consumers constantly buy new clothes thinking they have nothing to wear for upcoming events.
   - **VESTRA's Solution**: **Ask VESTRA (AI Stylist)** and the **Virtual Try-On Studio** allow users to experiment with styling, accessories, and new combinations digitally first, promoting mindful consumption and capsule wardrobe longevity.

---

## 🏛️ System Architecture

VESTRA AI is built as a unified, high-performance full-stack system leveraging the Next.js 16 App Router, PostgreSQL, and modular AI/storage provider abstractions:

```mermaid
flowchart TD
    subgraph Client ["Client Layer (Responsive Editorial Atelier)"]
        UI["Web & Mobile UI (Next.js 16 App Router, Tailwind CSS v4, Framer Motion)"]
        Charts["Analytics Dashboard (Recharts Visualizations)"]
        Camera["Live Camera Stream (Silhouette Framing & Canvas Capture)"]
    end

    subgraph Security ["Edge Security & Route Protection"]
        Proxy["Proxy Guard (proxy.ts - Session Verification & RBAC)"]
        RateLimit["Sliding-Window Rate Limiter (lib/rate-limit.ts)"]
        Redactor["Audit Logger & Data Redactor (lib/logger/index.ts)"]
    end

    subgraph Backend ["Backend API & Services Layer"]
        AuthSvc["Auth & Session Engine (bcryptjs, crypto, async cookies)"]
        WardrobeSvc["Digital Wardrobe Ingestion & Orphan File Cleaner"]
        MatchingEngine["AI Capsule Matching Engine (Zero Hallucination)"]
        StylistChat["Conversational Stylist (Context Injection)"]
        TryOnPipeline["Virtual Try-On Architecture (Diffusion Preview Adapter)"]
        WeatherAdapter["Meteorological Adapter (Geo & Climate Resolver)"]
    end

    subgraph Storage ["Persistence & Object Storage"]
        PrismaORM["Prisma ORM Client v6.4.0"]
        PostgreSQL[("PostgreSQL 16 Database\n(Users, Wardrobe, Analyses, Looks, Sessions, Logs)")]
        FileStorage["Object Storage Layer (Local Filesystem / AWS S3 / Cloudflare R2)"]
    end

    UI --> Proxy
    Proxy --> Security
    Security --> Backend
    Backend --> PrismaORM
    PrismaORM --> PostgreSQL
    Backend --> FileStorage
```

---

## 🗺️ How Each Feature Works (Interactive Options Breakdown)

### 1. 🗄️ Digital Wardrobe (`/wardrobe`)
- **What it does**: Turns your physical closet into a searchable, categorized digital vault.
- **Garment Classification**: Supports 17 specialized categories (*Tops, Shirts, Trousers, Jeans, Shorts, Dresses, Skirts, Jackets, Sweaters, Hoodies, Shoes, Boots, Bags, Watches, Sunglasses, Jewellery, Other Accessories*).
- **Metadata Tagging**: Dominant colors, hex codes, patterns, fabrics (*Silk, Cashmere, Virgin Wool*), formality levels (*Casual to Evening Gala*), and seasonal suitability.
- **Interactive Controls**:
  - **Live Search**: Instant filtering by piece title, material, or styling notes.
  - **Category Pills**: Filter your view to specific items with count badges.
  - **Color Meter**: Select dominant color swatches to isolate matching pieces.
  - **Optimistic Favorites**: Toggle favorite pieces with instant heart icons.
  - **Ingestion Modal**: Capture live photo with camera or drag-and-drop image files (auto-compressed, validated 10KB–10MB).
  - **Storage Cleanup**: Deleting an item automatically deletes the image file from storage, preventing orphaned files.

### 2. 📸 Outfit Scanner (`/scan`)
- **What it does**: Analyzes your outfit from your webcam or uploaded photo using an editorial scoring engine.
- **Camera Silhouette Guide**: An interactive SVG dashed outline guides full-body framing before snapshot.
- **Weighted Scoring Rubric**:
  - **Fit & Proportions (25%)**: Silhouette balance, drape, hemline breaks, and the rule of thirds.
  - **Colour Harmony (20%)**: Complementary, monochromatic, or analogous color pairings.
  - **Coordination (20%)**: Compatibility of textures, fabrics, and piece styles.
  - **Occasion Appropriateness (15%)**: Suitability for current styling context.
  - **Accessories & Details (10%)**: Jewelry, footwear, belts, watches, and bag synergy.
  - **Style Coherence (10%)**: Clean execution of chosen fashion archetype.
- **Feedback Provided**:
  - Animated circular overall score gauge.
  - 6 horizontal score bars with weights.
  - *"What Works"* (accent gold highlights) & *"Areas to Refine"*.
  - Curated footwear, palette, and accessory suggestions.

### 3. 🪄 AI Wardrobe Matching (`/outfits`)
- **What it does**: Recommends complete, stylish outfits created **strictly from items you already own**.
- **Zero Hallucination Guarantee**: The algorithm verifies every piece ID against your database inventory. It will never recommend nonexistent or foreign items.
- **Occasion Selector**: Choose from *Executive Boardroom, Evening Gala, Daily Casual, Summer Cocktail, or Weekend Escape*.
- **Rationales Provided**:
  - Architectural breakdown of why the top and bottom pair well.
  - Silhouette and proportion commentary.
  - Color palette compatibility explanation.
  - One-click **"Save to Lookbook"** action.

### 4. 💬 Ask VESTRA — AI Stylist Chat (`/chat`)
- **What it does**: A 24/7 personal fashion consultant who answers your style questions with knowledge of what is inside your wardrobe.
- **Context Injection**: The stylist automatically inspects your profile archetypes, preferred colors, and cataloged pieces before answering.
- **Referenced Garment Chips**: When the stylist mentions an item you own (e.g., *"Pair your Charcoal Wool Trousers with your White Linen Shirt"*), a clickable pill appears allowing you to inspect the piece.
- **Common Queries Handled**:
  - *"What goes with my brown shirt?"*
  - *"What should I wear to a summer wedding?"*
  - *"Which shoes suit these trousers?"*
  - *"How can I improve my current look?"*

### 5. 🌍 Location & Occasion Styling (`/styling`)
- **What it does**: Combines meteorological forecasts with event dress codes to style you appropriately.
- **12 Supported Occasions**: *College, Office, Interview, Wedding, Date, Cafe, Concert, Beach, Airport, Party, Trekking, Custom*.
- **Weather Resolver**: Detects city or coordinates (manual input or browser geolocation) and extracts temperature, precipitation, and season to recommend appropriate layering.

### 6. 🪞 Virtual Try-On Studio (`/try-on`)
- **What it does**: Digitally composites wardrobe pieces onto a reference photo of yourself or a mannequin.
- **Interactive Before/After Slider**: Drag between the base reference model and the synthesized look.
- **Multi-Item Layering**: Select up to 4 garments simultaneously (top + bottom + outerwear + shoes).
- **Realistic Limitations**: Clearly explains that previews are artistic conceptual estimations and do not guarantee physical tensile drape.

### 7. 📊 Personal Analytics (`/analytics`)
- **What it does**: Uncovers your personal style habits and wardrobe utilization using interactive **Recharts**.
- **Visualizations**:
  - **Score Progression (LineChart)**: Tracks how your outfit scan scores evolve over time.
  - **Category Volume (BarChart)**: Visualizes the distribution of tops, bottoms, shoes, etc.
  - **Dominant Colors**: Shows your most-worn color swatches and frequencies.
  - **Anchor Pieces**: Identifies your most frequently worn garments.
  - **Zero Fake Data**: If you have no data yet, presents clear empty-state onboarding instead of fabricated stats.

### 8. 🛡️ Director Atelier Admin Console (`/admin`)
- **What it does**: Protected executive dashboard for platform administrators.
- **Access Control**: Strictly restricted to users with `Role.ADMIN` (others receive `403 Forbidden`).
- **Telemetry KPIs**: Tracks total registered users, 7-day active sessions, scans, average quality scores, wardrobe items, try-on syntheses, and operational incidents.
- **Operational Audit Log**: Search, filter, and resolve real-time security events (`LOGIN_FAILURE`, `AI_TIMEOUT`, `RATE_LIMIT_EXCEEDED`, `UNAUTHORIZED_ACCESS`).
- **Privacy Protections**: Location data is aggregated at the city level only; password hashes and private reference photos are never exposed.

---

## 🛠️ Technology Stack & Engineering Choices

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Framework** | Next.js 16.4.0 (App Router) | Server Components, Turbopack, async Request APIs, partial prefetching. |
| **Language** | TypeScript 5 | Strict end-to-end type safety across database models and API payloads. |
| **Styling** | Tailwind CSS v4 + shadcn/ui | Minimalist editorial fashion aesthetic without bloated CSS bundles. |
| **Animation** | Framer Motion | Smooth, slow editorial page fades and multi-step wizard slides. |
| **Database** | PostgreSQL 16 + Prisma 6.4.0 | Relational integrity, foreign key cascades, and automated schema migrations. |
| **Validation** | Zod v4 | Strict runtime schema parsing on all untrusted API inputs and AI outputs. |
| **Charts** | Recharts v3 | Responsive SVG data visualizations for analytics and admin dashboards. |
| **Testing** | Vitest v5 | Fast node-native testing environment (63/63 tests passing). |
| **Security** | bcryptjs & crypto | 12-round salted password hashing and timing-attack resistant session comparisons. |

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Node.js 20+ (LTS recommended)
- PostgreSQL 15+ running locally or in Docker

### 2. Clone & Install
```bash
git clone https://github.com/spidermanindian027-dotcom/project-x.git
cd project-x
npm install --legacy-peer-deps
```

### 3. Environment Setup
Create a `.env` file from `.env.example`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/vestra_db?schema=public"
AUTH_SECRET="vestra_secret_session_encryption_key_32chars_min_production"
ADMIN_EMAIL="admin@vestra.ai"
ADMIN_PASSWORD="AdminSecurePassword2026!"
ADMIN_NAME="Atelier Director"
NODE_ENV="development"
```

### 4. Push Schema & Seed
```bash
npm run db:push
npm run db:seed
```

### 5. Run Application
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)**.

---

## 🔑 Default Seeded Accounts

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Atelier Director** | `admin@vestra.ai` | `AdminSecurePassword2026!` | Admin Console (`/admin`) + Atelier |
| **Private Client** | `client@vestra.ai` | `ClientPassword2026!` | Wardrobe, Outfits, Scanner, Try-On |

*(You can also register a fresh account at [/register](http://localhost:3000/register))*

---

## 🧪 Automated Test Verification

Run the full Vitest regression suite:
```bash
npm run test
```
Result: **63 tests passed across 5 test suites (100% pass rate)**:
- `tests/auth.test.ts` (15 tests)
- `tests/phase3-phase4.test.ts` (16 tests)
- `tests/phase5-6-7.test.ts` (13 tests)
- `tests/phase8-9-10.test.ts` (11 tests)
- `tests/phase11-12-13.test.ts` (8 tests)

```bash
npx tsc --noEmit    # 0 errors
npm run lint         # 0 errors, 0 warnings
npm run build        # 37 routes compiled successfully with Turbopack
```

---

## 🌐 Cloud Deployment (Vercel & Render)

### Deploy on Vercel
1. Import `spidermanindian027-dotcom/project-x` on **[vercel.com](https://vercel.com)**.
2. Select **Framework Preset**: `Next.js`.
3. Add environment variables:
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
3. Add environment variables (`DATABASE_URL`, `AUTH_SECRET`, etc.).
4. Click **Deploy Web Service**.

---

## 📄 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
