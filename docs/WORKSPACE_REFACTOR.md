# TeamSearch workspace refactor

## Active application flow

The React entry point is `frontend/src/main.tsx`. Its routes now use a shared
workspace shell rather than separate navigation and page layouts.

| Route | Purpose |
| --- | --- |
| `/` | Public introduction and entry points |
| `/register` | Register, then continue to login/profile |
| `/login` | Sign in and return to the requested page, or the dashboard |
| `/dashboard` | Live opportunity/application/team totals and profile checklist |
| `/opportunities` | Search by text/skill and filter type/mode |
| `/opportunities/create` | Details → positions/requirements → review and publish |
| `/opportunities/:id` | Read details, select a role, submit an introduction |
| `/opportunities/:id/manage` | Owner review, story editing, extra positions, recruitment status |
| `/applications` | Track/filter applications and confirm withdrawal |
| `/teams` | Owned opportunities plus teams joined through acceptance |
| `/profile` | Identity, biography, study information, availability |
| `/profile/skills` | Catalog skills, levels, and removal |
| `/profile/portfolio` | HTTPS portfolio links with edit/delete confirmation |

The new pages are `WorkspacePages.tsx`, `RecruitmentPages.tsx`, and
`ProfileWorkspacePage.tsx`. Shared elements live in `components/workspace.tsx`,
and shared domain interfaces in `lib/models.ts`. Earlier page implementations
remain in the repository but are not mounted by the active router.

## UI behavior

- Indigo palette, light default for new visitors, persisted dark/light preference.
- Desktop sidebar and mobile bottom navigation; mobile theme and logout actions.
- Consistent headers, cards, forms, status badges, empty states, and error feedback.
- Real dashboard totals; illustrative landing content is explicitly labeled.
- Keyboard focus indicators, labeled form fields, skip navigation, live feedback,
  and existing reduced-motion rules.
- Profile completeness is guidance, not a new application eligibility gate.
- Removed the misleading demo-login hint; existing registered accounts still work.

## Backend changes

- Opportunity creation accepts optional nested `positions`, each with
  `requirements`. Prisma saves the opportunity, positions, and requirements in
  one nested write. Active skills and duplicate requirements are validated.
- `GET /opportunities/teams/me` returns owned opportunities and active memberships,
  with member display names. It requires authentication.
- Application decisions run in a transaction and lock their opportunity before
  capacity/membership checks. Terminal decisions cannot be reversed. Repeating
  the same authorized decision is idempotent. One person cannot be accepted into
  two different positions in the same team.
- Matching now respects minimum skill level. Candidate-list matching requires
  the opportunity owner and excludes unavailable profiles.
- Public discovery defaults to open opportunities and excludes elapsed deadlines.
  Draft listing requests do not expose draft opportunities.
- Registration creates the user and profile together and normalizes email case.
- Refresh tokens use deterministic SHA-256 digests and unique JWT IDs, with atomic
  consumption and family revocation on reuse. Passwords continue to use bcrypt.
- The frontend shares one pending refresh request across concurrent API failures.
  Logout calls the backend before clearing local storage.

No database migration is needed. Existing bcrypt-backed refresh sessions must
sign in again after deployment; account passwords and account data are unchanged.

## Running

Keep PostgreSQL running, then run `npm run start:dev` in `backend` and `npm run dev`
in `frontend`. Restart the backend after updating code if watch mode is not active.
The default API URL is `http://localhost:3000`; it can be overridden with
`VITE_API_URL` when building/running the frontend. Backend CORS currently allows
the normal frontend origin `http://localhost:5173`.

## Validation

Backend and frontend both pass `npm run build`.
The final focused suite contains 18 passing backend tests and 7 passing browser
tests. Desktop/mobile screenshots were inspected. Browser tests use API fixtures,
so these results do not claim a live database integration test.

Run the focused backend regression tests from `backend`:

```sh
npm test -- --config jest.config.js --runInBand opportunity.service.spec.ts application-flow.spec.ts position-flow.spec.ts session-flow.spec.ts
```

These cover scoring, minimum skill levels, application authorization and terminal
states, capacity, membership consistency, refresh rotation/reuse, and logout.
The explicit config selects between the repository's existing two Jest configs.

Run browser tests from `frontend`:

```sh
npx playwright install chromium
npm run test:ui
```

The browser config starts/reuses a frontend on port 5174. To use an already
installed Chromium binary, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to its path.
Tests use mocked API responses, not the user's database. They cover discovery,
application/withdrawal, three-step publishing, owner acceptance/team display,
mobile overflow, and API failure feedback. Screenshots are written under the
ignored `frontend/test-results` directory.

## Existing product boundaries

Email verification/reset, contact exchange, and notifications remain outside the
implemented service flow. This refactor does not present inactive controls for
those features. Reapplication after rejection/withdrawal remains disallowed by
the existing unique application constraint. Existing opportunities without roles
can be completed in the management page; new opportunities use the complete
creation wizard. Full database-backed concurrency and end-to-end integration
testing is separate from the mocked browser/unit checks above.
