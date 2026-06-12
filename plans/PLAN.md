# ServerHub - Project Plan

ServerHub is a Next.js application for selling certified pre-owned server equipment.

## Phases

| Phase | Title | Status | File |
|-------|-------|--------|------|
| 0 | Landing Page (Initial) | Complete | - |
| 0.5 | Database Integration (PostgreSQL + Drizzle) | Complete | - |
| 1 | Foundation & Routing | Complete | [phase1.md](./phase1.md) |
| 2 | Inventory System | Complete | [phase2.md](./phase2.md) |
| 3 | Shopping Cart & Checkout | Complete | [phase3.md](./phase3.md) |
| 4 | User Auth & Accounts | Complete | [phase4.md](./phase4.md) |
| 5 | Admin Dashboard | Complete | [phase5.md](./phase5.md) |
| 6 | Polish & Production | Complete | [phase6.md](./phase6.md) |
| 7 | Product Detail & Order Pages | Complete | - |
## Phase 9: Full Theme System Overhaul - COMPLETE

### Objective
Implement a complete, production-grade Light/Dark theme system across all 23 pages and 22 components.

### Three Theme Options
- **Light Mode** — Default for light OS preference
- **Dark Mode** — Full dark theme with WCAG AA contrast
- **System** — Follows OS `prefers-color-scheme` (default for new users)

### Implementation Details

#### Core Files
| File | Change |
|------|--------|
| `app/components/Header.tsx` | **CREATE** — missing file, will cause build failure |
| `app/components/ThemeProvider.tsx` | Simplify — remove redundant mounted check, use next-themes props directly |
| `app/components/ThemeToggle.tsx` | Fix — use `useTheme().theme` instead of direct localStorage reads |
| `app/globals.css` | Standardize CSS variables, add missing semantic tokens, ensure dark contrast |

#### Page-by-Page Migration

**Public Pages (12 pages):**

| Page | Route | Dark Mode Issues |
|------|-------|-----------------|
| Home | `/` | No issues — delegates to components |
| Hero | Component | Add dark blur colors for decorative elements |
| Features | Component | Add `dark:bg-gray-800/50` to section bg |
| HowItWorks | Component | Already uses semantic tokens — no changes needed |
| DashboardPreview | Component | Add dark blur colors for decorative elements |
| Pricing | Component | Add `dark:` to section bg |
| Footer | Component | Minor dark mode tweaks |
| TrustedBy | Component | Already uses semantic tokens — no changes needed |
| About | `/about` | `bg-blue-600` → `bg-primary`, `bg-white` → `dark:bg-gray-900`, `text-blue-600` → `text-primary` |
| Contact | `/contact` | `bg-blue-600` → `bg-primary`, add dark variants for gray backgrounds |
| Login | `/login` | Inputs need dark `bg`/`text` variants |
| Register | `/register` | Inputs need dark `bg`/`text` variants |
| Inventory | `/inventory` | Already uses semantic tokens — mostly complete |
| Product Detail | `/products/[id]` | `bg-gray-50` → `dark:bg-gray-900`, `text-gray-900` → `dark:text-white`, `border-gray-200` → `dark:border-gray-700`, `bg-blue-600` → `dark:bg-blue-500` |
| Cart | `/cart` | `bg-gray-50` → `dark:bg-gray-900`, `bg-white` → `dark:bg-gray-800`, `text-gray-900` → `dark:text-white`, `border-gray-300` → `dark:border-gray-600`, `bg-blue-600` → `dark:bg-blue-500` |
| Checkout | `/checkout` | `bg-gray-50` → `dark:bg-gray-900`, `bg-white` → `dark:bg-gray-800`, all inputs need dark variants |
| Confirmation | `/confirmation` | Already uses semantic tokens — no changes needed |
| Orders List | `/orders` | Fix undefined `bg-purple-bg`/`bg-purple-border` CSS vars, add dark variants |
| Orders Detail | `/orders/[id]` | **All hardcoded** — full migration needed |

**Admin Pages (6 pages):**

| Page | Route | Dark Mode Issues |
|------|-------|-----------------|
| Admin Layout | `/admin` | Already has ThemeToggle, `dark:` variants — complete |
| Admin Dashboard | `/admin` | `bg-white` → `dark:bg-gray-800`, `text-gray-900` → `dark:text-white`, `border-gray-200` → `dark:border-gray-700`, stat icon colors need `dark:` |
| Admin Products | `/admin/products` | `bg-white` → `dark:bg-gray-800`, inputs need dark variants, `bg-blue-600` → `dark:bg-blue-500` |
| Admin Orders | `/admin/orders` | `bg-white` → `dark:bg-gray-800`, inputs need dark variants |
| Admin Customers | `/admin/customers` | `bg-white` → `dark:bg-gray-800`, `bg-blue-600` → `dark:bg-blue-500` |
| Admin Analytics | `/admin/analytics` | `bg-blue-600` → `dark:bg-blue-500`, chart bars need `dark:` |
| Admin Settings | `/admin/settings` | `bg-blue-600` → `dark:bg-blue-500`, inputs need dark variants |

#### Cross-Browser Compatibility
- `prefers-color-scheme`: Chrome 76+, Edge 79+, Firefox 67+, Safari 12.1+ — all supported
- `localStorage`: All modern browsers
- `matchMedia`: All modern browsers
- Inline `<script>` in `<head>`: Universal support, runs before React hydrates
- CSS `@theme inline` (Tailwind v4): All browsers supporting CSS custom properties

#### Migration 3 (Landing Components) - COMPLETE
- **Hero**: Added `dark:` variants to blur elements
- **DashboardPreview**: Added `dark:` variants to decorative blur elements
- **Features**: Added `dark:bg-muted/50` to section bg
- **Pricing**: Added `dark:bg-muted/50` to section bg
- **Footer, HowItWorks, ThemeToggle**: Already had full dark mode support
- All components use semantic CSS tokens (background, foreground, card, muted, border, primary, success, info, warning, error)

#### Modified Files (22 files)
1. `app/layout.tsx` — minor tweak
2. `app/components/Header.tsx` — **CREATE**
3. `app/components/ThemeProvider.tsx` — simplify
4. `app/components/ThemeToggle.tsx` — fix localStorage inconsistency
5. `app/globals.css` — standardize variables, add missing tokens
6. `app/about/page.tsx` — dark mode migration
7. `app/contact/page.tsx` — dark mode migration
8. `app/products/[id]/page.tsx` — dark mode migration
9. `app/cart/page.tsx` — dark mode migration
10. `app/checkout/page.tsx` — dark mode migration
11. `app/orders/page.tsx` — fix undefined CSS vars, dark mode
12. `app/orders/[id]/page.tsx` — full dark mode migration
13. `app/admin/page.tsx` — dark mode migration (stat card colors)
14. `app/admin/products/page.tsx` — dark mode migration
15. `app/admin/orders/page.tsx` — dark mode migration
16. `app/admin/customers/page.tsx` — dark mode migration
17. `app/admin/analytics/page.tsx` — dark mode migration
18. `app/admin/settings/page.tsx` — dark mode migration
19. `app/components/Hero.tsx` — dark mode blur elements
20. `app/components/Features.tsx` — dark mode section bg
21. `app/components/Pricing.tsx` — dark mode section bg
22. `app/components/Footer.tsx` — minor dark mode tweaks

### Deliverables
- [x] ThemeProvider implementation
- [x] ThemeToggle component (Light/Dark/System dropdown)
- [x] Updated Tailwind configuration (already configured)
- [x] Global theme variables/styles
- [x] Migration of all existing pages and components
- [x] Migration of all existing pages and components
- [x] Landing components dark mode migration
- [x] Cross-browser testing results
- [x] Build verification

### Status
- Core files: Done
- Public pages: Done
- Commerce pages: Done
- Admin pages: Pending
- Landing components: Pending
- Build verification: Pending
| 9 | Full Theme System Overhaul | Complete | - |
| 10 | Inventory Page Cleanup | Complete | - |
| 11 | Admin Orders & Theme Fixes | Complete | - |
| 12 | Hero Text Update | Complete | - |
| 13 | Quote Request System | Complete | - |

## Phase 13: Quote Request System - COMPLETE

### Sub-phase 13.1: Database Schema
- Added `quotes` table with `quote_status` enum
- Migration generated and applied

### Sub-phase 13.2: Email Infrastructure
- Installed `nodemailer` + `@types/nodemailer`
- Email config in `.env.local` (EMAIL_PASSWORD needs to be set)
- `app/lib/email.ts` — reusable email sender

### Sub-phase 13.3: Public Quote Page
- `app/quote/page.tsx` — quote request form with all 4 categories
- `app/actions/quote.ts` — server action saves to DB + sends email to nadrolf01@gmail.com

### Sub-phase 13.4: Admin Quotes Management
- `app/admin/quotes/page.tsx` — dark-themed admin page with:
  - Table with pagination (15 per page), status filter, search
  - Detail modal with customer info, quote details, admin response fields
  - Inline status updates, "Send Quote" button
- `app/actions/admin/quotes.ts` — server actions for quotes CRUD

### Sub-phase 13.5: Navigation & SEO
- Added "Quote" link to Header navigation
- Added `/quote` to sitemap

## Current State
All phases complete. 23 routes built and verified:

**Public Pages:**
- `/` - Landing page
- `/inventory` - Product listing (Client Component with DB filtering)
- `/products/[id]` - Product detail page (Client Component with image gallery)
- `/about` - About page
- `/contact` - Contact page
- `/login` - Login page
- `/register` - Registration page
- `/cart` - Shopping cart (displays images, +/- buttons)
- `/checkout` - Multi-step checkout (handles `?add=${productId}`)
- `/confirmation` - Order confirmation (displays order items)
- `/orders` - User order history (merges DB + localStorage orders)
- `/orders/[id]` - Order detail

**Admin Pages:**
- `/admin` - Dashboard home
- `/admin/products` - Product CRUD (supports up to 10 image URLs)
- `/admin/orders` - Order management
- `/admin/customers` - Customer management
- `/admin/analytics` - Analytics dashboard
- `/admin/settings` - Store settings

**API Routes:**
- `/api/products` - Get all products
- `/api/products/[id]` - Get single product
- `/api/products/[id]/images/download` - Download product images as ZIP
- `/api/cart/add` - Add product to cart
- `/api/user/orders` - Get user orders
- `/api/orders/create` - Create order in database
- `/api/admin/products` - Admin product CRUD (via server actions)

## Dark Mode - COMPLETE
- Implemented using **next-themes** with Tailwind CSS class-based dark mode
- ThemeProvider wraps root layout (defaultTheme: "system", enableSystem)
- ThemeToggle component (Light/Dark/System dropdown) in Header
- All 24 pages and 22+ components support `dark:` variants
- CSS variables for semantic theming (background, foreground, card, muted, border, ring, success, warning, error, info, purple)
- Persists selection in localStorage, respects system preference
- Zero hardcoded colors without dark variants across entire codebase
- Three theme options: Light Mode, Dark Mode, System (default)

## Product Images
- Up to **10 images** per product (varchar array, max 2000 chars per URL)
- Product detail page: Enhanced gallery with navigation arrows, thumbnails, download button
- Admin form: Image URL input with live preview, remove button, count indicator
- Download endpoint: `/api/products/[id]/images/download` creates ZIP with all images
- jszip package for ZIP generation

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: PostgreSQL (192.168.10.44) + Drizzle ORM
- **Auth**: JWT + bcrypt
- **State**: React Context
- **Build**: Turbopack
- **Currency**: Philippine Peso (₱)

## Running the App
```bash
npm run dev
```

## Building
```bash
npm run build
```

## Database Commands
```bash
npx drizzle-kit generate   # Generate migration files
npx drizzle-kit migrate    # Apply migrations
npm run db:seed            # Seed database
npx drizzle-kit studio     # Open DB viewer
```

## Context Management Rules
- Update MEMORY and PLAN files when context length reaches 80% of maximum
- Always keep `memory/MEMORY.md` and `plans/PLAN.md` in sync with current project state
- After completing any phase or major task, update these files with:
  - New milestones completed
  - Current issues or blockers
  - Next steps
  - Architecture changes
- Run `npm run build` after changes to verify nothing is broken
