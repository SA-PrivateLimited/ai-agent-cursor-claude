# Baseline metrics

Audit of the TaskFlow application before pipeline experiments. This audit did not change application behavior.

| Item | Value |
| --- | --- |
| Commit | `30564f67622a8f23ed68ad1eb532f18c2ec1ade4` |
| Tag | `thesis-baseline-v1` |
| Branch | `main` |
| Audit date | 2026-11-01 |
| Reusable components | 18 |
| Exported components under `src/components` | 23 |
| Test files | 15 |
| Tests | 35 passed, 0 failed |
| Lint | Passed (`npm run lint`, exit 0) |
| TypeScript | Passed (`npm run typecheck`, exit 0) |
| Production build | Passed (`npm run build`, exit 0) |

## Reusable components

These 18 components are the shared inventory. Props and examples are in [COMPONENT_INVENTORY.md](COMPONENT_INVENTORY.md).

| Component | File |
| --- | --- |
| Button | `src/components/common/Button.tsx` |
| Input | `src/components/forms/Input.tsx` |
| Select | `src/components/forms/Select.tsx` |
| TextArea | `src/components/forms/TextArea.tsx` |
| SearchInput | `src/components/common/SearchInput.tsx` |
| Badge | `src/components/common/Badge.tsx` |
| Card | `src/components/common/Card.tsx` |
| Avatar | `src/components/common/Avatar.tsx` |
| ProgressBar | `src/components/common/ProgressBar.tsx` |
| DataTable | `src/components/common/DataTable.tsx` |
| Pagination | `src/components/common/Pagination.tsx` |
| PageHeader | `src/components/common/PageHeader.tsx` |
| EmptyState | `src/components/feedback/EmptyState.tsx` |
| LoadingState | `src/components/feedback/LoadingState.tsx` |
| ErrorState | `src/components/feedback/ErrorState.tsx` |
| Modal | `src/components/feedback/Modal.tsx` |
| Sidebar | `src/components/layout/Sidebar.tsx` |
| Topbar | `src/components/layout/Topbar.tsx` |

`AppShell` (`src/components/layout/AppShell.tsx`) is the route frame. `DashboardIcon`, `ProjectsIcon`, `TasksIcon`, and `TeamIcon` in `src/components/layout/icons.tsx` are used only by the sidebar. Those five exports bring the `src/components` total to 23. They are not part of the reusable inventory.

## Tests

`npm test` (`vitest run`) on the baseline commit:

```text
Test Files  15 passed (15)
Tests       35 passed (35)
```

| File | Tests |
| --- | --- |
| `src/components/common/Button.test.tsx` | 2 |
| `src/components/common/DataTable.test.tsx` | 3 |
| `src/components/feedback/Feedback.test.tsx` | 4 |
| `src/components/feedback/Modal.test.tsx` | 2 |
| `src/components/forms/Forms.test.tsx` | 4 |
| `src/components/layout/Layout.test.tsx` | 2 |
| `src/features/dashboard/DashboardPage.test.tsx` | 1 |
| `src/features/dashboard/dashboardStats.test.ts` | 1 |
| `src/features/projects/ProjectListPage.test.tsx` | 1 |
| `src/features/tasks/TaskListPage.test.tsx` | 3 |
| `src/features/tasks/TaskListPage.states.test.tsx` | 2 |
| `src/features/tasks/TaskFormPage.test.tsx` | 4 |
| `src/features/tasks/taskFilters.test.ts` | 2 |
| `src/features/tasks/taskForm.test.ts` | 2 |
| `src/utils/paginate.test.ts` | 2 |

## TypeScript, lint, and build

| Command | Result |
| --- | --- |
| `npm run lint` | Passed. ESLint reported no errors. |
| `npm run typecheck` | Passed. `tsc -p tsconfig.app.json --noEmit` and `tsc -p tsconfig.node.json --noEmit`. |
| `npm run build` | Passed. Typecheck plus Vite production build, 103 modules. |

Build output:

```text
dist/index.html                   0.88 kB │ gzip:   0.46 kB
dist/assets/index-DzKMcd7M.css   16.46 kB │ gzip:   3.79 kB
dist/assets/index-DjjO7QsT.js   392.40 kB │ gzip: 122.19 kB
```

## Architecture

TaskFlow is a single-page React application. Feature screens live under `src/features`. Shared UI lives under `src/components`. Pages load projects, tasks, and team members through Redux Toolkit thunks that call `src/services/api.ts`. That module serves a deterministic in-memory copy of `src/services/mock/data.ts`. Filters are stored in the URL. Create and edit forms keep their draft state in the component. The fixed date `2026-11-01` (`APP_TODAY`) decides which tasks are overdue.

Routes: `/`, `/projects`, `/projects/:projectId`, `/tasks`, `/tasks/new`, `/tasks/:taskId`, `/tasks/:taskId/edit`, `/team`.

The full description is in [ARCHITECTURE.md](ARCHITECTURE.md).
