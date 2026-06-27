# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

WellnessConnect is a mobile-first wellness platform with two independently-run halves living in one repo:

- **Frontend** (repo root): React 18 + Vite + TypeScript SPA, also packaged as an Android app via Capacitor and as a PWA.
- **Backend** (`backend/`): Laravel 13 (PHP 8.3) API using Laravel Sanctum for token auth, MariaDB, run via Docker Compose.

The frontend can run fully standalone against an in-memory "demo mode" with no backend at all (see Demo mode below), which is the default when no API is reachable.

## Commands

### Frontend (run from repo root)
```
npm run dev          # Vite dev server on port 6026, proxies /api -> http://localhost:8080
npm run build        # production web build
npm run build:cap    # build for Capacitor (relative asset URLs)
npm run cap:sync     # build:cap + capacitor sync android
npm run cap:open     # open Android project in Android Studio
npm run android      # cap:sync + cap:open
```
There is no configured lint or test script for the frontend.

### Backend (run from `backend/`)
```
composer install
composer run dev     # concurrently runs: php artisan serve, queue:listen, pail (logs), npm run dev (Vite for Laravel-built assets)
composer test        # config:clear then php artisan test
php artisan test --filter=TestClassName::test_method   # run a single test
php artisan migrate
php artisan db:seed
```

### Backend via Docker (run from repo root)
```
cp .env.docker.example .env
docker compose up -d --build
docker compose exec app php artisan migrate --force
docker compose exec app php artisan db:seed --force
```
Services: Laravel app+nginx on `http://localhost:8080`, phpMyAdmin on `http://localhost:8081`, MariaDB host port `3307`.

Seeded credentials: `admin@wellnessconnect.local` / `Admin@12345`, `client@wellnessconnect.local` / `Client@12345`, `counsellor@wellnessconnect.local` / `Counsellor@12345` (all password `*@12345`).

## Frontend architecture

### Routing and roles
All routing lives in [src/app/routes/AppRoutes.tsx](src/app/routes/AppRoutes.tsx). Roles (`src/app/types/index.ts`) are: `client`, `counsellor`, `trainer`, `coach`, `helpdesk`, `admin`, `finance`, `legal`, `content`. Each role gets its own URL namespace (`/admin`, `/client`, `/counsellor`, `/trainer`, `/coach`, `/helpdesk`, `/finance`, `/legal`, `/content`) and its own layout component.

Route guards ([src/app/features/auth/guards.tsx](src/app/features/auth/guards.tsx)):
- `RequireAuth` — validates the stored token by calling `meRequest()`; clears auth and redirects to `/login` if invalid.
- `RequireRole` — redirects to the user's home route if their role isn't in `allow`.
- `RequirePermission` / `PermissionBoundary` — gate a route or a sub-tree on the user having any of a list of permission strings (e.g. `admin.users.manage`, `client.cbt.view`). Permission strings follow `<role>.<resource>.<action>` and come back on the auth user object (`AuthUser.permissions`) from the backend's permission matrix.

Trainer routes have an extra `TrainerProtectedRoute` gate (trainer applications must be approved) and most trainer pages are lazy-loaded behind a `Suspense` skeleton.

### Auth state
Session is stored client-side in `localStorage` under `wc_auth` ([src/app/features/auth/auth.ts](src/app/features/auth/auth.ts)) and broadcast via a `wellness-connect:auth-state-changed` window event whenever it changes — components that need to react to login/logout listen for this event rather than polling.

### Demo mode
Demo mode lets the whole app run without a backend. It is enabled via `VITE_DEMO_MODE=true` or a `?demo=1` query param ([src/app/features/demo/demoMode.ts](src/app/features/demo/demoMode.ts)). The login/register flow (`src/app/features/shared/services/api.ts`) tries a real `fetch` first; if the network call itself throws (no backend reachable), it transparently falls back to an in-memory `demoAuthDirectory` and issues a `demo-token-*` session. `RequireAuth` treats any `demo-token-*` as invalid for real API-backed routes, so demo and real-auth sessions don't get mixed up. Several feature areas (e.g. appointments booking in `shared/services/demoAdapter.ts`) similarly wrap the real API call with a demo fallback that returns canned data.

### API layer
All HTTP calls go through `src/app/features/shared/services/*Api.ts` / `api.ts` modules — there is no shared fetch client/interceptor; each function builds its own `fetch` with `authHeaders(token)` and reads `API_BASE = import.meta.env.VITE_API_URL` (default `/api/v1`). When adding a new endpoint, follow the existing pattern in `api.ts`: a typed request function that reads the token via `getToken()`, throws on non-OK responses using the JSON `message` field, and returns a typed shape.

### Feature folder layout
Code is organized under `src/app/features/<area>/`, generally as `pages/` (route-level screens), feature-local components, and a co-located `*Api.ts` for that feature's backend calls. Cross-cutting UI primitives live in `src/app/components/ui/` (shadcn/Radix-based) and `src/app/components/layout/`. Design tokens live under `src/design/`.

### Vite specifics
- `@` is aliased to `src/`.
- A custom `figma-asset-resolver` Vite plugin resolves `figma:asset/...` imports to `src/assets/` — this is required for Figma-Make-imported components; don't remove it even if unused elsewhere.
- PWA is built with `vite-plugin-pwa` and is disabled automatically when building in `capacitor` mode (`vite build --mode capacitor` uses relative `base: './'` for the WebView).

## Backend architecture

Standard Laravel structure under `backend/`. Key points specific to this app:

- **Routes**: all API routes are in [backend/routes/api.php](backend/routes/api.php) under an `/api/v1` prefix, with `Api\*Controller` classes in `app/Http/Controllers/Api/`. Most routes sit behind `auth:sanctum` + `account.active` middleware; many are further gated by a `permission:<perm1>,<perm2>,...` middleware (any-of semantics), backed by `EnsurePermission` middleware and `PermissionService`.
- **Permission matrix**: permissions are role-scoped strings stored in the `role_permissions`/`permissions` tables (see migrations `2026_05_25_140000_create_permission_matrix_tables.php` and friends) and managed via `PermissionController` / admin role management. The frontend's `AuthUser.permissions` array is populated from this matrix on login/`me`.
- **Domain areas** map roughly 1:1 to controllers/services: appointments & intake (`AppointmentController`, `IntakeFlowController`, `IntakeTriageService`, `SlotBookingService`), membership billing (`MembershipPlanController`, `ClientMembershipController`, `MembershipBillingService`, `MembershipEntitlementService`, `ReceiptNumberService`, Razorpay via `RazorpayPaymentGateway` + `PaymentWebhookController`), CBT (cognitive behavioral therapy) module (`CbtController` + `Cbt*` models — plans, exercises, templates, risk events), counsellor session workspace (`CounsellorSessionController`, `CounsellorDashboardController`, guided session flow steps/phases), trainer workspace and onboarding (`TrainerWorkspaceController`, `TrainerApplicationController`, OTP-based trainer registration), workflow automation (`WorkflowConfigController`, `WorkflowCaseController`, `WorkflowConfigService`), activity logging (`ActivityLogController`, `ActivityLogService` — feeds every role's `/activity` page), and notifications (`NotificationController`, `NotificationInboxService`).
- **Business logic** lives in `app/Services/*Service.php`, not in controllers — controllers are thin and delegate to services.
- Money/credits are tracked via `CreditLedgerEntry`/`CreditAdjustment`/`EntitlementPeriod` rather than mutating balances directly.
- Tests are PHPUnit Feature tests under `backend/tests/Feature/`, one file per domain area (e.g. `PermissionMatrixTest.php`, `MembershipBillingTest.php`, `CbtModuleTest.php`) — when adding backend functionality, add/extend the matching Feature test rather than a generic one.

## Cross-cutting notes

- Permission strings must match exactly between frontend `anyOf` checks and backend `permission:` middleware lists — when adding a new gated feature, update both the permission matrix seeder/migration and the frontend route's `anyOf` array.
- `CORS_ALLOWED_ORIGINS` and `FRONTEND_URL` in `backend/.env` must include whatever origin the frontend is actually served from (localhost dev port, Capacitor's `capacitor://localhost`, or production domain).
