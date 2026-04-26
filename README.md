# Wellness Connect Design System

> A mobile-first design-system foundation for a premium wellness application.

![Version](https://img.shields.io/badge/version-1.2.0-blue)
![React](https://img.shields.io/badge/React-18+-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178c6)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)

## Overview

**Wellness Connect** is a design system for a wellness platform that combines counselling, personal training, appointment booking, progress tracking, and support.

Brand principles:

- Calm
- Trustworthy
- Motivating
- Professional
- Human
- Premium
- Supportive

Tagline: **Mind. Body. Better Together.**

## Current Maturity

This project is a foundation moving toward enterprise-grade maturity. It now includes brand guidance, roadmap, token architecture, accessibility guidance, layout primitives, and a growing React component library.

It is not yet a fully enterprise-grade system because automated tests, visual regression, Storybook, Figma variable mapping, and full design-code parity are still roadmap items.

## Component Library

### Core Components

- Alert
- Avatar
- Badge
- BottomNav
- Button
- Card
- Checkbox
- Input
- ListItem
- ProgressBar
- SearchInput
- StatCard
- Tabs
- Toggle

### Layout Components

- AppShell
- ContentContainer
- PageHeader
- SectionHeader
- Stack
- Cluster
- ResponsiveGrid
- Topbar
- Sidebar

## Design Tokens

Tokens are defined in `src/styles/theme.css`.

The token system has three layers:

- Primitive tokens: raw palette, spacing, radius, type, and shadow values
- Semantic tokens: product meaning such as `surface`, `text`, `border`, `action`, and `status`
- Component tokens: component-specific aliases for buttons, inputs, cards, and navigation

Prefer semantic tokens in product UI:

```tsx
<div className="bg-surface-elevated text-text-primary border border-border-default">
  <Button variant="primary">Book appointment</Button>
</div>
```

## Quick Start

```tsx
import {
  AppShell,
  Button,
  Card,
  ContentContainer,
  PageHeader,
  ResponsiveGrid,
} from './components';
```

```tsx
<AppShell>
  <PageHeader
    title="Appointments"
    description="Review upcoming counselling and training sessions."
    actions={<Button>Book session</Button>}
  />
  <ResponsiveGrid columns={3}>
    <Card variant="elevated" padding="lg">Upcoming session</Card>
    <Card variant="elevated" padding="lg">Progress summary</Card>
    <Card variant="elevated" padding="lg">Support status</Card>
  </ResponsiveGrid>
</AppShell>
```

## Project Structure

```text
src/
  app/
    components/
      layout/               Layout primitives
      ui/                   Generated Radix/shadcn primitives
      *.tsx                 Wellness Connect public components
    App.tsx                 Design-system showcase
  styles/
    theme.css               Design tokens and Tailwind theme bridge
```

The public design-system API is `src/app/components/index.ts`. Treat `src/app/components/ui/` as lower-level generated primitives unless a component is explicitly promoted into the public API.

## Documentation

| Document | Purpose |
| --- | --- |
| `BRAND_GUIDELINES.md` | Brand source of truth, voice, terminology, and content safety |
| `ROADMAP.md` | Enterprise maturity roadmap from v1.1 to v2.0 |
| `COMPONENT_INVENTORY.md` | Component list, maturity, props, and gaps |
| `DESIGN_TOKENS_REFERENCE.md` | Token quick reference |
| `TOKENS_ARCHITECTURE.md` | Primitive, semantic, and component token strategy |
| `ACCESSIBILITY_GUIDELINES.md` | Accessibility baseline and review checklist |
| `LAYOUT_GUIDELINES.md` | Responsive layout rules and primitives |
| `CHANGELOG.md` | Release notes and migration history |

## Accessibility

The system targets WCAG 2.2 AA for stable releases. Current improvements include:

- Visible focus states on interactive components
- ARIA state wiring for tabs, alerts, progress, navigation, and inputs
- Keyboard activation for clickable list rows
- Accessible labels for icon-only actions

Automated accessibility testing is still a roadmap item.

## Development Notes

Available scripts:

```bash
npm run dev
npm run build
```

This environment may not have Node or npm installed, so local command availability can vary by machine.

## Roadmap Priorities

Near-term priorities:

- Add Storybook or an equivalent component gallery
- Add unit and accessibility tests
- Expand core form, overlay, feedback, navigation, and data components
- Add Wellness Connect domain components such as AppointmentCard, ExpertCard, SessionCard, MoodSelector, and ProgressSummaryCard
- Map tokens and component variants back to Figma

## License

Created for the Wellness Connect application.

**Mind. Body. Better Together.**
