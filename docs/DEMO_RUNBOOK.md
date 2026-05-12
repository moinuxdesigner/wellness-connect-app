# MVP Demo Runbook (12-15 min)

## Setup
- Use `.env` with `VITE_DEMO_MODE=true`.
- Start frontend and login with seeded role accounts.
- Keep this route fallback ready: add `?demo=1` to any demo route.

## Suggested Walkthrough Order
1. Landing + problem framing: `/`
2. Client flow: `/client/intake?demo=1` -> `/client/appointments?demo=1` -> `/client/programs?demo=1`
3. Counsellor flow: `/counsellor/sessions?demo=1` -> `/counsellor/clients?demo=1`
4. Trainer flow: `/trainer/plans?demo=1` -> `/trainer/check-ins?demo=1`
5. Helpdesk flow: `/helpdesk/tickets?demo=1` -> `/helpdesk/knowledge-base?demo=1`
6. Admin oversight: `/admin` -> `/admin/escalations`
7. Content lifecycle: `/content/programs?demo=1` -> `/content/assets?demo=1`

## Exception Path Moments to Highlight
- Counsellor risk flag -> admin escalation.
- Trainer pain/injury flag -> handoff.
- Helpdesk SLA breach -> priority escalation.
- Content compliance hold -> legal/admin gate.

## Backup Plan
- If backend is unavailable, keep all `?demo=1` routes and continue with seeded narratives.
- If one role login fails, use admin walkthrough first, then jump to role routes directly.
