# Ingata Real Estate Frontend

Next.js 15 App Router application for the Ingata Real Estate platform with TypeScript and Tailwind CSS.

**Version:** 1.0.0
**Status:** Production Deployed
**Last Updated:** October 27, 2026

---

## Overview

This is the frontend application for the Ingata Real Estate platform. It provides a responsive user interface for property browsing, search, inquiries, and user dashboards.

**Production URL:** https://ingata-real-estate.vercel.app

---

## Quick Start

### Prerequisites
- Node.js v18 or higher
- npm or yarn

### Installation

```bash
# From repository root
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

### Access
- Frontend: http://localhost:3000
- Admin Dashboard: http://localhost:3000/admin
- Staff Portal: http://localhost:3000/portal

---

## Project Structure

```
frontend/
├── app/                   # Next.js App Router pages
│   ├── admin/            # Admin dashboard pages
│   ├── portal/           # Staff portal pages (agent/PM/editor)
│   ├── properties/       # Property listing and detail pages
│   ├── services/         # Service pages
│   ├── about/            # About section pages
│   ├── contact/          # Contact page
│   ├── faqs/             # FAQ page
│   ├── legal/            # Legal pages
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Homepage
├── src/
│   ├── components/       # React components
│   │   ├── admin/       # Admin-specific components
│   │   ├── auth/        # Authentication components
│   │   ├── content/     # Content components
│   │   ├── layout/      # Layout components
│   │   ├── map/         # Map components (Leaflet)
│   │   ├── property/    # Property-specific components
│   │   ├── ui/          # Reusable UI components
│   │   └── consent/     # Cookie consent components
│   ├── context/         # React contexts (AuthContext)
│   ├── data/            # Static data (Rwanda districts)
│   ├── hooks/           # Custom React hooks
│   ├── legacy-pages/    # Legacy pages (92 files, migration in progress)
│   ├── services/        # API client (api.ts, portalApi, adminApi)
│   └── utils/           # Utility functions (analytics, metadata)
├── public/              # Static assets
├── next.config.js       # Next.js configuration
├── tailwind.config.ts   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── package.json
```

---

## Technology Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Maps:** Leaflet + OpenStreetMap (React Leaflet)
- **Icons:** Lucide React
- **State Management:** React Context API
- **API Client:** Custom fetch-based API service
- **Analytics:** Custom analytics tracking
- **Forms:** React hooks with controlled components

---

## Development

### Running the Application

```bash
# Development mode with hot reload
npm run dev

# Production build
npm run build

# Start production server
npm start
```

### Type Checking

```bash
npm run typecheck
```

### Testing

```bash
npm test
```

**Status:** ✅ Working - 32 tests passing

See `../docs/TESTING_AND_KNOWN_ISSUES.md` for test details.

---

## Environment Variables

### Required

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Production

```env
NEXT_PUBLIC_API_URL=https://ingata-backend.onrender.com/api/v1
NEXT_PUBLIC_BASE_URL=https://ingata-real-estate.vercel.app
```

**Note:** Variables must start with `NEXT_PUBLIC_` to be exposed to the browser.

---

## Routing

### App Router Structure

The application uses Next.js 15 App Router with the following structure:

```
/                          # Homepage
/admin                     # Admin login
/admin/dashboard          # Admin dashboard (protected)
/admin/*                   # Admin pages (protected)
/portal                    # Staff portal login
/portal/dashboard         # Staff dashboard (protected)
/portal/*                  # Staff pages (protected)
/properties               # Property listings
/properties/[slug]        # Property details
/property-search          # Property search page
/services/[slug]          # Service pages
/about/*                  # About section pages
/contact                  # Contact page
/faqs                     # FAQ page
/legal/*                  # Legal pages
```

### Legacy Page Migration

Currently, 92 legacy pages remain in `src/legacy-pages/`. These are gradually being migrated to the App Router structure in `app/`. Hybrid routing preserves existing URLs during migration.

**Progress:** ~15% complete (core pages migrated)

---

## Components

### Layout Components
- `SiteShell` - Main layout with header, footer, and page content
- `AdminLayout` - Admin dashboard layout
- `PropertyShell` - Property page layout

### Content Components
- `PropertySearch` - Advanced property search with filters
- `PropertyDetails` - Property detail page with map and media
- `PropertyMap` - Interactive Leaflet map
- `ImageViewer` - Image gallery viewer

### Authentication Components
- `AdminLogin` - Admin login form
- `PortalLogin` - Staff portal login form
- `ProtectedRoute` - Route protection wrapper
- `InactivityLogout` - Auto-logout with inactivity detection

### Admin Components
- `AdminDashboard` - Admin dashboard with statistics
- `PropertyForm` - Property creation/editing form
- `ArticleForm` - Article creation/editing form
- And other admin-specific components

---

## State Management

### AuthContext

The application uses React Context for authentication state:

```typescript
const { isAuthenticated, user, login, logout } = useAuth()
```

**Features:**
- JWT token management
- User session tracking
- Auto-logout after 5 minutes (with 3-minute warning)
- Role-based access control

---

## Analytics Tracking

The application includes custom analytics tracking:

### Page Views
- Automatically tracked on all public pages via `PageViewTracker` component
- UTM parameters captured
- Session ID management

### Property Views
- Tracked when users view property details
- Session duration tracking
- Property-specific analytics

### Click Events
- Tracked for phone calls, emails, WhatsApp clicks
- User interaction tracking
- Contact form submissions

**Implementation:** `src/utils/analytics.ts`

---

## Map Integration

### Leaflet Maps

The application uses Leaflet + OpenStreetMap for property locations:

**Location:** `src/components/map/PropertyMap.tsx`

**Features:**
- Interactive markers
- Address popups
- Responsive design
- No API key required (free open-source tiles)

**Security:** No API keys to expose, uses free OSM tiles

---

## Styling

### Design System

**Primary Palette:**
- Deep Navy: #0F172A
- Slate: #1E293B
- Emerald: #10B981
- Emerald Hover: #059669
- Cool Gray: #F8FAFC
- Charcoal: #334155
- White: #FFFFFF

**Tailwind Configuration:** `tailwind.config.ts`

**Responsiveness:** Mobile-first design with Tailwind responsive classes

---

## Deployment

### Vercel Deployment

The frontend is deployed on Vercel with automatic deployment on git push.

**Deployment Options:**
1. Vercel Dashboard (recommended for first time)
2. Vercel CLI
3. GitHub Integration (automatic)

**Environment Variables:** Set in Vercel project settings

See `../docs/DEPLOYMENT.md` for detailed deployment instructions.

---

## Performance Optimization

### Image Optimization
- Next.js Image component used throughout
- Automatic optimization and lazy loading
- Responsive images

### Code Splitting
- Automatic code splitting with Next.js
- Dynamic imports for heavy components
- Route-based splitting

### Caching
- Static page generation where possible
- Incremental Static Regeneration (ISR) for dynamic content

---

## Known Issues

### Medium Priority
- **Legacy Page Migration:** 92 legacy pages need migration to App Router (~15% complete)

### Recently Fixed (October 27, 2026)
- ✅ Next.js production build errors resolved
  - Fixed PropertySearch.tsx syntax error
  - Fixed import path issues
  - Fixed Link component API usage
  - Added Suspense boundaries for useSearchParams

See `../docs/TESTING_AND_KNOWN_ISSUES.md` for complete details.

---

## Documentation

See `../docs/` directory for comprehensive documentation:

- **[PROJECT_OVERVIEW.md](../docs/PROJECT_OVERVIEW.md)** - Complete project overview
- **[ARCHITECTURE.md](../docs/ARCHITECTURE.md)** - System architecture
- **[INSTALLATION_AND_SETUP.md](../docs/INSTALLATION_AND_SETUP.md)** - Setup instructions
- **[API_REFERENCE.md](../docs/API_REFERENCE.md)** - API documentation
- **[TESTING_AND_KNOWN_ISSUES.md](../docs/TESTING_AND_KNOWN_ISSUES.md)** - Testing status
- **[DEPLOYMENT.md](../docs/DEPLOYMENT.md)** - Deployment guide

---

## Development Rules

See `../agent.md` for development guidelines and rules.

**Key Principles:**
- Follow the current task only
- Inspect before changing
- Protect existing work
- Work incrementally
- No unrequested features
- UI/UX consistency
- Responsive design
- Testing before completion

---

## Routing Guidelines

### Adding New Routes

1. Create route file in `app/` directory
2. Follow App Router conventions
3. Use existing layout components
4. Implement SEO metadata
5. Test responsive behavior

### Legacy Page Migration

1. Create App Router page in `app/`
2. Move components to shared location
3. Update routing to use new page
4. Remove legacy route handler
5. Delete legacy file

---

## Browser Support

### Tested Browsers

**Desktop:**
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)

**Mobile:**
- ✅ iOS Safari (latest)
- ✅ Chrome Mobile (latest)

### Progressive Enhancement

The application uses modern JavaScript features with polyfills where needed. No IE support is provided.
