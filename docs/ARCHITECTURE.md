# Architecture

TaskFlow is a single-page React application. Features own their screens and domain helpers. Shared UI lives in `src/components`. Server-shaped access lives in `src/services`. Global state lives in Redux Toolkit slices.

## Directory map

```text
src/
  app/            App shell, router, store setup, providers
  components/     Reusable design-system and layout components
    common/
    forms/
    feedback/
    layout/
  features/       Dashboard, projects, tasks, and team
  hooks/          Document title and workspace loading
  services/       Mock API and seed data
    mock/
  store/slices/   Redux slices
  types/          Domain models
  utils/          Formatting, pagination, labels, query helpers
  styles/         Tokens, global CSS, shared layout classes
  test-utils/     Vitest setup and render helper
```

Each feature keeps its page, styles, and pure helpers together. Tests sit next to the code they cover.

## Runtime flow

`src/main.tsx` mounts `App`. `App` wraps the router in the Redux provider. The router renders `AppShell` for every known route. `AppShell` provides the sidebar, top bar, and an outlet for the page.

Pages call `useWorkspaceData()`. That hook loads projects, tasks, and team members once per session, when each slice is still `idle`. Pages then derive search, filters, and sort from the URL or from local form state. They do not import seed arrays.

```text
Page -> Redux thunk -> services/api.ts -> in-memory seed
Page <- Redux state <- thunk result
```

## State

| Slice | Responsibility |
| --- | --- |
| `projects` | Project list, load status, load error |
| `tasks` | Task list, load status, create/update status |
| `team` | Team members, load status, load error |
| `ui` | Mobile sidebar open state |

Form input, modal open state, and the top-bar search box stay in component state. Task and project filters are URL search params so a view can be reloaded.

Task updates are optimistic. If `updateTask` fails, the slice restores the previous task. New tasks are appended when `createTask` succeeds.

## Data

`src/services/mock/data.ts` holds the deterministic seed: 5 projects, 8 people, and 18 tasks. `src/services/api.ts` clones that seed and applies task mutations in memory. `resetData()` restores the seed and is used by tests.

Overdue calculations and timestamps for saved tasks use `APP_TODAY` (`2026-11-01`) from `src/utils/constants.ts`. The UI does not call `Date.now()` for those decisions.

There is no network API and no persistence after refresh, except that the in-memory service lives until the page reloads.

## Routing

Routes are declared in `src/app/router.tsx`. Path helpers live in `src/app/routes.ts`. Unknown paths inside the shell render `NotFoundPage`.

## Styling

Visual values come from custom properties in `src/styles/tokens.css`: color, type, spacing, radius, shadow, layout sizes, and documented breakpoints. Components use CSS Modules and those variables. Breakpoint numbers in media queries match `--bp-md` (768px) because media queries cannot read custom properties. The comment above each media query points back to the token.

## What is intentionally absent

The agent pipeline, authentication, project creation, comments, attachments, and a backend are not part of this baseline.
