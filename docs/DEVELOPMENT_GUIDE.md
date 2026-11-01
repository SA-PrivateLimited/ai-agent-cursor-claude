# Development guide

## Requirements

- Node.js 22 or newer. This baseline was built with Node.js 24.11.1 and npm 11.6.2.
- npm.

Install from the lockfile so the tree matches the baseline:

```bash
npm ci
npm run dev
```

The dev server runs at `http://localhost:5173`.

## Scripts

| Script | Command | Purpose |
| --- | --- | --- |
| `dev` | `vite` | Local development |
| `test` | `vitest run` | One-shot test run |
| `lint` | `eslint .` | Lint TypeScript and TSX |
| `typecheck` | `tsc -p tsconfig.app.json --noEmit && tsc -p tsconfig.node.json --noEmit` | Strict typecheck |
| `build` | typecheck plus `vite build` | Production bundle in `dist/` |
| `preview` | `vite preview` | Serve the production build |

## Exact dependency versions

These are the versions resolved in `package-lock.json` for this baseline.

| Package | Version |
| --- | --- |
| react | 19.3.1 |
| react-dom | 19.3.1 |
| react-router-dom | 7.18.5 |
| @reduxjs/toolkit | 2.13.0 |
| react-redux | 9.3.1 |
| typescript | 6.0.3 |
| vite | 8.3.5 |
| @vitejs/plugin-react | 6.1.2 |
| vitest | 5.0.5 |
| jsdom | 29.1.1 |
| @testing-library/react | 16.3.3 |
| @testing-library/jest-dom | 7.0.1 |
| @testing-library/user-event | 14.6.8 |
| eslint | 10.14.0 |
| typescript-eslint | 8.72.1 |
| @eslint/js | 10.0.1 |
| eslint-plugin-react-hooks | 7.1.1 |
| eslint-plugin-react-refresh | 0.5.7 |
| globals | 17.13.0 |
| @types/react | 19.3.0 |
| @types/react-dom | 19.3.0 |
| @types/node | 26.6.6 |

## Conventions

- Keep feature code under `src/features/<feature>`.
- Put a new reusable visual control in `src/components` and document it in `docs/COMPONENT_INVENTORY.md`.
- Read and write workspace data through `src/services/api.ts` and the Redux slices. Do not import `src/services/mock/data.ts` from a component.
- Use the path alias `@/` for imports from `src`.
- Take colors, spacing, type, radius, and shadow from `src/styles/tokens.css`.
- Prefer URL search params for filters that should survive a reload. Keep draft form state local.
- New saved timestamps should use `SAVED_AT` or `APP_TODAY` so experiments stay reproducible.

## Adding a screen

1. Add a route in `src/app/router.tsx` and a helper in `src/app/routes.ts`.
2. Create the page in the matching feature folder.
3. Load shared data with `useWorkspaceData()` and gate it with `WorkspaceBoundary`.
4. Add a React Testing Library test that exercises the screen as a user would.

## Experimental baseline

The commit that adds this application is the baseline. Record it before generated-feature runs:

```bash
git rev-parse HEAD
npm ci
npm test
npm run lint
npm run typecheck
npm run build
```

Keep mock data deterministic. Avoid unrelated edits between runs. Do not add the agent pipeline to this repository.
