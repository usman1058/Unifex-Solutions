# Deployment Readiness

## Required environment variables

Copy `.env.example` into the deployment environment and set real values for:

- `DATABASE_URL`: Neon/Postgres connection string with `sslmode=require`, `connection_limit`, and `pool_timeout`.
- `ADMIN_EMAIL`: administrator login email.
- `ADMIN_PASSWORD`: long, unique administrator password. `admin123` is only the requested development fallback and must be replaced in production.
- `ADMIN_SESSION_SECRET`: long, random signing secret for the HTTP-only admin session cookie.
- `NEXT_PUBLIC_SITE_URL`: canonical HTTPS URL used by metadata, robots, and sitemap.

The app intentionally rejects missing admin credentials or session secrets in production. Development-only credential fallbacks are not used when `NODE_ENV=production`.

## Database

Run Prisma generation and schema deployment from a CI/deployment environment that can start the Prisma engine:

```bash
npm ci
npm run db:generate
npx prisma db push
```

Use migrations instead of `db push` once the schema is stable. The application keeps database-backed pages dynamic so the build does not need to connect to Neon.

## Verification

After starting the app, run:

```bash
npm run healthcheck
```

The health endpoint returns `200` only when the database responds to `SELECT 1`. The deployment should fail its readiness check when it returns `503`.

## Local Windows note

This workspace's E: drive currently returns `spawn EPERM` when Next or Prisma starts child processes during page-data collection. The app compiles successfully before that step. Run the production build in CI, a local SSD workspace, or the hosting provider's build environment before release.
