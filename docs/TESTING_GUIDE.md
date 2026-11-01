# Testing guide

Tests use Vitest, jsdom, and React Testing Library. Vitest is the runner that matches the Vite configuration. Assertions use `@testing-library/jest-dom`.

Run the suite:

```bash
npm test
```

The suite is deterministic:

- API delay is `0` when `import.meta.env.MODE` is `test`.
- Overdue dates use `APP_TODAY` (`2026-11-01`), not the machine clock.
- `resetData()` restores the seed before tests that mutate tasks.
- Each test file gets its own module instance, so in-memory tasks do not leak across files.

## What is covered

| Area | File |
| --- | --- |
| Button | `src/components/common/Button.test.tsx` |
| Input, Select, TextArea, SearchInput | `src/components/forms/Forms.test.tsx` |
| DataTable and Pagination | `src/components/common/DataTable.test.tsx` |
| Empty, loading, and error states; Badge, Card, PageHeader | `src/components/feedback/Feedback.test.tsx` |
| Modal | `src/components/feedback/Modal.test.tsx` |
| Sidebar and top-bar search | `src/components/layout/Layout.test.tsx` |
| Dashboard rendering | `src/features/dashboard/DashboardPage.test.tsx` |
| Dashboard statistics | `src/features/dashboard/dashboardStats.test.ts` |
| Project listing and project details | `src/features/projects/ProjectListPage.test.tsx` |
| Task search, filters, sort, pagination, empty state | `src/features/tasks/TaskListPage.test.tsx` |
| Task loading and error states | `src/features/tasks/TaskListPage.states.test.tsx` |
| Task create, edit, and status change | `src/features/tasks/TaskFormPage.test.tsx` |
| Filter and sort helpers | `src/features/tasks/taskFilters.test.ts` |
| Form validation | `src/features/tasks/taskForm.test.ts` |
| Pagination and date formatting | `src/utils/paginate.test.ts` |

## How to render a page

`renderWithStore` in `src/test-utils/render.tsx` creates a fresh Redux store and provider. Page tests add their own `MemoryRouter`.

```tsx
renderWithStore(
  <MemoryRouter initialEntries={['/tasks']}>
    <TaskListPage />
  </MemoryRouter>,
)

expect(await screen.findByRole('heading', { name: 'Tasks' })).toBeInTheDocument()
```

Query by role, label, and visible text. The setup file in `src/test-utils/setup.ts` loads jest-dom and unmounts the rendered tree after each test.

## Error and loading tests

`TaskListPage.states.test.tsx` mocks `@/services/api`. A pending promise keeps the loading state on screen. A rejected `getTasks()` renders the alert, and "Try again" loads the recovered result.

Do not import the real API and the mock in the same file. Put the mock in a dedicated test file so the happy-path tests keep the deterministic seed.
