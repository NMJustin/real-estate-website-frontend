# Frontend

The frontend is a Next.js App Router application.

From the repository root:

```sh
npm --prefix frontend install
npm run dev
npm run build
npm run start
npm --prefix frontend run typecheck
```

Add routes under `frontend/app`. Shared navigation uses Next.js links and routing APIs. Migrated screens live under `frontend/src/legacy-pages`; `frontend/src/components/routing` preserves their existing URLs while they are converted to dedicated App Router route files. Do not add a Vite entry point or a React Router dependency.

Public routes share the site header and footer. Admin routes are under `/admin`; the login page is separate from the protected admin shell.
