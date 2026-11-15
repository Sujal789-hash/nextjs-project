# Next.js-Project-
# PitchConnect – Premium Startup Investor Pitch Booking Platform
**Design System: Emerald Luxe**  
*Built exclusively with Next.js 14 App Router, JavaScript (ES6+), JSX, Tailwind CSS, MongoDB, Mongoose, and Recharts.*

---

## 📑 Table of Contents
1. [Platform Vision & Core Purpose](#1-platform-vision--core-purpose)
2. [Complete User Journey & Website Flow](#2-complete-user-journey--website-flow)
   - [A. Public Experience (Landing Page & Discovery)](#a-public-experience)
   - [B. Authentication & Role-Based Entry](#b-authentication--role-based-entry)
   - [C. Startup Founder Flow](#c-startup-founder-flow)
   - [D. Accredited Investor Flow](#d-accredited-investor-flow)
   - [E. Platform Administrator Flow](#e-platform-administrator-flow)
3. [Comprehensive File-by-File Architecture](#3-comprehensive-file-by-file-architecture)
   - [Project Root & Configuration](#project-root--configuration)
   - [Application Shell & Styling (`app/`)](#application-shell--styling-app)
   - [Authentication & Access Control (`app/login`, `app/register`, `app/forgot-password`)](#authentication--access-control)
   - [Dashboard Suites (`app/dashboard/`)](#dashboard-suites-appdashboard)
   - [Core Feature Pages (`app/discover`, `app/meetings`, `app/pitch-decks`, etc.)](#core-feature-pages)
   - [API Route Handlers (`app/api/`)](#api-route-handlers-appapi)
   - [Reusable UI & Layout Components (`components/`)](#reusable-ui--layout-components-components)
   - [Business Logic & Matching Engine (`lib/`)](#business-logic--matching-engine-lib)
   - [Mongoose Database Models (`models/`)](#mongoose-database-models-models)
4. [Smart Weighted Matching Algorithm (0 to 100)](#4-smart-weighted-matching-algorithm-0-to-100)
5. [Server-Side Double Booking Prevention](#5-server-side-double-booking-prevention)
6. [Demo Accounts & 1-Click Authentication](#6-demo-accounts--1-click-authentication)
7. [Local Setup & Production Build](#7-local-setup--production-build)
8. [Vercel & Render Deployment Guide](#8-vercel--render-deployment-guide)

---

## 1. Platform Vision & Core Purpose

**PitchConnect** is an institutional-grade platform designed to streamline early-stage venture capital formation. It connects ambitious startup founders with accredited angel syndicates and venture capital partners.

Traditional fundraising suffers from cold email fatigue, opaque diligence, mismatched investment theses, and endless scheduling ping-pong. PitchConnect eliminates these bottlenecks through:
- **Transparent 0–100 Weighted Compatibility Scoring**: Matching founders with investors whose check size, sector thesis, and stage criteria align with the startup.
- **Audited Pitch Deck Diligence**: Secure PDF deck hosting with view tracking, download metrics, and 5-point investor rating scorecards.
- **Anti-Collision Calendar Synchronizer**: Server-side double-booking checks and instant Google Meet link generation.
- **Capital Mobilization Tracker**: Live progress monitoring comparing closed wire transfers to round targets.
- **Institutional Governance**: Admin review queue for SEC Form D accreditation and corporate certificate validation.

---

## 2. Complete User Journey & Website Flow

### A. Public Experience
1. **Landing at `http://localhost:3000`**:
   - Visitors land on an Emerald Luxe themed showcase featuring platform statistics (\$840M+ deployed, 450+ partners, 1,200+ founders, 78% pitch success).
   - Visitors can review the interactive terminal preview, the 4-step workflow, featured investors, pipeline ventures, and the FAQ accordion.
2. **Public Discovery & Matrix Comparison**:
   - Visitors can navigate to `/discover` to search investors or `/compare` to examine side-by-side metrics of verified startups before registering.

### B. Authentication & Role-Based Entry
1. **Registration (`/register`)**:
   - The user fills out: Full Name, Email, Phone Number, Password, Confirm Password, and selects an **Account Role** (`Startup Founder`, `Accredited Investor`, or `Platform Administrator`).
   - The form is validated using a **Zod** schema with a `.refine()` rule ensuring `password === confirmPassword`.
   - On submission, the password is encrypted with `bcryptjs`, the user record is stored, and an encrypted **JWT cookie** (`httpOnly: true, sameSite: 'lax'`) is set.
2. **Sign In (`/login`)**:
   - The user inputs credentials or clicks one of the **1-Click Quick Demo Buttons** (`Founder`, `Investor`, or `Admin`).
   - The application checks credentials, verifies roles, sets the session cookie, and routes the user to their tailored dashboard.

### C. Startup Founder Flow
1. **Founder Terminal (`/dashboard/founder`)**:
   - Greets the founder with live statistics: Capital Secured vs Target Ask, Confirmed Pitches, Pending Requests, and an interactive **Recharts Area Chart** showing month-over-month funding mobilization.
   - Highlights the highest-compatibility matching investors and upcoming meetings.
2. **Profile & Financial Metrics (`/profile`)**:
   - The founder sets company specifics: Startup Name, Sector, Current Stage, Valuation Cap, Target Ask, Team Size, Location, and Traction/ARR.
3. **Pitch Deck Upload & Diligence (`/pitch-decks`)**:
   - The founder uploads their institutional pitch deck (PDF format, up to 25MB).
   - An upload progress animation confirms processing. The system assigns a version number (e.g. `v1`, `v2`) and begins logging view and download counters.
   - The founder reviews written feedback and star ratings left by venture partners.
4. **Investor Discovery & Meeting Request (`/discover`)**:
   - The founder filters partners by industry, check size sweet-spot, and location.
   - The founder inspects the **Match Percentage** badge (e.g. `94% Fit`) to understand why that investor was recommended.
   - Clicking **"Request Pitch Slot"** opens the `BookingModal`, allowing the founder to choose a calendar date, time slot, agenda, and pitch questions.
5. **Session Calendar (`/meetings`)**:
   - Visualizes all requested, confirmed, and past meetings in monthly or list views. When an investor accepts, an instant Google Meet room link is generated for the call.
6. **In-App Messaging (`/messages`)**:
   - The founder chats directly with interested investors to share additional diligence items, answer follow-up questions, and coordinate meetings.
7. **Funding Tracker (`/funding`)**:
   - Visualizes closed commitments vs round targets with milestone roadmaps (SAFE notes, lead commitments, syndication, legal closing).

### D. Accredited Investor Flow
1. **Investor Terminal (`/dashboard/investor`)**:
   - Displays incoming pitch requests, confirmed partner sessions, saved ventures, and a **Recharts Donut Chart** showing sector portfolio allocation.
2. **Thesis Parameters (`/profile`)**:
   - The investor specifies minimum and maximum check sizes (\$100k to \$5M+), preferred stages, and focus sectors.
3. **Screening & Comparison (`/discover` & `/compare`)**:
   - The investor filters candidate startups, selects up to 3 ventures, and compares them side-by-side across ARR growth, team size, valuation, and business model.
4. **Pitch Deck Review Hub (`/pitch-decks`)**:
   - The investor previews the startup's verified PDF deck and submits a formal review rating Business Model, Market Size, Innovation Moat, and Financial Projections (1–5 stars) along with written feedback.
5. **Managing Inbound Pitches (`/meetings`)**:
   - The investor reviews incoming pitch meeting requests. Clicking **"Accept"** locks the slot and notifies the founder; clicking **"Decline"** frees the slot.

### E. Platform Administrator Flow
1. **Command Dashboard (`/dashboard/admin`)**:
   - Displays global platform telemetry: Total Users, Total Startups, Active Investors, and Completed Meetings.
2. **Compliance & Verification Queue (`/dashboard/admin#verifications`)**:
   - Audits corporate incorporation filings and SEC accreditation documents. Clicking **"Approve"** grants the gold `Verified Partner` badge to that profile.
3. **User Management**:
   - Inspects registered accounts, assigns access levels, and audits platform safety.
4. **Demo Data Reset**:
   - Admin can trigger the `/api/seed` endpoint to reset demo data at any time.

---

## 3. Comprehensive File-by-File Architecture

```
Project Next/
├── package.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── jsconfig.json
├── vercel.json
├── render.yaml
├── .env.example
├── .env.local
├── README.md
├── app/
│   ├── layout.jsx
│   ├── globals.css
│   ├── page.jsx
│   ├── login/page.jsx
│   ├── register/page.jsx
│   ├── forgot-password/page.jsx
│   ├── profile/page.jsx
│   ├── discover/page.jsx
│   ├── pitch-decks/page.jsx
│   ├── meetings/page.jsx
│   ├── messages/page.jsx
│   ├── compare/page.jsx
│   ├── funding/page.jsx
│   ├── dashboard/
│   │   ├── layout.jsx
│   │   ├── page.jsx
│   │   ├── founder/page.jsx
│   │   ├── investor/page.jsx
│   │   └── admin/page.jsx
│   └── api/
│       ├── auth/
│       │   ├── register/route.js
│       │   ├── login/route.js
│       │   ├── logout/route.js
│       │   └── me/route.js
│       ├── startups/
│       │   ├── route.js
│       │   └── [id]/route.js
│       ├── investors/
│       │   ├── route.js
│       │   ├── [id]/route.js
│       │   └── match/route.js
│       ├── pitch-decks/
│       │   ├── route.js
│       │   └── [id]/review/route.js
│       ├── meetings/
│       │   ├── route.js
│       │   └── [id]/route.js
│       ├── messages/route.js
│       ├── notifications/route.js
│       ├── favorites/route.js
│       ├── admin/
│       │   ├── stats/route.js
│       │   └── verify/route.js
│       └── seed/route.js
├── components/
│   ├── ui/
│   │   ├── Button.jsx
│   │   ├── Badge.jsx
│   │   ├── Card.jsx
│   │   ├── Input.jsx
│   │   ├── Select.jsx
│   │   └── Modal.jsx
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Sidebar.jsx
│   │   └── DashboardHeader.jsx
│   ├── dashboard/
│   │   ├── StatCard.jsx
│   │   ├── FundingChart.jsx
│   │   ├── IndustryPieChart.jsx
│   │   └── RecentMeetings.jsx
│   ├── investor/
│   │   ├── InvestorCard.jsx
│   │   └── InvestorFilters.jsx
│   ├── startup/
│   │   ├── StartupCard.jsx
│   │   └── StartupComparisonTable.jsx
│   ├── meetings/
│   │   ├── CalendarView.jsx
│   │   └── BookingModal.jsx
│   ├── messaging/
│   │   ├── ConversationList.jsx
│   │   └── ChatWindow.jsx
│   └── admin/
│       └── VerificationTable.jsx
├── lib/
│   ├── mongodb.js
│   ├── auth.js
│   ├── matching.js
│   ├── dataService.js
│   ├── mockData.js
│   └── validations/
│       └── authSchema.js
├── models/
│   ├── User.js
│   ├── Startup.js
│   ├── Investor.js
│   ├── PitchDeck.js
│   ├── Meeting.js
│   ├── Message.js
│   ├── Conversation.js
│   ├── Notification.js
│   ├── Review.js
│   ├── Favorite.js
│   └── Verification.js
└── scripts/
    └── seed.js
```

---

### Project Root & Configuration

- **`package.json`**:
  Defines project dependencies (Next.js 14.2.18, React 18, Tailwind CSS, Mongoose, Zod, React Hook Form, Recharts, Lucide React, jsonwebtoken, bcryptjs) and execution scripts (`dev`, `build`, `start`, `seed`).
- **`next.config.js`**:
  Next.js engine configuration. Configures image domains (`images.unsplash.com`, `ui-avatars.com`) and React strict mode.
- **`tailwind.config.js`**:
  Extends Tailwind with the Emerald Luxe color system (`forest`, `emerald`, `ivory`, `charcoal`, `sage`, `gold`), custom box shadows (`emerald-glow`, `gold-glow`), and fonts.
- **`postcss.config.js`**:
  Configures Tailwind CSS and Autoprefixer parsing.
- **`jsconfig.json`**:
  Configures JavaScript module resolution so that path aliases (`@/*` pointing to `./*`) resolve cleanly during Webpack compilation.
- **`vercel.json`**:
  Deployment manifest for Vercel specifying the Next.js framework, build command, and security headers (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`).
- **`render.yaml`**:
  Infrastructure as Code specification for deploying PitchConnect to Render as a Node web service.
- **`.env.example` & `.env.local`**:
  Defines environment secrets including `MONGODB_URI`, `JWT_SECRET`, and `NEXT_PUBLIC_APP_URL`.

---

### Application Shell & Styling (`app/`)

- **`app/layout.jsx`**:
  The HTML root wrapper. Configures the `<html lang="en">` tag, injects `globals.css`, and defines SEO metadata (title, description, and icons).
- **`app/globals.css`**:
  Contains Tailwind directives, custom CSS variables for Emerald Luxe colors, custom scrollbar styling, glassmorphism panel helpers, and gradient utilities.
- **`app/page.jsx`**:
  The public landing page. Houses the Hero section, platform statistics counter, 4-step workflow, featured investors, pipeline startups, feature grid, testimonials, and FAQ accordion.

---

### Authentication & Access Control

- **`app/login/page.jsx`**:
  Client-rendered login page. Includes form fields with email/password validation, links to registration and password reset, and 1-click test buttons to instantly sign in as Founder, Investor, or Admin.
- **`app/register/page.jsx`**:
  Registration portal. Collects Full Name, Email, Phone, Role, Password, and Confirm Password. Integrates with the backend Zod validation to ensure passwords match before account creation.
- **`app/forgot-password/page.jsx`**:
  Password reset request interface. Collects the user's email and provides clear verification instructions upon submission.

---

### Dashboard Suites (`app/dashboard/`)

- **`app/dashboard/layout.jsx`**:
  Role-protected dashboard wrapper. Queries `/api/auth/me` on mount. If unauthenticated, it redirects to `/login`. Renders the fixed desktop sidebar, mobile drawer, and top navigation header.
- **`app/dashboard/page.jsx`**:
  Intelligent dispatcher. Detects the authenticated user's role and immediately routes them to `/dashboard/founder`, `/dashboard/investor`, or `/dashboard/admin`.
- **`app/dashboard/founder/page.jsx`**:
  Terminal for founders. Displays capital raised vs target, confirmed/pending meeting tallies, Recharts funding charts, pitch deck status, and algorithm-recommended investors.
- **`app/dashboard/investor/page.jsx`**:
  Console for investors. Displays deal flow KPIs, Recharts sector distribution pie chart, incoming pitch requests with one-click Accept/Decline actions, and recent pitch deck uploads.
- **`app/dashboard/admin/page.jsx`**:
  Administrator governance console. Displays platform-wide metrics, the SEC credential verification queue, registered user management table, and demo database reset button.

---

### Core Feature Pages

- **`app/profile/page.jsx`**:
  Profile management hub. Adapts dynamically to the user's role:
  - *Founders*: Edit company overview, sector, valuation cap, funding target, ARR, and team size.
  - *Investors*: Configure check size range (\$100k - \$5M+), preferred sectors, and stage thesis.
- **`app/discover/page.jsx`**:
  Investor discovery engine. Features keyword search, multi-parameter filtering (industry, stage, location, check size), sorting, pagination, bookmarking, and 0–100 compatibility match badges.
- **`app/meetings/page.jsx`**:
  Meeting and calendar coordinator. Renders month and list views, displays meeting statuses, provides Google Meet room links, and opens the booking modal.
- **`app/pitch-decks/page.jsx`**:
  Pitch deck management and diligence hub. Handles PDF uploads (with validation up to 25MB), file downloads, view counters, and the investor scorecard review system (1–5 ratings and written feedback).
- **`app/messages/page.jsx`**:
  Direct in-app messaging. Displays conversation threads, unread indicators, chat history, and real-time message sending.
- **`app/compare/page.jsx`**:
  Startup comparison matrix. Allows investors to select up to 3 ventures and benchmark them side-by-side across funding targets, valuation, ARR growth, team size, and business models.
- **`app/funding/page.jsx`**:
  Funding progress tracker. Displays round targets, closed wire transfers, remaining allocations, milestone timelines, and regulatory compliance disclosures.

---

### API Route Handlers (`app/api/`)

- **`app/api/auth/register/route.js`**:
  Validates incoming JSON with Zod `registerSchema`, hashes passwords with `bcryptjs`, writes the user to the database, and issues an HTTP-only JWT cookie.
- **`app/api/auth/login/route.js`**:
  Authenticates email and password credentials, validates hashes, and issues an encrypted JWT cookie.
- **`app/api/auth/logout/route.js`**:
  Clears the authentication cookie and ends the session.
- **`app/api/auth/me/route.js`**:
  Extracts the JWT token from the request cookie/header, queries the user record, and hydrats the corresponding startup or investor profile.
- **`app/api/startups/route.js`**:
  - `GET`: Returns list of startups with search, industry, stage, and featured filters.
  - `POST`: Role-protected endpoint allowing founders to upsert their startup profile.
- **`app/api/startups/[id]/route.js`**:
  Returns detailed profile data for a specific startup, including associated pitch decks and reviews.
- **`app/api/investors/route.js`**:
  - `GET`: Returns list of investors filtered by sector, stage, location, and check size.
  - `POST`: Allows investors to upsert their investment thesis and ticket sizes.
- **`app/api/investors/[id]/route.js`**:
  Returns a single investor profile with portfolio history.
- **`app/api/investors/match/route.js`**:
  Executes the transparent weighted matching algorithm, scoring every investor against the current startup and sorting matches descending by compatibility.
- **`app/api/pitch-decks/route.js`**:
  - `GET`: Fetches pitch decks for a startup.
  - `POST`: Validates PDF extension, checks file size, and creates a new versioned pitch deck record.
- **`app/api/pitch-decks/[id]/review/route.js`**:
  Accepts investor ratings (1–5 across 4 categories) and written feedback, saves the review, and notifies the founder.
- **`app/api/meetings/route.js`**:
  - `GET`: Returns meetings filtered by the authenticated user's role.
  - `POST`: Enforces server-side double booking prevention, generates a Google Meet link, creates the meeting record with `Pending` status, and notifies the investor.
- **`app/api/meetings/[id]/route.js`**:
  `PATCH`: Updates meeting status (`Accepted`, `Rejected`, `Cancelled`) and notifies the counterpart.
- **`app/api/messages/route.js`**:
  - `GET`: Returns all conversations for the user or message history for a specific thread.
  - `POST`: Sends a message, creates conversation threads if needed, updates last message timestamps, and triggers an in-app notification.
- **`app/api/notifications/route.js`**:
  - `GET`: Returns all notifications and unread counts for the user.
  - `PATCH`: Marks a single notification or all notifications as read.
- **`app/api/favorites/route.js`**:
  - `GET`: Retrieves bookmarked investor and startup IDs.
  - `POST`: Toggles bookmark state (add or remove).
- **`app/api/admin/stats/route.js`**:
  Admin-only endpoint returning global platform counts, funding aggregates, and user account lists.
- **`app/api/admin/verify/route.js`**:
  Admin-only endpoint to review, approve, or reject corporate filings and SEC accreditation credentials.
- **`app/api/seed/route.js`**:
  Resets and repopulates the MongoDB or in-memory fallback store with realistic demo data.

---

### Reusable UI & Layout Components (`components/`)

- **`components/ui/Button.jsx`**:
  Custom button supporting variants (`primary`, `emerald`, `gold`, `secondary`, `outline`, `ghost`, `danger`), sizes (`sm`, `md`, `lg`), and an animated loading spinner (`Loader2`).
- **`components/ui/Badge.jsx`**:
  Colored badge component for stages, sectors, meeting statuses, and verified accreditation labels.
- **`components/ui/Card.jsx`**:
  Card surface styled with Emerald Luxe borders, custom shadows, and optional hover states.
- **`components/ui/Input.jsx`**:
  Form input with labels, icon prefixes, error messages, and forest-colored focus rings.
- **`components/ui/Select.jsx`**:
  Styled select dropdown for sectors, stages, locations, and roles.
- **`components/ui/Modal.jsx`**:
  Modal overlay featuring backdrop blur, keyboard accessibility (`Escape` key listener), and scroll-locking.
- **`components/layout/Navbar.jsx`**:
  Public navigation bar with brand logo, smooth-scroll links, session detection, and a mobile hamburger menu.
- **`components/layout/Footer.jsx`**:
  Institutional footer with ecosystem links, legal disclosures, and encryption compliance badges.
- **`components/layout/Sidebar.jsx`**:
  Fixed Forest Green sidebar (`#145A46`) rendering navigation links tailored to the user's role, with an avatar pill and sign-out button.
- **`components/layout/DashboardHeader.jsx`**:
  Top bar displaying a personalized greeting, quick search button, profile link, and a notification dropdown with live unread badge.
- **`components/dashboard/StatCard.jsx`**:
  KPI card showing title, value, icon accent, and positive/negative trend markers.
- **`components/dashboard/FundingChart.jsx`**:
  Client-rendered Recharts AreaChart visualizing month-over-month capital commitments vs targets.
- **`components/dashboard/IndustryPieChart.jsx`**:
  Client-rendered Recharts PieChart depicting sector allocation percentages.
- **`components/dashboard/RecentMeetings.jsx`**:
  Actionable meeting list with status badges, Google Meet links, and Accept/Decline action buttons.
- **`components/investor/InvestorCard.jsx`**:
  Investor profile card showing title, firm, check size range, sector badges, match score, and request buttons.
- **`components/investor/InvestorFilters.jsx`**:
  Filter toolbar with search, industry, stage, location, and reset buttons.
- **`components/startup/StartupCard.jsx`**:
  Startup overview card displaying valuation, round target, ARR growth, team size, deck link, and a comparison checkbox.
- **`components/startup/StartupComparisonTable.jsx`**:
  Side-by-side benchmark table comparing up to 3 ventures across financial metrics, business models, and team sizes.
- **`components/meetings/BookingModal.jsx`**:
  Interactive booking modal with date selection, time slot choices, agenda input, and pitch highlights.
- **`components/meetings/CalendarView.jsx`**:
  Monthly calendar grid showing scheduled meetings on specific dates.
- **`components/messaging/ConversationList.jsx`**:
  Sidebar displaying active messaging threads, counterpart names, timestamps, and message snippets.
- **`components/messaging/ChatWindow.jsx`**:
  Full chat interface with message bubbles, encryption indicators, and a message input form.
- **`components/admin/VerificationTable.jsx`**:
  Admin queue table showing submitted documents, applicant IDs, and Approve/Reject buttons.

---

### Business Logic & Matching Engine (`lib/`)

- **`lib/mongodb.js`**:
  Establishes a cached Mongoose connection across hot reloads in development and serverless invocations in production.
- **`lib/auth.js`**:
  Contains authentication utilities: `hashPassword`, `comparePassword`, `signJwtToken`, `verifyJwtToken`, `getTokenFromRequest`, and `getUserFromRequest`.
- **`lib/matching.js`**:
  Implements the transparent **Weighted Compatibility Scoring Algorithm** (0 to 100).
- **`lib/dataService.js`**:
  Unified data service layer. Queries Mongoose when MongoDB is available, and transparently falls back to `global.__pitchconnect_store__` if offline. Ensures the application operates reliably in any environment.
- **`lib/mockData.js`**:
  Initial seed dataset containing users, startups, investors, decks, meetings, reviews, messages, notifications, and verifications.
- **`lib/validations/authSchema.js`**:
  Defines Zod schemas for registration (with `refine()` password confirmation), login, startup profiles, and investor profiles.

---

### Mongoose Database Models (`models/`)

- **`models/User.js`**:
  Defines the User schema (`fullName`, `email`, `phone`, `password`, `role`, `avatar`, `isVerified`, `status`).
- **`models/Startup.js`**:
  Defines the Startup schema (`startupName`, `founderName`, `industry`, `stage`, `fundingRequired`, `fundingRaised`, `currentValuation`, `revenueInfo`, `pitchDeckUrl`, `isVerified`).
- **`models/Investor.js`**:
  Defines the Investor schema (`fullName`, `organization`, `title`, `biography`, `checkSizeMin`, `checkSizeMax`, `preferredIndustries`, `preferredStages`, `availableMeetingSlots`, `isVerified`).
- **`models/PitchDeck.js`**:
  Defines the PitchDeck schema (`startupId`, `title`, `fileName`, `fileSize`, `fileUrl`, `version`, `viewsCount`, `downloadsCount`, `isActive`).
- **`models/Meeting.js`**:
  Defines the Meeting schema (`startupId`, `founderUserId`, `investorId`, `investorUserId`, `date`, `startTime`, `endTime`, `agenda`, `status`, `meetingLink`). Includes compound index on `{ investorId: 1, date: 1, startTime: 1 }`.
- **`models/Conversation.js`**:
  Defines the Conversation schema (`participants`, `lastMessage`, `unreadCounts`).
- **`models/Message.js`**:
  Defines the Message schema (`conversationId`, `senderId`, `senderName`, `senderRole`, `content`, `readBy`).
- **`models/Notification.js`**:
  Defines the Notification schema (`userId`, `title`, `message`, `type`, `link`, `isRead`).
- **`models/Review.js`**:
  Defines the Review schema (`startupId`, `investorId`, `businessModelRating`, `marketOpportunityRating`, `productInnovationRating`, `overallRating`, `writtenFeedback`, `interestLevel`).
- **`models/Favorite.js`**:
  Defines the Favorite bookmark schema with unique compound index `{ userId: 1, targetType: 1, targetId: 1 }`.
- **`models/Verification.js`**:
  Defines the Verification schema for SEC filings and corporate certificates (`targetType`, `targetId`, `userId`, `documents`, `status`, `adminNotes`).

---

### Scripts (`scripts/`)

- **`scripts/seed.js`**:
  Standalone Node.js script to connect to MongoDB and trigger database seeding.

---

## 4. Smart Weighted Matching Algorithm (0 to 100)

Located in `lib/matching.js`, this transparent algorithm calculates compatibility without relying on ambiguous black-box claims:

$$\text{Total Score} = \text{Industry Score (35\%)} + \text{Ticket Fit (35\%)} + \text{Stage Fit (30\%)}$$

1. **Industry Alignment (Max 35 points)**:
   - *Exact Sector Match*: 35 points (e.g. Founder is `AI & Machine Learning` and investor specializes in `AI & Machine Learning`).
   - *Adjacent/Sub-sector Synergy*: 22 points (e.g. `FinTech Infrastructure` vs `Enterprise SaaS`).
   - *General Candidate*: 8 points.
2. **Check Size & Funding Ask (Max 35 points)**:
   - *Within Investor Sweet Spot*: 35 points (e.g. Startup ask \$1.5M falls within Investor check range \$500k – \$2.5M).
   - *Within 25% Margin*: 22 points.
   - *Outside Target*: 10 points.
3. **Stage Suitability (Max 30 points)**:
   - *Direct Stage Focus*: 30 points (e.g. Startup is `Seed` and investor deploys at `Seed`).
   - *Adjacent Stage Profile*: 18 points (e.g. `Pre-Seed` to `Seed`).
   - *Non-adjacent*: 5 points.

The result is clamped between 15% and 98%, producing a detailed rationale (e.g. *"Optimal check size: Funding ask (\$1,500k) aligns with investor range (\$500k - \$2,500k)"*) and a suggested next step.

---

## 5. Server-Side Double Booking Prevention

Meeting collisions are prevented at the API layer in `app/api/meetings/route.js`:
1. When a founder requests a slot, the system queries existing meetings matching:
   - `investorId`: The target partner.
   - `date`: The requested date (e.g. `2026-11-18`).
   - `startTime`: The chosen time slot (e.g. `10:00`).
2. If an existing record has a status of `Pending` or `Accepted`, the API rejects the request with HTTP 400:
   > *"This time slot has already been requested or booked. Please select another slot."*
3. This guarantees that no two founders can reserve the same partner at the same time.

---

## 6. Demo Accounts & 1-Click Authentication

You can sign in immediately using these pre-seeded accounts:

| Persona | Email | Password | Pre-configured Data |
|---|---|---|---|
| **Startup Founder** | `sarah.chen@zenithai.com` | `founder123` | Founder of **Zenith AI** (Seed stage, \$1.5M ask, \$950k secured) |
| **Startup Founder 2** | `marcus@greenpulse.io` | `founder123` | Founder of **GreenPulse Energy** (Series A, \$3.0M ask) |
| **Accredited Investor** | `david@emeraldventures.vc` | `investor123` | Managing Partner at **Emerald Capital** (\$500k – \$2.5M check) |
| **Accredited Investor 2**| `victoria@apexhorizon.com` | `investor123` | Founding Partner at **Apex Horizon Ventures** (\$1.0M – \$5.0M) |
| **Platform Administrator**| `admin@pitchconnect.com` | `admin123` | Access to SEC verification queue and user accounts |

*(The [Login Page](http://localhost:3000/login) includes **1-Click Quick Demo Buttons** to populate these credentials instantly).*

---

## 7. Local Setup & Production Build

### Running Locally
```bash
# 1. Install dependencies
npm install

# 2. Run in development mode
npm run dev

# 3. Access in your browser
http://localhost:3000
```

### Running a Verified Production Build
```bash
# 1. Compile production bundle
npm run build

# 2. Start the production server
npm start
```

---

## 8. Vercel & Render Deployment Guide

### Deploying to Vercel
1. Push your repository to GitHub, GitLab, or Bitbucket.
2. In [Vercel](https://vercel.com), click **Add New...** ➔ **Project** and import the repository.
3. Vercel detects the Next.js framework automatically. The build command is pre-configured in `vercel.json` (`next build`).
4. In **Environment Variables**, provide:
   - `JWT_SECRET`: Any secure 32+ character random string.
   - `MONGODB_URI`: Your MongoDB Atlas connection URI.
   - `NEXT_PUBLIC_APP_URL`: Your Vercel domain (e.g. `https://pitchconnect.vercel.app`).
5. Click **Deploy**. Vercel will build all 33 static and dynamic routes.

### Deploying to Render
1. Push your repository to GitHub or GitLab.
2. In [Render](https://render.com), click **New +** ➔ **Blueprint** and connect your repository. Render will automatically read `render.yaml`.
3. Alternatively, create a **Web Service** manually:
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Set the following Environment Variables in the Render dashboard:
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: A secure 32+ character random string.
   - `MONGODB_URI`: Your MongoDB Atlas connection URI.
   - `NEXT_PUBLIC_APP_URL`: Your Render service URL (e.g. `https://pitchconnect.onrender.com`).
5. Click **Create Web Service** to launch your live production instance.
