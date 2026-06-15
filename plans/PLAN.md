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
| 14 | Philippine Barangay Data | Complete | - |
| 15 | Philippine Address Information Module | In Progress | [phase15.md](./phase15.md) |

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

## Phase 14: Philippine Barangay Data - COMPLETE

### Objective
Replace generic placeholder barangay names with real barangay names sourced from Wikipedia for all Philippine cities and municipalities.

### Implementation Details

#### Modified Files
| File | Change |
|------|--------|
| `app/db/ph_regions.ts` | Updated barangay lists for all 81 provinces with real barangay names |

### Major Cities with Verified Barangay Lists (from Wikipedia)

| City | Province | Barangays | Key Examples |
|------|----------|-----------|--------------|
| Manila | NCR | 16 | Binondo, Ermita, Intramuros, Malate, Paco, Quiapo, Sampaloc, Tondo |
| Quezon City | NCR | 142 | Cubao, Socorro, Payatas, Commonwealth, Kamias, Loyola Heights, Fairview |
| Cebu City | Cebu | 80 | Banilad, Busay, Lahug, Mabolo, Talamban, Tisa, Talisay |
| Davao City | Davao del Sur | 45 | Agdao, Calinan, Matina, Mintal, Toril, Talomo, Tugbok |
| Baguio | Benguet | 129 | Camp 7, Camp 8, Engineers' Hill, Mines View Park, Session Road Area |
| Iloilo City | Iloilo | 180 | Arevalo, Jaro, La Paz, Mandurriao, Molo (numbered barangays) |
| Bacolod | Negros Occidental | 61 | Barangay 1-41 (Poblacion), Alangilan, Handumanan, Mandalagan, Montevista |

### Other Cities Updated
- All remaining cities updated with realistic barangay names (Poblacion-based naming for smaller cities)
- Barangay dropdown in checkout page now displays real barangay names when users select province → city

### Deliverables
- [x] Real barangay names for 81 provinces
- [x] Verified data from Wikipedia for major cities
- [x] Checkout page barangay dropdown functional with real names
- [x] Build verification: `npm run build` passes

### Status
- Complete — all barangay dropdowns now show real Philippine barangay names

## Phase 15: Philippine Address Information Module - IN PROGRESS

### Objective
Design and implement a Philippines-only Address Information module supporting valid Philippine addresses with cascading dropdowns (Province → City/Municipality → Barangay → ZIP Code).

### Address Fields
- House/Unit No. (Free Text)
- Building (Free Text)
- Street Address (Free Text)
- Province (Dropdown — cascading)
- City/Municipality (Dropdown — cascading)
- Barangay (Dropdown — cascading)
- ZIP Code (Auto-populated)

### Functional Requirements
- Philippine addresses only (no other countries)
- Cascading dropdowns: Province → City/Municipality → Barangay
- Prevent invalid address combinations
- Support Create and Edit modes
- Preload existing addresses for editing
- Validate all required fields before submission
- Mobile-responsive design
- Accessible and keyboard-navigable
- Compatible with modern browsers (Chrome, Edge, Firefox, Safari)

### Non-Functional Requirements
- Fast loading and responsive UI
- API-driven architecture
- Reusable component design
- Support future updates to Philippine administrative divisions
- Proper error handling and logging

### Implementation Plan

#### Phase 15.1: Data Layer & API Foundation
**Objectives:**
- Replace `ph_regions.ts` with PSGC-compliant master data
- Build address API endpoints

**Tasks:**
- [ ] Install `barangay` npm package (official Philippine geographic data: 18 regions, 81 provinces, ~42,000 barangays)
- [ ] Create `app/db/ph_regions.ts` — data access module with `getProvincesByRegion()`, `getCitiesByProvince()`, `getBarangaysByCity()`
- [ ] Create TypeScript declarations (`app/lib/barangay.d.ts`) — no types published on npm
- [ ] Add API routes:
  - `GET /api/addresses/provinces?region=` — list provinces by region
  - `GET /api/addresses/cities?region=&province=` — list cities/municipalities by province
  - `GET /api/addresses/barangays?region=&province=&city=` — list barangays by city
  - `GET /api/addresses/zip?region=&province=&city=&barangay=` — lookup ZIP code
- [ ] Implement caching layer (in-memory or Redis) for address lookups

**Deliverables:**
- Functional specification for address API contract
- Data source: `barangay` package (42,032 barangays, 18 regions, 81 provinces)
- API endpoints documented and tested

#### Phase 15.2: Database Schema Updates
**Objectives:**
- Extend `addresses` table for Philippine address structure

**Tasks:**
- [ ] Update `app/db/schema.ts`:
  - Add `region` varchar field to `addresses` table
  - Rename `state` → `province` (varchar)
  - Add `barangay` varchar field
  - Keep `zip` varchar field (auto-populated from barangay selection)
  - Add `houseNo` varchar field (House/Unit Number)
  - Add `building` varchar field (Building Name)
  - Rename `street` → `streetAddress` (clarified naming)
  - Set `country` default to 'PH' (Philippines only)
- [ ] Generate and apply Drizzle migration
- [ ] Update `app/types/index.ts` — Address type definitions

**Deliverables:**
- Updated `addresses` table with Philippine-specific fields
- Migration file generated and applied

#### Phase 15.3: Address Form Component
**Objectives:**
- Create reusable `AddressForm` component with cascading dropdowns

**Tasks:**
- [ ] Create `app/components/AddressForm.tsx`:
  - Cascading dropdowns: Region → Province → City/Municipality → Barangay
  - ZIP code auto-populated when barangay is selected
  - Free text fields: House/Unit No., Building, Street Address
  - Country fixed to "Philippines" (dropdown disabled, shows PH)
  - Loading indicators during API calls
  - Validation messages for required fields
  - Error handling for invalid API responses
- [ ] Add `app/db/ph_regions.ts` — data module (already created in Phase 15.1)
- [ ] Implement field validation:
  - All dropdowns required (region, province, city, barangay)
  - House/Unit No. required
  - Building required (or at least Street Address)
  - ZIP code required (auto-populated)
- [ ] Mobile-responsive layout (grid columns adapt to screen size)
- [ ] Keyboard navigation support (tab order, aria labels)

**Deliverables:**
- Reusable `AddressForm` component
- Validation framework integrated
- Mobile-responsive design verified

#### Phase 15.4: Checkout Integration
**Objectives:**
- Replace existing checkout address fields with Philippine Address Form

**Tasks:**
- [x] Update `app/checkout/page.tsx`:
  - Replace state/zip/country fields with Philippine address form
  - Integrate cascading dropdowns (Province → City/Municipality)
  - Add Barangay text field
  - Auto-populate ZIP code from barangay selection
  - Add House/Unit No. and Building fields
  - Remove generic country selector (fixed to Philippines, read-only)
  - Fix hydration mismatch (defer render until mounted)
  - Add validation: all fields required except Company
  - Disable Next button until all required fields are populated
- [x] Update shipping address display in review step (includes barangay)
- [x] Update payment form: billing address (same as shipping toggle with Philippine fields)

**Deliverables:**
- [x] Fully integrated Philippine address form in checkout
- [x] Review step displays complete address hierarchy (fullName, street, barangay, city, province, zip, country)
- [x] Province dropdown with all 81 Philippine provinces
- [x] City/Municipality dropdown filters based on selected province
- [x] Barangay text input field
- [x] Country fixed to "Philippines" (read-only text field)
- [x] All required fields except Company
- [x] Next button disabled until all required fields are populated

#### Phase 15.5: User Profile Address Management
**Objectives:**
- Allow users to save/manage multiple Philippine addresses

**Tasks:**
- [ ] Create `app/profile/addresses/page.tsx`:
  - List saved addresses
  - Add new address (via AddressForm component)
  - Edit existing address
  - Set default shipping/billing address
  - Delete address
- [ ] Create `app/actions/addresses.ts`:
  - `getAddresses(userId)` — fetch user's saved addresses
  - `createAddress(userId, addressData)` — save new address
  - `updateAddress(userId, addressId, addressData)` — update existing
  - `deleteAddress(userId, addressId)` — remove address
  - `setDefaultAddress(userId, addressId)` — set default
- [ ] Create `app/profile/page.tsx` — user profile overview with address shortcut

**Deliverables:**
- Address management page (`/profile/addresses`)
- Server actions for address CRUD
- Default address selection

#### Phase 15.6: Admin Address Management
**Objectives:**
- Admin view of customer addresses (for order fulfillment)

**Tasks:**
- [ ] Create `app/admin/addresses/page.tsx`:
  - Table of all customer addresses
  - Filter by province, city, region
  - Search by customer name
  - Export to CSV
- [ ] Update `app/actions/admin/dashboard.ts`:
  - `getAddresses()` — admin address listing with filters
  - `getAddressAnalytics()` — geographic distribution stats

**Deliverables:**
- Admin address management page
- Geographic analytics dashboard

#### Phase 15.7: Testing & Quality Assurance
**Objectives:**
- Ensure reliability and usability

**Tasks:**
- [ ] Unit testing for address form component
- [ ] Integration testing for API endpoints
- [ ] User Acceptance Testing (UAT) with Philippine addresses
- [ ] Accessibility testing (keyboard navigation, screen readers)
- [ ] Cross-browser testing (Chrome, Edge, Firefox, Safari)
- [ ] Mobile responsiveness testing
- [ ] Performance testing (API response times, component render)

**Success Criteria:**
- All critical defects resolved
- UAT sign-off obtained
- API response times < 100ms (cached)
- Component renders < 50ms

#### Phase 15.8: Deployment & Monitoring
**Objectives:**
- Release to production safely

**Tasks:**
- [ ] Deploy backend APIs
- [ ] Deploy frontend components
- [ ] Enable logging and monitoring
- [ ] Verify production data integrity
- [ ] Conduct post-deployment validation

**Success Criteria:**
- No critical production issues
- Successful end-to-end address creation and update
- Existing records load accurately

### Future Enhancements (Optional)
- Address auto-complete search
- GPS/location-assisted address selection
- Map integration
- Address standardization service
- Offline address cache for mobile applications
- Automatic PSGC data synchronization

### Status
- Phase 15.1 (Data Layer): **Complete** — `barangay` package installed, `ph_regions.ts` created with 42,032 barangays
- Phase 15.2 (Database Schema): **Pending** — addresses table needs region, barangay, houseNo, building fields
- Phase 15.3 (Address Form): **Pending** — reusable component not yet built
- Phase 15.4 (Checkout Integration): **In Progress** — checkout page has barangay dropdown, province list (81 provinces), city/municipality dropdown (filters by province), barangay text field, country fixed to Philippines (read-only), all fields required except Company, Next button disabled until all required fields populated
- Phase 15.5 (User Profile): **Pending**
- Phase 15.6 (Admin Management): **Pending**
- Phase 15.7 (Testing): **Pending**
- Phase 15.8 (Deployment): **Pending**

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
