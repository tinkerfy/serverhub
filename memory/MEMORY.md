# ServerHub Project Memory

## Project Overview
**Name**: ServerHub
**Type**: Next.js e-commerce application for selling certified pre-owned server equipment
**Purpose**: Buy/sell used enterprise server hardware (Dell, HP, Lenovo, Cisco, NetApp, HPE)

## Tech Stack
- **Framework**: Next.js 16.2.7 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with @tailwindcss/postcss
- **Database**: PostgreSQL (hosted at 192.168.10.44, user: postgres, password: postgres)
- **ORM**: Drizzle ORM with Drizzle Kit for migrations
- **Auth**: JWT (jsonwebtoken) — token stored in localStorage, role-based redirects
- **Password Hashing**: bcrypt (12 salt rounds)
- **State**: React Context (CartContext, AuthContext)
- **Build Tool**: Turbopack
- **Node**: v24.16.0
- **Package Manager**: npm

## Project Structure
```
serverhub/
├── app/
│   ├── actions/
│   │   ├── admin/
│   │   │   └── dashboard.ts          # Server actions: getAdminProducts, getAdminOrders, createProduct, updateProduct, deleteProduct
│   │   └── auth/
│   │       ├── login.ts              # Server action: JWT login
│   │       └── register.ts           # Server action: JWT registration
│   ├── components/
│   │   ├── Header.tsx                # Fixed header with nav, cart icon, auth state
│   │   ├── Hero.tsx                  # Hero section with mock dashboard (Browse Inventory → /inventory)
│   │   ├── Features.tsx              # 6 feature cards
│   │   ├── HowItWorks.tsx            # 3-step process
│   │   ├── DashboardPreview.tsx      # Quality assurance mock
│   │   ├── Pricing.tsx               # Equipment grades (3 tiers)
│   │   └── Footer.tsx                # Footer with links
│   ├── context/
│   │   ├── AuthContext.tsx           # JWT auth context provider
│   │   └── CartContext.tsx           # Cart context with localStorage persistence
│   ├── data/
│   │   └── products.ts               # DB-backed product data layer (getProducts, getProductById)
│   ├── db/
│   │   ├── index.ts                  # DB connection module (pg Pool + drizzle)
│   │   ├── schema.ts                 # All 9 table definitions with enums/relations
│   │   ├── seed.ts                   # Seed script: 24 products + sample users/orders
│   │   ├── migrations/               # Drizzle migration files (generated)
│   │   └── repositories/
│   │       ├── productRepository.ts  # getAll, getById, search, CRUD
│   │       ├── userRepository.ts     # getById, getByEmail, CRUD
│   │       ├── orderRepository.ts    # getAll, getById, getByUserId, analytics
│   │       ├── cartRepository.ts     # session/user cart, merge, totals
│   │       └── reviewRepository.ts   # getByProduct, create, getById
│   ├── lib/
│   │   ├── auth.ts                   # JWT + bcrypt utilities
│   │   ├── error-boundary.tsx        # ErrorBoundary component
│   │   └── skeletons.tsx             # Reusable loading skeletons
│   ├── types/
│   │   └── index.ts                  # TS types: DB-derived + frontend
│   ├── layout.tsx                     # Root layout (ErrorBoundary + AuthProvider + CartProvider)
│   ├── page.tsx                       # Main page (landing)
│   ├── sitemap.ts                     # SEO sitemap
│   ├── globals.css                    # Global styles
│   ├── inventory/
│   │   └── page.tsx                   # Product listing with DB filtering, sorting, pagination (Client Component)
│   ├── login/
│   │   └── page.tsx                   # Login page (Suspense + role-based redirect)
│   ├── register/
│   │   └── page.tsx                   # Registration page
│   ├── cart/
│   │   └── page.tsx                   # Shopping cart page (displays images, +/- buttons)
│   ├── checkout/
│   │   └── page.tsx                   # Multi-step checkout (shipping, payment, review)
│   ├── confirmation/
│   │   └── page.tsx                   # Order confirmation page (displays order items from localStorage)
│   ├── about/
│   │   └── page.tsx                   # About page (story, stats, CTA)
│   ├── contact/
│   │   └── page.tsx                   # Contact page (form, info, FAQ)
│   ├── products/
│   │   └── [id]/
│   │       └── page.tsx               # Product detail page (image gallery, specs, Add to Cart button)
│   ├── orders/
│   │   ├── page.tsx                   # User order history page (filter by status)
│   │   └── [id]/
│   │       └── page.tsx               # Order detail page (items, totals)
│   └── admin/
│       ├── layout.tsx                 # Dark-themed sidebar layout with role protection
│       ├── page.tsx                   # Dashboard home (stats, recent orders/customers)
│       ├── products/
│       │   └── page.tsx               # Product CRUD with search, filters, modal
│       ├── orders/
│       │   └── page.tsx               # Order management with inline status updates
│       ├── customers/
│       │   └── page.tsx               # Customer listing with search/filter
│       ├── analytics/
│       │   └── page.tsx               # Revenue chart, top customers, low stock alerts
│       └── settings/
│           └── page.tsx               # Store, shipping, and tax settings
├── public/
│   └── images/
│       └── products/                  # 24 product image directories with main.jpg
├── plans/                             # Project phases and plans
├── memory/                            # Project memory and context
├── .env.local                         # DB_URL + JWT_SECRET
├── drizzle.config.ts                  # Drizzle kit config (postgresql dialect)
├── package.json                       # Dependencies and scripts
└── tsconfig.json                      # TypeScript configuration
```

## Milestones

### Phase 0: Landing Page (COMPLETE)
- Created initial Next.js project with TypeScript, Tailwind CSS
- Built 7 landing page components (removed TrustedBy section)
- Brand: ServerHub (used server equipment seller)
- All components: Header, Hero, Features, HowItWorks, DashboardPreview, Pricing, Footer
- Build verified: `npm run build` passes successfully

### Phase 0.5: Database Integration (COMPLETE)
- PostgreSQL configured at 192.168.10.44 with Drizzle ORM
- 9 database tables: users, addresses, categories, products, product_images, cart_items, orders, order_items, reviews
- Drizzle schema with enums, relations, indexes
- Drizzle Kit configured for migrations (`db:generate`, `db:migrate`, `db:push`, `db:studio`)
- Seed script: 4 categories, 24 products, 3 users, addresses, orders, reviews
- 24 product image directories created in `public/images/products/` with placeholder images
- JWT secret auto-generated in `.env.local`
- Build verified: `npm run build` passes successfully

### Phase 1: Foundation & Routing (COMPLETE)
- TypeScript types in `app/types/index.ts` (DB-derived + frontend types)
- DB-backed data layer in `app/data/products.ts` (getProducts, getProductById)
- Inventory listing page with DB filtering, sorting, pagination (`app/inventory/page.tsx`)
- About page (`app/about/page.tsx`)
- Contact page with form and FAQ (`app/contact/page.tsx`)
- Header updated with auth state, cart icon, user dropdown

### Phase 2: Inventory System (COMPLETE)
- Client-side filtering (brand, condition, price range)
- Keyword search
- Sorting (newest, price asc/desc)
- Pagination (12 items per page)
- Product cards with specs, condition badges, savings display
- Empty state handling
- Inventory page converted to Client Component with Suspense boundary
- Created `/api/products` route for fetching products from database
- Fixed `searchParams` Promise unwrapping with `use()` hook (Next.js 16 requirement)

### Phase 3: Shopping Cart & Checkout (COMPLETE)
- CartContext with localStorage persistence
- Cart page (`app/cart/page.tsx`) with quantity controls, product images
- Multi-step checkout (`app/checkout/page.tsx`): shipping → payment → review
- Order confirmation page (`app/confirmation/page.tsx`)
- Cart totals: subtotal, tax (8.5%), shipping (free over ₱5000)
- Image gallery in cart displays actual product images
- +/- quantity buttons visible and functional

### Phase 4: User Auth & Accounts (COMPLETE)
- JWT auth system with bcrypt password hashing
- AuthContext (`app/context/AuthContext.tsx`)
- Login page with Suspense (`app/login/page.tsx`)
- Registration page (`app/register/page.tsx`)
- Server actions: `loginAction`, `registerAction`
- Auth state reflected in Header (login/signup buttons or user dropdown)
- **Admin redirect**: Admin users auto-redirect to `/admin` after login
- Admin link in user dropdown (only visible for admin users)

### Phase 5: Admin Dashboard (COMPLETE)
- Admin layout with dark-themed collapsible sidebar
- Admin home dashboard (stats, recent orders/customers, quick actions)
- Product management page with CRUD modal (labels, currency ₱)
- Order management with inline status updates
- Customer management with search/filter
- Analytics dashboard with revenue chart, top customers, low stock alerts
- Settings page (store info, shipping rates, tax settings)
- Server actions for all admin data queries (`app/actions/admin/dashboard.ts`)
- Role protection (admin-only access)
- **Search fix**: Case-insensitive search using PostgreSQL ILIKE
- Modal form labels fixed (smaller text-xs font)
- Numeric fields show placeholders instead of default 0 values

### Phase 6: Polish & Production (COMPLETE)
- SEO: sitemap, metadata on all pages, OG tags, Twitter cards
- Error boundary wrapping root layout
- Loading skeletons for admin dashboard and product cards
- Admin login redirect to `/admin` for admin users
- Category fallback in admin product modal
- Build verified: `npm run build` passes (20 routes)
- Currency changed to Philippine Peso (₱) across all pages
- TrustedBy section removed from landing page

### Phase 7: Product Detail & Order Pages (COMPLETE)
- Product detail pages (`app/products/[id]/page.tsx`)
  - Client component with dynamic product fetching via `/api/products/[id]`
  - Image gallery with main image and thumbnails
  - Specs table display
  - Add to Cart button (calls CartContext.addItem)
  - Condition badges, savings display, stock status
- User order history (`app/orders/page.tsx`)
  - Fetches orders from `/api/user/orders` API route
  - Filter by status (all, pending, processing, shipped, delivered, cancelled)
  - Displays order items, totals, status badges
- Order detail page (`app/orders/[id]/page.tsx`)
  - Full order details with items, totals, status
  - Breadcrumb navigation
- Checkout page updated to handle `?add=${productId}` query parameter
  - Fetches product and adds to cart on page load
  - Saves order details to localStorage before clearing cart
- Confirmation page updated to display order items from localStorage
- Product images downloaded to `public/images/products/` directories (24 images)

### Phase 8: Dark Mode & Product Images (COMPLETE)
- **Dark Mode**: Implemented using next-themes with Tailwind CSS class-based dark mode
  - `app/components/ThemeProvider.tsx` - Wrapper for next-themes Provider
  - `app/components/ThemeToggle.tsx` - Reusable sun/moon toggle button
  - `app/layout.tsx` - Root layout wrapped with ThemeProvider (defaultTheme: "system", enableSystem)
  - `app/globals.css` - CSS variables for light/dark themes with semantic color tokens
  - All pages updated with `dark:` variants (inventory, cart, orders, login, register, about, contact, confirmation, checkout)
  - All components updated (Header, Hero, Features, Pricing, HowItWorks, DashboardPreview, Footer, TrustedBy)
  - Header moved to root layout (appears on all pages), removed from individual pages
  
- **Product Images**: Support for up to 10 images per product
  - Schema updated: `imageUrls` varchar length increased from 500 to 2000
  - API endpoint: `/api/products/[id]/images/download` - Downloads all product images as ZIP
  - Product detail page: Enhanced image gallery with navigation arrows, download button, thumbnail grid
  - Admin product form: Image URL input with live preview, remove button, count indicator (max 10)
  
- **Orders Page Fix**: Properly displays all orders for logged-in user
  - Merges database orders with localStorage fallback orders
  - Deduplicates orders by orderNumber
  - Sorts by creation date (newest first)
  - Shows localStorage orders even when not logged in

### Phase 11: Admin Orders & Theme Fixes (COMPLETE)
- Added `updateOrderStatus` server action in `app/actions/admin/dashboard.ts`
- Fixed admin orders page status dropdown — was calling non-existent `/api/admin/orders` PUT route, now uses server action
- Fixed Tailwind v4 utility class names across entire codebase — `bg-warning-bg` → `bg-warning-background`, `border-warning-border` → `border-warning-background`, etc.
- Fixed payment status in checkout — was saving `payment.paymentMethod` (e.g., `'credit_card'`) as paymentStatus, now saves `'pending'`
- Fixed "My Orders" heading visibility in dark mode — added `dark:text-white`
- Fixed orders page filter buttons — moved outside empty-state block so they remain visible when no orders match
- Fixed orders page theme — removed hardcoded `dark:bg-gray-950`, uses semantic `bg-background`
- Added "Orders" link to desktop navigation (always visible, not just when authenticated)
- Backup created: `serverhub_backup` folder at `C:\Users\nadro.DESKTOP-9T8SHMT\sandbox\serverhub_backup`

### Phase 10: Inventory Page Cleanup (COMPLETE)
- Removed creative image hover thumbnails (4-image preview strip on card hover)
- Removed ImageLightbox component (full modal with zoom, navigation arrows, thumbnail grid)
- Removed `selectedProduct` state and `onSelect` prop from ProductCard
- Restored main product image (`imageUrls[0]`) displayed in each card
- Restored clickable product cards navigating to `/products/{id}`
- Build verified: `npm run build` passes (24 routes)
- Backup created: `serverhub_backup` folder at `C:\Users\nadro.DESKTOP-9T8SHMT\sandbox\serverhub_backup`

### Phase 9: Full Theme System Overhaul - COMPLETE
### Migration 1 (Public Pages) - COMPLETE: about, contact, product detail pages migrated to semantic tokens
### Migration 2 (Commerce Pages) - COMPLETE: cart, checkout, orders, orders/[id], confirmation migrated to semantic tokens
### Migration 3 (Landing Components) - COMPLETE: Hero, Features, Pricing, Footer, DashboardPreview, HowItWorks, ThemeToggle
  - Hero: Added `dark:` variants to blur elements
  - DashboardPreview: Added `dark:` variants to decorative blur elements
  - Features: Added `dark:bg-muted/50` to section background
  - Pricing: Added `dark:bg-muted/50` to section background
  - All components already used semantic CSS tokens (background, foreground, card, muted, border, primary, success, info, warning, error)
  - Fixed AuthUser type mismatch in Header (no `name` field)
  - Fixed operator precedence in ThemeToggle (`!activeTheme === 'x'` → `activeTheme !== 'x'`)
### Final Audit - COMPLETE
  - Zero hardcoded colors without dark variants found across entire codebase
  - All CSS variables complete with light/dark values (background, foreground, primary, card, muted, border, ring, success, warning, error, info, purple)
  - All hover states have dark variants
  - Custom color utilities (bg-success-bg, bg-info-bg, etc.) properly map to CSS variables
- Build verified: `npm run build` passes (24 routes)
- **Three theme options**: Light Mode, Dark Mode, System (default for new users)
- **Persisted** via localStorage, **respects** `prefers-color-scheme`
- **ThemeToggle** in header: dropdown with Light/Dark/System options, checkmark indicator
- **FOIL prevention**: Inline `<script>` in `<head>` sets theme before React hydrates
- **CSS variables**: Semantic tokens (`--background`, `--foreground`, `--primary`, `--card`, etc.) with light/dark values
- **Tailwind v4**: `@theme inline` maps CSS variables to design tokens
- **Cross-browser**: Uses `prefers-color-scheme` (Chrome 76+, Edge 79+, Firefox 67+, Safari 12.1+), `localStorage`, `matchMedia`
- **Issues found during audit**:
  - `Header` component imported in `layout.tsx:4` but **does not exist** — will cause build failure
  - `ThemeToggle` reads `localStorage` directly instead of using `useTheme()` — inconsistent state
  - Some CSS variables undefined (`bg-purple-bg`, `bg-purple-border`, `text-purple-text`)
  - Many pages use hardcoded colors (`bg-gray-50`, `bg-blue-600`, `text-gray-900`) without dark variants
  - `orders/[id]` page has zero dark mode support
- **Migration 1 (Public Pages) - COMPLETE**: about, contact, product detail pages migrated to semantic tokens
  - `app/about/page.tsx` — `bg-blue-600` → `bg-primary`, `bg-white` → `bg-background`, `text-blue-600` → `text-primary`, `bg-gray-200` → `bg-muted`, `text-gray-900`/`text-gray-600` → `text-foreground`/`text-muted-foreground`
  - `app/contact/page.tsx` — `bg-blue-600` → `bg-primary`, inputs use `bg-background`/`text-foreground`/`border-border`, FAQ section `bg-muted dark:bg-gray-800/50`
  - `app/products/[id]/page.tsx` — `bg-gray-50` → `bg-background`, `text-gray-900` → `text-foreground`, `text-gray-600` → `text-muted-foreground`, `border-gray-200` → `border-border`, `bg-blue-600` → `bg-primary`, `bg-gray-100` → `bg-muted`, image gallery `bg-gray-200` → `bg-muted`, condition badges use semantic tokens
- **Migration 2 (Commerce Pages) - COMPLETE**: cart, checkout, orders, orders/[id], confirmation migrated to semantic tokens
  - `app/cart/page.tsx` — `bg-gray-50` → `bg-background`, `bg-white` → `bg-card`, `text-gray-900` → `text-foreground`, `text-gray-600` → `text-muted-foreground`, `border-gray-300` → `border-border`, `bg-blue-600` → `bg-primary`, `text-red-600` → `text-error`
  - `app/checkout/page.tsx` — `bg-gray-50` → `bg-background`, `bg-white` → `bg-card`, all inputs use `bg-card`/`text-foreground`/`border-border`, step indicators use semantic tokens, `bg-blue-600` → `bg-primary`
  - `app/orders/page.tsx` — `bg-background` (already good), `bg-purple-bg`/`bg-purple-border` → `bg-purple-bg`/`bg-purple-border` (now defined in CSS), status/payment badges use semantic tokens
  - `app/orders/[id]/page.tsx` — **Full migration**: `bg-gray-50` → `bg-background`/`bg-muted`, `bg-white` → `bg-card`, `text-gray-900` → `text-foreground`, `text-gray-600` → `text-muted-foreground`, `border-gray-200` → `border-border`, status/payment badges use semantic tokens
  - `app/confirmation/page.tsx` — Already used semantic tokens, no changes needed

## Known Issues
1. **Dev server port conflict**: Port 3000 was initially in use by another process. Resolved by killing the process.
2. **Windows PowerShell curl incompatibility**: `curl` command fails in PowerShell. Must use `Invoke-WebRequest` or Node.js instead.
3. **Next.js 16 + Turbopack on Windows**: Dev server sometimes shows "Ready" but doesn't respond to localhost requests. Workaround: run in separate PowerShell window.
4. **Database seeded**: Tables created and seeded with sample data (3 users, 24 products, 2 orders)

## Key Decisions
1. PostgreSQL + Drizzle ORM for data persistence (replacing mock data)
2. JWT for auth sessions (7-day expiry, stored in localStorage)
3. bcrypt for password hashing (12 salt rounds)
4. Relative paths for product images (stored in `public/images/products/`)
5. Drizzle `$inferSelect`/`$inferInsert` for DB type derivation
6. React Context for state management (CartContext, AuthContext)
7. Server actions for all write operations
8. Dynamic rendering for inventory page (database queries at request time)
9. localStorage for guest cart, DB sync on login
10. 8.5% tax rate, free shipping over ₱5000
11. Admin auto-redirect to `/admin` after login
12. PostgreSQL ILIKE for case-insensitive search
13. Error boundary wrapping root layout
14. Fallback categories in admin product modal
15. Currency: Philippine Peso (₱)
16. Client components for interactive pages (inventory, cart, checkout, product detail)
17. API routes for database queries (cannot use pg driver in browser)
18. localStorage for order persistence between checkout and confirmation
19. **next-themes** for dark mode (class-based, system preference support)
20. **jszip** for product image ZIP downloads
21. Header in root layout (appears on all pages)
22. Up to 10 product images per product

## Next Steps
1. Implement user profile page (`/profile`)
2. Add product review/rating system
3. Implement payment gateway integration
4. Add email notifications for order confirmation
5. Product image upload functionality in admin (replace URL inputs with file upload)
6. Deployment to Vercel
7. Implement real-time order tracking
8. Add product comparison feature
9. Implement wishlist functionality
10. Add product recommendations based on browsing history

## DB Schema Summary
| Table | Key Fields |
|-------|-----------|
| users | id, name, email, passwordHash, role, phone, company, createdAt, updatedAt |
| addresses | id, userId, type, fullName, phone, street, city, state, zip, country, isDefault |
| categories | id, name, slug, description |
| products | id, name, brand, model, categoryId, description, condition, status, sku, price, cost, originalPrice, stock, specs (JSONB), imageUrls |
| product_images | id, productId, url, altText, displayOrder, createdAt |
| cart_items | id, userId, sessionId, productId, quantity, createdAt |
| orders | id, userId, orderNumber, status, paymentStatus, subtotal, tax, shippingCost, total, shippingAddressId, billingAddressId, notes, createdAt, updatedAt |
| order_items | id, orderId, productId, name, price, quantity, total |
| reviews | id, productId, userId, rating, comment, status, createdAt |

## Running the App
```bash
npm run dev     # Start dev server (port 3000)
npm run build   # Build for production
npm start       # Start production server
npm run lint    # Run ESLint
npm run db:generate   # Generate Drizzle migration files
npm run db:migrate    # Apply migrations to PostgreSQL
npm run db:push       # Push schema directly (dev only)
npm run db:seed       # Seed database with sample data
npm run db:studio     # Open Drizzle Studio (DB viewer)
```

## Deployment
- Target platform: Vercel
- Build command: `next build`
- Output directory: `.next`
- Environment variables: See `.env.local`
- PostgreSQL: Hosted at 192.168.10.44 (ensure DB is accessible from deployment)

### Phase 12: Quote Request System (COMPLETE)
#### Sub-phase 12.1: Database Schema (COMPLETE)
- Added `quotes` table to `app/db/schema.ts`
- Added `quote_status` enum (pending, quoted, converted, expired)
- Migration generated and applied

#### Sub-phase 12.2: Email Infrastructure (COMPLETE)
- Installed `nodemailer` and `@types/nodemailer`
- Added email env vars to `.env.local` (EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD, EMAIL_FROM)
- Created `app/lib/email.ts` — reusable email sender utility

#### Sub-phase 12.3: Public Quote Page (COMPLETE)
- Created `app/actions/quote.ts` — server action to save quote to DB and send email notification to nadrolf01@gmail.com
- Created `app/quote/page.tsx` — public quote request page with:
  - Hero banner, form with all 4 categories (Servers, Storage, Networking, Components)
  - Budget range dropdown (5 options), specific interest field, quantity, message
  - Contact info panel, "What Happens Next" steps, trust badges
  - How It Works section, CTA to browse inventory
  - Success message with quote number on submit

#### Sub-phase 12.4: Admin Quotes Management (COMPLETE)
- Created `app/actions/admin/quotes.ts` — server actions for quotes CRUD
  - `getQuotes()` with pagination (15 per page), status filter, search
  - `getQuoteById()` for detail view
  - `updateQuoteStatus()` for status/final price/admin notes updates
  - `sendQuoteToCustomer()` — sends formatted quote email to customer + admin copy
- Created `app/admin/quotes/page.tsx` — admin quotes management page:
  - Dark-themed table with all quote requests
  - Filter by status (All, Pending, Quoted, Converted, Expired)
  - Search by name, email, quote number
  - Inline status updates
  - Detail modal with customer info, quote details, admin response fields
  - "Send Quote" button to email final quote to customer
  - Pagination controls

#### Sub-phase 12.5: Navigation & SEO (COMPLETE)
- Added "Quote" link to `Header.tsx` navLinks (between Inventory and Orders)
- Added `/quote` to `sitemap.ts` with priority 0.8

### Phase 12: Hero Text Update (COMPLETE)
- Removed "certified" from Hero component description text in `app/components/Hero.tsx:20`
- Changed "All equipment is tested, certified, and backed by warranty" to "All equipment is tested and backed by warranty"

## Context Management Rules
- Update MEMORY and PLAN files when context length reaches 80% of maximum
- Always keep `memory/MEMORY.md` and `plans/PLAN.md` in sync with current project state
- After completing any phase or major task, update these files with:
  - New milestones completed
  - Current issues or blockers
  - Next steps
  - Architecture changes
- Run `npm run build` after changes to verify nothing is broken
