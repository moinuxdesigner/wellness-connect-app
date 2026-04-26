# Wellness Connect Design System Roadmap

> Roadmap from v1.1 to v2.0 for turning the current design-system foundation into an enterprise-grade product system.

## Current Baseline: v1.0

The current system provides a mobile-first foundation for Wellness Connect:

- Brand direction, tagline, personality, and visual language
- CSS variable token file with colors, typography, spacing, radius, and shadows
- 14 reusable React components
- A live showcase in `src/app/App.tsx`
- Documentation for tokens, components, and app screen handoff

The next releases should move the system from a useful starter kit to a governed, accessible, scalable, design-code-aligned platform.

## Enterprise Definition

The system should be considered enterprise-grade when it has:

- Stable brand, token, component, and documentation governance
- Semantic tokens instead of direct raw color usage in product components
- Complete interaction states for all components
- Accessibility coverage with keyboard, screen reader, contrast, and reduced-motion guidance
- Responsive layout primitives for mobile, tablet, and desktop
- Design/code parity between Figma, React props, variants, and documentation
- Visual regression and accessibility testing
- Versioned releases with changelogs and deprecation policy

## Roadmap Summary

| Version | Theme | Outcome |
| --- | --- | --- |
| v1.1 | Brand and foundation cleanup | Consistent brand source of truth, cleaner docs, token audit |
| v1.2 | Semantic tokens and theming | Tokens organized for product use, light theme hardened, dark mode plan |
| v1.3 | Accessibility and interaction states | Components have predictable states and WCAG-ready behavior |
| v1.4 | Layout system | Mobile, tablet, and desktop patterns become reusable primitives |
| v1.5 | Core component expansion | Missing form, navigation, feedback, and overlay components added |
| v1.6 | Wellness domain components | Appointment, expert, session, progress, and support patterns added |
| v1.7 | Documentation and governance | Usage rules, contribution model, component status, release process |
| v1.8 | Testing and quality gates | Unit, accessibility, visual, and responsive checks automated |
| v1.9 | Design-code parity | Figma/code naming, variants, props, and tokens reconciled |
| v2.0 | Enterprise release | Stable, governed system ready for multi-team product delivery |

## v1.1: Brand and Foundation Cleanup

**Goal:** Make Wellness Connect the single source of truth and clean up the generated foundation.

**Scope**

- Remove any remaining legacy naming or generated prompt artifacts.
- Normalize docs to consistently use Wellness Connect, not earlier working names.
- Fix mojibake or broken encoded symbols in docs and examples.
- Add a brand source-of-truth section: name, tagline, voice, principles, and terminology.
- Update README language so it clearly says v1.0 is a foundation, not a complete enterprise system.
- Audit current component props and token usage.

**Deliverables**

- `BRAND_GUIDELINES.md`
- Cleaned `README.md`, `DESIGN_SYSTEM_GUIDE.md`, and `COMPONENT_INVENTORY.md`
- Updated component inventory with status labels: draft, beta, stable
- Initial `CHANGELOG.md`

**Exit Criteria**

- No legacy brand references remain.
- All docs use plain, readable symbols and consistent naming.
- Every existing component has an owner, status, and maturity note.

## v1.2: Semantic Tokens and Theming

**Goal:** Create a token structure that product teams can use safely without hardcoding raw brand colors.

**Scope**

- Keep primitive tokens for raw values.
- Add semantic tokens for product usage:
  - `surface/default`
  - `surface/elevated`
  - `surface/subtle`
  - `text/primary`
  - `text/secondary`
  - `text/inverse`
  - `border/default`
  - `border/strong`
  - `action/primary/default`
  - `action/primary/hover`
  - `action/primary/pressed`
  - `status/success/bg`
  - `status/success/text`
  - `focus/ring`
- Define component-level token aliases for Button, Input, Card, Badge, Alert, Tabs, and BottomNav.
- Decide whether dark mode is supported in v2.0 or explicitly deferred.
- Add token naming rules and token usage examples.

**Deliverables**

- Refactored `src/styles/theme.css`
- `TOKENS_ARCHITECTURE.md`
- Token usage examples in `DESIGN_TOKENS_REFERENCE.md`

**Exit Criteria**

- Product components use semantic or component tokens where practical.
- Raw color usage is limited to token definitions and visual examples.
- Token names are stable enough to support Figma variables later.

## v1.3: Accessibility and Interaction States

**Goal:** Make accessibility a baseline behavior, not a claim in documentation.

**Scope**

- Define required component states:
  - default
  - hover
  - focus-visible
  - active
  - selected
  - disabled
  - loading
  - error
  - empty
- Add visible focus states to all interactive components.
- Audit keyboard operation for Button, Input, Checkbox, Toggle, SearchInput, Tabs, and BottomNav.
- Add ARIA patterns for tabs, alerts, navigation, form errors, and loading states.
- Document reduced-motion rules.
- Add contrast target notes for every semantic color pair.

**Deliverables**

- `ACCESSIBILITY_GUIDELINES.md`
- Updated components with accessible states and labels
- Accessibility checklist in component docs

**Exit Criteria**

- All current components have documented accessibility behavior.
- Keyboard navigation works for all interactive components.
- Focus is visible and consistent.

## v1.4: Responsive Layout System

**Goal:** Make screen composition predictable across mobile, tablet, and desktop.

**Scope**

- Define layout breakpoints:
  - mobile base: 375px
  - tablet: 768px
  - desktop: 1440px
- Add reusable layout primitives:
  - AppShell
  - PageHeader
  - SectionHeader
  - ContentContainer
  - ResponsiveGrid
  - Stack
  - Cluster
- Define navigation patterns:
  - mobile bottom nav
  - tablet compact nav
  - desktop sidebar plus topbar
- Document density modes for wellness consumer views vs operational/admin views.

**Deliverables**

- Layout components under `src/app/components/layout/`
- `LAYOUT_GUIDELINES.md`
- Updated app examples showing mobile, tablet, and desktop structure

**Exit Criteria**

- Screens can be assembled without ad hoc page spacing.
- Mobile and desktop navigation patterns are documented and reusable.
- Layout primitives use design tokens rather than hardcoded values.

## v1.5: Core Component Expansion

**Goal:** Fill the missing everyday product components needed for full application screens.

**Scope**

- Forms:
  - RadioGroup
  - Select
  - Textarea
  - PasswordInput
  - PhoneInput
  - OTPInput wrapper
- Overlays:
  - Dialog
  - Sheet
  - Popover
  - Tooltip
- Feedback:
  - Toast
  - EmptyState
  - Skeleton
  - Spinner
- Navigation:
  - Sidebar
  - Topbar
  - Breadcrumb
  - Stepper
- Data:
  - Table
  - DataList
  - Pagination

**Deliverables**

- New component files with exported props
- Component examples in showcase
- Updated `COMPONENT_INVENTORY.md`

**Exit Criteria**

- Components cover common public, member, provider, and admin workflows.
- Each new component has props, states, usage examples, and accessibility notes.

## v1.6: Wellness Domain Components

**Goal:** Add product-specific patterns that make Wellness Connect feel purpose-built.

**Scope**

- AppointmentCard
- SessionCard
- ExpertCard
- ProgramCard
- ProgressSummaryCard
- HabitStreakCard
- MoodSelector
- ReflectionJournalCard
- ExerciseCard
- SessionNoteCard
- SupportTicketCard
- MessagePreviewCard
- ProductCard for future store support

**Deliverables**

- Domain component library under `src/app/components/wellness/`
- Example screens for member dashboard, appointments, progress, support, and expert profile
- Content guidance for sensitive wellness language

**Exit Criteria**

- Domain components reduce repeated screen-specific UI.
- Components support counselling, training, booking, progress, and support flows.
- Copy avoids overpromising clinical or fitness outcomes.

## v1.7: Documentation and Governance

**Goal:** Make the system maintainable by multiple contributors.

**Scope**

- Add component lifecycle:
  - draft
  - beta
  - stable
  - deprecated
- Define contribution workflow.
- Define design review and code review checklists.
- Add naming conventions for files, props, tokens, and variants.
- Add changelog and release note template.
- Add deprecation policy.

**Deliverables**

- `CONTRIBUTING.md`
- `GOVERNANCE.md`
- `CHANGELOG.md`
- Component status table
- Pull request checklist

**Exit Criteria**

- New components can be proposed, reviewed, and released consistently.
- Breaking changes have a documented approval and migration path.

## v1.8: Testing and Quality Gates

**Goal:** Make quality measurable and repeatable.

**Scope**

- Add unit tests for component behavior.
- Add accessibility checks with axe.
- Add visual regression checks for key components and states.
- Add responsive screenshot checks for mobile, tablet, and desktop.
- Add lint, typecheck, and build scripts.
- Add CI workflow for pull requests.

**Deliverables**

- Test setup and scripts
- Storybook or equivalent component gallery
- CI workflow
- Baseline visual snapshots

**Exit Criteria**

- Pull requests cannot merge with type, lint, accessibility, or visual failures.
- Core components have regression coverage for main states.

## v1.9: Design-Code Parity

**Goal:** Align Figma, tokens, docs, and React implementation.

**Scope**

- Normalize component names between Figma and code.
- Match Figma variants to React props.
- Map tokens to Figma variables.
- Create component spec pages:
  - anatomy
  - variants
  - states
  - props
  - accessibility
  - usage examples
- Add Code Connect mappings if Figma component library is created.

**Deliverables**

- Figma component audit
- Token mapping table
- Component parity table
- Optional Code Connect files

**Exit Criteria**

- Designers and engineers use the same component names and variant language.
- Each stable component has a documented design-code mapping.

## v2.0: Enterprise Release

**Goal:** Release the first enterprise-grade Wellness Connect design system.

**Scope**

- Freeze stable token names.
- Freeze stable component APIs.
- Publish v2.0 documentation.
- Provide migration notes from v1.x.
- Confirm accessibility and visual regression baseline.
- Confirm responsive app shell and domain components.

**Deliverables**

- v2.0 release notes
- Final component inventory
- Stable token reference
- Governance and contribution docs
- Quality dashboard or release checklist

**Exit Criteria**

- System supports public, member, provider, support, and admin workflows.
- Design and code artifacts are aligned.
- Quality gates pass.
- Teams can build new screens without creating one-off visual patterns.

## Priority Backlog

### Immediate

- Clean docs and brand artifacts.
- Add semantic token architecture.
- Add focus-visible and ARIA improvements to current components.
- Add missing overlay and form primitives.

### Next

- Add layout primitives and responsive app shell.
- Build appointment, session, expert, and progress domain components.
- Add Storybook or a component gallery with states.

### Later

- Add visual regression testing.
- Add Figma variable mapping.
- Add Code Connect mappings.
- Add dark mode if product needs it.

## Release Checklist

Use this checklist before any tagged release:

- Brand naming is consistent.
- Token names and values are documented.
- Component inventory is current.
- Component states are documented.
- Accessibility notes are present.
- Examples are responsive.
- TypeScript passes.
- Build passes.
- Visual examples match documented behavior.
- Changelog includes migration notes.

