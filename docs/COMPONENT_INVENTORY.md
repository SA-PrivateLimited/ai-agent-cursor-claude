# Component inventory

Shared components live under `src/components`. They receive data and callbacks through props. They do not read mock data or Redux.

This inventory lists **18 reusable components**. `AppShell` is the route frame, and the four sidebar icons in `src/components/layout/icons.tsx` are not separate product components. Together those files export 23 React components. The measured count is also recorded in [BASELINE_METRICS.md](BASELINE_METRICS.md).

Class names referenced below come from the component's CSS Module. Callers pass design intent through props, not raw color values.

## Button

- File: `src/components/common/Button.tsx`
- Purpose: Action control for primary, secondary, quiet, and destructive actions.
- Props:
  - `variant?: 'primary' | 'secondary' | 'ghost' | 'danger'` — visual style. Default `primary`.
  - `size?: 'sm' | 'md'` — control height. Default `md`.
  - `isLoading?: boolean` — disables the button and shows "Please wait…".
  - `children: ReactNode` — label.
  - Other `button` attributes, including `type`, `disabled`, and `onClick`. `type` defaults to `button`.

```tsx
<Button onClick={save}>Save changes</Button>
<Button variant="secondary" size="sm">Cancel</Button>
<Button type="submit" isLoading={saving}>Create task</Button>
```

## Input

- File: `src/components/forms/Input.tsx`
- Purpose: Labeled single-line field with optional hint and error.
- Props:
  - `label: string` — visible label, wired with `htmlFor`.
  - `hint?: string` — helper text.
  - `error?: string` — validation message. Sets `aria-invalid` and `role="alert"`.
  - Other `input` attributes, including `value`, `onChange`, `type`, and `id`.

```tsx
<Input label="Title" value={title} error={errors.title} onChange={onTitle} />
<Input label="Due date" type="date" value={dueDate} onChange={onDueDate} />
```

## Select

- File: `src/components/forms/Select.tsx`
- Purpose: Labeled native select.
- Props:
  - `label: string`
  - `options: readonly { value: string; label: string }[]`
  - `hint?: string`
  - `error?: string`
  - Other `select` attributes, including `value`, `onChange`, and `disabled`.

```tsx
<Select
  label="Status"
  value={status}
  onChange={onStatus}
  options={[
    { value: '', label: 'All statuses' },
    { value: 'todo', label: 'To do' },
    { value: 'done', label: 'Done' },
  ]}
/>
```

## TextArea

- File: `src/components/forms/TextArea.tsx`
- Purpose: Labeled multiline field. Same hint and error behavior as `Input`.
- Props:
  - `label: string`
  - `hint?: string`
  - `error?: string`
  - `rows?: number` — default `4`.
  - Other `textarea` attributes.

```tsx
<TextArea label="Description" value={description} onChange={onDescription} />
```

## SearchInput

- File: `src/components/common/SearchInput.tsx`
- Purpose: Controlled search field with a clear action when the value is not empty.
- Props:
  - `value: string`
  - `onChange: (value: string) => void`
  - `label?: string` — default `Search`.
  - `placeholder?: string`
  - `id?: string`
  - `className?: string`

```tsx
<SearchInput value={query} placeholder="Title, key, or label" onChange={setQuery} />
```

## Badge

- File: `src/components/common/Badge.tsx`
- Purpose: Compact status or label chip.
- Props:
  - `children: ReactNode`
  - `tone?: 'neutral' | 'info' | 'success' | 'warning' | 'danger' | 'accent'` — default `neutral`.

```tsx
<Badge tone="warning">In review</Badge>
```

## Card

- File: `src/components/common/Card.tsx`
- Purpose: White surface for a section of content.
- Props:
  - `children: ReactNode`
  - `title?: string` — renders an `h2` when present.
  - `subtitle?: string`
  - `action?: ReactNode` — content aligned with the title, such as a button.
  - `padding?: 'none' | 'md'` — default `md`. Use `none` when a table should run to the edges.
  - `className?: string`

```tsx
<Card title="Recently updated" action={<Button variant="ghost">View all</Button>} padding="none">
  <DataTable caption="Recently updated tasks" columns={columns} rows={rows} getRowId={(row) => row.id} />
</Card>
```

## Avatar

- File: `src/components/common/Avatar.tsx`
- Purpose: Initials mark for a person. It is decorative; the adjacent text supplies the accessible name.
- Props:
  - `name: string` — tooltip text.
  - `initials: string`
  - `size?: 'sm' | 'md'` — default `md`.

```tsx
<Avatar name="Alex Morgan" initials="AM" size="sm" />
```

## ProgressBar

- File: `src/components/common/ProgressBar.tsx`
- Purpose: Horizontal progress indicator with a percentage.
- Props:
  - `value: number` — clamped to 0–100.
  - `label?: string` — accessible name. Default `Progress`.

```tsx
<ProgressBar value={25} label="Website Redesign progress" />
```

## DataTable

- File: `src/components/common/DataTable.tsx`
- Purpose: Compact table with optional controlled sorting and an empty state. The table does not sort rows itself. The parent passes already ordered rows and receives the next sort request.
- Props:
  - `columns: readonly { id: string; header: string; cell: (row: T) => ReactNode; sortable?: boolean }[]`
  - `rows: readonly T[]`
  - `getRowId: (row: T) => string`
  - `caption: string` — accessible table name.
  - `sort?: { columnId: string; direction: 'asc' | 'desc' }`
  - `onSortChange?: (sort: { columnId: string; direction: 'asc' | 'desc' }) => void`
  - `onRowClick?: (row: T) => void` — do not put buttons inside a clickable row.
  - `emptyTitle?: string`
  - `emptyDescription?: string`

```tsx
<DataTable
  caption="Tasks"
  columns={columns}
  rows={tasks}
  getRowId={(task) => task.id}
  sort={{ columnId: 'updatedAt', direction: 'desc' }}
  onSortChange={(next) => setSort(next)}
/>
```

## Pagination

- File: `src/components/common/Pagination.tsx`
- Purpose: Previous and next controls with a visible result range.
- Props:
  - `page: number` — current page, starting at 1.
  - `pageSize: number`
  - `total: number`
  - `onPageChange: (page: number) => void`

```tsx
<Pagination page={2} pageSize={8} total={18} onPageChange={setPage} />
```

## PageHeader

- File: `src/components/common/PageHeader.tsx`
- Purpose: Page title, optional description, breadcrumb, and action slot. The title is an `h1`.
- Props:
  - `title: string`
  - `description?: string`
  - `actions?: ReactNode`
  - `breadcrumbs?: { label: string; to?: string }[]` — crumbs with `to` render links.

```tsx
<PageHeader
  title="Tasks"
  description="Search, filter, and update work across every project."
  breadcrumbs={[{ label: 'Tasks', to: '/tasks' }, { label: 'WEB-101' }]}
  actions={<Button>New task</Button>}
/>
```

## EmptyState

- File: `src/components/feedback/EmptyState.tsx`
- Purpose: Explanation and optional action when a list or page has nothing to show.
- Props:
  - `title: string`
  - `description: string`
  - `action?: ReactNode`

```tsx
<EmptyState
  title="No tasks match these filters"
  description="Try a different search or clear the filters to see the full list."
  action={<Button variant="secondary">Clear filters</Button>}
/>
```

## LoadingState

- File: `src/components/feedback/LoadingState.tsx`
- Purpose: Centered progress message announced as a status.
- Props:
  - `label?: string` — default `Loading`.

```tsx
<LoadingState label="Loading tasks" />
```

## ErrorState

- File: `src/components/feedback/ErrorState.tsx`
- Purpose: Alert for a failed request, with an optional retry.
- Props:
  - `title?: string` — default `Something went wrong`.
  - `message: string`
  - `onRetry?: () => void` — renders "Try again".
  - `action?: ReactNode` — extra action beside retry.

```tsx
<ErrorState message="Unable to load tasks." onRetry={reloadTasks} />
```

## Modal

- File: `src/components/feedback/Modal.tsx`
- Purpose: Dialog rendered on `document.body`. Escape, the close button, and the backdrop call `onClose`. Focus moves into the dialog and returns to the previously focused element.
- Props:
  - `open: boolean`
  - `title: string`
  - `onClose: () => void`
  - `children: ReactNode`
  - `footer?: ReactNode`

```tsx
<Modal open={open} title="Discard changes" onClose={close} footer={<Button onClick={close}>Keep editing</Button>}>
  <p>Unsaved edits will be lost.</p>
</Modal>
```

## Sidebar

- File: `src/components/layout/Sidebar.tsx`
- Purpose: Primary navigation. It stays visible from the `md` breakpoint up and becomes a drawer below that width.
- Props:
  - `open: boolean` — drawer visibility on small screens.
  - `onNavigate: () => void` — called when a destination is chosen, so the shell can close the drawer.

```tsx
<Sidebar open={sidebarOpen} onNavigate={closeSidebar} />
```

## Topbar

- File: `src/components/layout/Topbar.tsx`
- Purpose: Menu button, task search, and the current user. Search navigates to `/tasks?q=`.
- Props:
  - `menuExpanded: boolean` — exposed as `aria-expanded` on the menu button.
  - `onMenuClick: () => void`

```tsx
<Topbar menuExpanded={sidebarOpen} onMenuClick={toggleSidebar} />
```

## Related layout

`AppShell` (`src/components/layout/AppShell.tsx`) composes `Sidebar`, `Topbar`, and the route outlet. It is the application frame, not a general-purpose component. `WorkspaceBoundary` (`src/app/WorkspaceBoundary.tsx`) switches among `LoadingState`, `ErrorState`, and the page once the requested slices have settled.
