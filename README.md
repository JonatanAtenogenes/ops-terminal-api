# Ops Terminal API

![CI](https://github.com/JonatanAtenogenes/ops-terminal-api/actions/workflows/ci.yml/badge.svg)

REST API that holds the core logic of [Ops Terminal](https://github.com/JonatanAtenogenes/ops-terminal), a single-user project tracker with a retro CRT terminal interface. The API owns projects, tasks, check-ins and every derived metric (progress, on-time trend, streaks, situation report), so each client only renders data.

## Clients

| Client                       | Status                       |
| ---------------------------- | ---------------------------- |
| Ops Terminal web (SvelteKit) | Migration to the API planned |
| Ops Terminal Android         | Planned                      |

## Stack

- Hono on Node.js 22, TypeScript
- Supabase (PostgreSQL)
- Zod for environment and request validation
- Vitest, tsup, pnpm
- GitHub Actions and Render

## Design decisions

- **Logic lives in the API.** Clients do not talk to Supabase directly and do not calculate streaks or metrics.
- **Instants are stored in UTC.** `created_at`, `completed_at` and `deleted_at` are `timestamptz`; clients format them in local time.
- **Calendar days follow the client's time zone.** Check-in dates and due dates are plain `date` values. Each request sends its IANA time zone (`X-Timezone: America/Mexico_City`) so "today" and streaks match the user's day.
- **Soft delete.** Projects and tasks are hidden through `deleted_at`.

## API

| Method | Path                      | Description                              | Status    |
| ------ | ------------------------- | ---------------------------------------- | --------- |
| GET    | `/health`                 | Service health check                     | Available |
| GET    | `/projects`               | List active projects                     | Planned   |
| POST   | `/projects`               | Create a project                         | Planned   |
| PATCH  | `/projects/:id/status`    | Change project status                    | Planned   |
| DELETE | `/projects/:id`           | Soft delete a project                    | Planned   |
| GET    | `/projects/:id/tasks`     | List tasks of a project                  | Planned   |
| POST   | `/projects/:id/tasks`     | Create a task                            | Planned   |
| POST   | `/tasks/:id/complete`     | Complete a task and log today's check-in | Planned   |
| DELETE | `/tasks/:id`              | Soft delete a task                       | Planned   |
| POST   | `/projects/:id/check-ins` | Log a check-in                           | Planned   |
| GET    | `/projects/:id/status`    | Progress, trend and streaks              | Planned   |
| GET    | `/report`                 | Situation report across projects         | Planned   |

## Getting started

Requirements: Node.js 22+ and pnpm.

```bash
pnpm install
cp .env.example .env   # fill in the Supabase values
pnpm dev
```

### Environment variables

| Variable              | Description                                         |
| --------------------- | --------------------------------------------------- |
| `PORT`                | Server port (default `3000`)                        |
| `SUPABASE_URL`        | Supabase project URL                                |
| `SUPABASE_SECRET_KEY` | Server-only secret key; never expose it to a client |

### Scripts

| Script           | Description                 |
| ---------------- | --------------------------- |
| `pnpm dev`       | Run with hot reload         |
| `pnpm build`     | Bundle to `dist/`           |
| `pnpm start`     | Run the built server        |
| `pnpm typecheck` | Type check without emitting |
| `pnpm test`      | Run the test suite          |

## Workflow

- `feature/*` and `chore/*` branches merge into `develop` through pull requests.
- `develop` merges into `main` for releases.
- CI runs type checking, tests and build on every push and pull request to `develop` and `main`.
- A push to `main` that passes CI triggers a deploy to Render.
