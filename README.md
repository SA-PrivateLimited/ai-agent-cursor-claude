# TaskFlow

TaskFlow is a frontend project-management workspace. It is the experimental baseline for later evaluations of an agent that generates UI features from requirements and designs. This repository contains only the target application. It does not contain that agent.

The interface covers a dashboard, projects, tasks, and team members. Data is deterministic mock data behind a service boundary. Creating and editing tasks updates an in-memory store for the current browser session.

## Stack

- React 19 and TypeScript in strict mode
- Vite
- React Router
- Redux Toolkit
- CSS Modules and design tokens
- Vitest and React Testing Library

Vitest is the test runner because it uses the Vite transform pipeline. Tests are written with React Testing Library. Exact versions are locked in `package-lock.json` and listed in [docs/DEVELOPMENT_GUIDE.md](docs/DEVELOPMENT_GUIDE.md).

## Scripts

```bash
npm ci
npm run dev
npm test
npm run lint
npm run typecheck
npm run build
```

`npm run dev` serves the app at `http://localhost:5173`.

## Screens

| Route | Screen |
| --- | --- |
| `/` | Dashboard with project and task statistics |
| `/projects` | Searchable, filterable project list |
| `/projects/:projectId` | Project details, members, and tasks |
| `/tasks` | Search, filters, sorting, and pagination |
| `/tasks/new` | Create a task |
| `/tasks/:taskId` | Task details, including status and priority changes |
| `/tasks/:taskId/edit` | Edit a task |
| `/team` | Team directory with search and department filter |

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Component inventory](docs/COMPONENT_INVENTORY.md)
- [Baseline metrics](docs/BASELINE_METRICS.md)
- [Development guide](docs/DEVELOPMENT_GUIDE.md)
- [Testing guide](docs/TESTING_GUIDE.md)

## Baseline

The experimental baseline is commit `30564f67622a8f23ed68ad1eb532f18c2ec1ade4`, tag `thesis-baseline-v1`. Do not add the agent pipeline to this repository, and do not change unrelated code between experimental runs. Confirm the checkout with:

```bash
git rev-parse HEAD
git describe --tags --exact-match HEAD
```

## Out of scope

Authentication, a real backend, project creation, comments, notifications, and the agent pipeline are intentionally absent.
