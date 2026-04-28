# WellnessConnect Frontend Prototype

WellnessConnect is a polished React + Vite frontend prototype for a combined wellness platform covering counselling psychology, personal training, appointment booking, client progress tracking, help desk workflows, and future store integration.

This version is UI only. It uses mock data, dummy routing, and no backend, database, authentication, or API calls.

## Current Scope

- Public welcome / landing screen
- Login and signup UI simulation
- Client dashboard for counselling + training users
- Counsellor dashboard
- Gym trainer dashboard
- Help desk / assistant dashboard
- Admin dashboard
- Appointment booking flow
- Programs, progress, messages, and profile pages
- Mobile bottom navigation and desktop sidebar navigation

## Tech Stack

- React + Vite
- TypeScript-flavored TSX components
- React Router for dummy frontend routing
- CSS with WellnessConnect design tokens
- Lucide React icons
- Mock data only

## Folder Structure

```text
src/
  app/
    App.tsx                 Main routed prototype
    data/
      mockData.ts           Mock sessions, users, tickets, stats, goals
    components/             Existing reusable design-system components
  styles/
    wellnessconnect.css     Prototype UI styles and design tokens
    index.css               Global style imports
```

## Run Locally

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

Check dependencies:

```bash
npm audit
```

## Design Direction

The UI follows a calm, premium, trustworthy wellness identity:

- Primary purple / indigo CTA: `#4F46E5`
- Dark primary: `#4338CA`
- Light primary: `#E0E7FF`
- Green wellness accent: `#16A34A`
- Soft pastel backgrounds
- White cards with subtle shadows
- Rounded UI surfaces
- Clean Inter-like typography
- Mobile-first responsive layout

## Future Laravel + MariaDB Plan

When backend work begins, Laravel can expose REST or JSON API endpoints for:

- User accounts and role permissions
- Client profiles and intake preferences
- Appointment availability and booking
- Counselling session notes
- Training programs and measurements
- Progress history and goals
- Help desk tickets and follow-up tasks

MariaDB can store normalized tables for users, roles, appointments, sessions, programs, progress entries, notes, messages, and audit logs.

## Future Google Workspace Plan

Google Workspace can be added after the backend exists:

- Google Calendar for expert availability and appointment events
- Google Meet links for online counselling or training sessions
- Google Drive for secure document storage
- Google Sheets for controlled exports and reporting

OAuth, service account strategy, privacy controls, and audit logging should be designed before integration.

## Future Shopify Plan

The wellness store should initially integrate with Shopify rather than custom ecommerce. Future frontend work can link to Shopify collections, embedded buy flows, or a headless Shopify storefront for:

- Wellness products
- Fitness accessories
- Digital programs
- Supplements, if approved by business and compliance rules

Orders, payments, inventory, taxes, and fulfillment should remain in Shopify unless a later phase requires deeper custom operations.
