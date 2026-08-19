# YouthEsportsArena

The official website and participant-management platform for **"Bridges: Anti
Discriminatory Language and Esports"**, an Erasmus+ funded project that uses
competitive gaming to promote inclusive, non-discriminatory communication
among young people across Europe.

The platform lets youth esports teams apply to join the project, get
reviewed and approved by an admin, appear publicly on the site, and organize
their own community events once approved.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [Roles & Access Control](#roles--access-control)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Security](#security)
- [Project Partners](#project-partners)
- [License](#license)

## Features

**Public site**
- Home page with project overview, featured teams, stats, and media gallery
- Browsable, searchable list of approved teams and their rosters
- Public event listings (upcoming & past) with participant counts
- Project outputs page for Erasmus+ deliverables (reports, tools, materials)

**Team accounts**
- Self-service registration that creates an auth account and a team
  application in one step
- Team dashboard (`/panel`) showing application status
  (Pending / Approved / Rejected)
- Profile & roster editing (team info, logo, member list)
- Once approved: create and manage community events, join other teams'
  events

**Admin dashboard**
- Review, approve, or reject pending team applications (with an optional
  rejection note)
- Manage approved teams and published events
- Separate, low-visibility admin login, protected independently of team
  accounts

**Notifications**
- Automatic emails on application submission, approval, and rejection via
  [Resend](https://resend.com) — falls back to a console log in development
  when no API key is configured

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router, Server Actions) |
| UI | React 19, TypeScript, Tailwind CSS v4 |
| Components | [shadcn/ui](https://ui.shadcn.com) on top of [Base UI](https://base-ui.com) primitives |
| Forms | React Hook Form + Zod |
| Backend | [Supabase](https://supabase.com) — Postgres, Auth, Storage, Row Level Security |
| Email | [Resend](https://resend.com) |

## Getting Started

### Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project (free tier is enough for
  development)

### 1. Install dependencies

```bash
npm install
```

### 2. Set up the Supabase project

This repository ships the application code only — the Postgres schema, RLS
policies, and auth trigger live in your Supabase project itself (managed via
migrations, e.g. through the Supabase CLI or dashboard). At minimum you'll
need:

- Tables: `user_profiles`, `teams`, `team_members`, `events`,
  `event_participants`, `project_outputs`
- A `user_role` enum (`TEAM`, `ADMIN`) and a `handle_new_user()` trigger on
  `auth.users` that inserts a `user_profiles` row for every new account
- Row Level Security **enabled on every table** (see
  [Database](#database) below)
- A public `media` storage bucket for team logos and event images

### 3. Configure environment variables

Copy `.env.example` to `.env` and fill in the values from your Supabase
project settings:

```bash
cp .env.example .env
```

See [Environment Variables](#environment-variables) for what each key does.

### 4. Start the development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key — safe to expose to the browser, access is governed by RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key — **server-only, bypasses RLS.** Never expose this to the client or commit it to source control |
| `RESEND_API_KEY` | If left empty, emails are printed to the console instead of being sent |
| `EMAIL_FROM` | Sender address used for outgoing emails |
| `ADMIN_NOTIFICATION_EMAIL` | Address notified about new team applications |

`.env` is git-ignored by default (`.gitignore` excludes `.env*` except
`.env.example`) — keep it that way, especially for the service role key.

## Database

The app relies on Postgres Row Level Security as its primary authorization
boundary, not just server-side role checks:

- **`teams`** — public row visible once `status = 'APPROVED'`; owners and
  admins can always see/manage their own
- **`team_members`** — readable for members of a visible team
- **`events`** — public once `status = 'PUBLISHED'`; team owners can create
  events for their own approved team; only admins can publish/delete
- **`event_participants`** — teams manage their own participation rows
- **`user_profiles`** — a user can read only their own row; role assignment
  happens exclusively through the `handle_new_user()` signup trigger and the
  service-role client, never through a client-writable policy
- **`project_outputs`** — publicly readable, admin-managed

`lib/supabase-admin.ts` exposes a service-role client that intentionally
bypasses RLS for a small set of trusted server-only operations (creating a
team's auth account, uploading media before an account exists). It is only
ever imported from `"use server"` files.

## Roles & Access Control

| Role | Can do |
|---|---|
| Visitor | Browse approved teams, published events, and project outputs |
| Team | Apply with a team, manage their own roster/profile, create & manage events once approved |
| Admin | Approve/reject teams, publish/remove events, manage all teams |

`proxy.ts` (Next.js middleware) protects `/panel/*` (requires a signed-in
`TEAM` account) and `/admin/*` (requires a signed-in `ADMIN` account),
redirecting unauthenticated or under-privileged requests before they reach
the page. Every server action additionally re-checks the caller's role
server-side — the middleware is a UX convenience, not the sole guard.

## Project Structure

```
app/                     Next.js App Router routes (pages + server-action forms)
  admin/                 Admin dashboard + admin login
  panel/                 Team dashboard
  teams/, events/        Public listing + detail pages, and creation forms
  login/, register/      Team auth pages
  api/                   Auth callback route, session lookup
components/              Shared UI components
  ui/                    shadcn/ui primitives (Base UI based)
  admin/, auth/, layout/ Feature-grouped components
lib/actions/             Server actions (team, event, media, auth)
lib/validation/          Zod schemas
lib/email/               Resend integration + console-mock fallback
lib/supabase.ts          Browser Supabase client (anon key)
lib/supabase-server.ts   Server Supabase client + getAuthUser() helper
lib/supabase-admin.ts    Service-role Supabase client (server-only)
lib/data.ts              Read-side query helpers for pages
proxy.ts                 /panel and /admin route protection (middleware)
```

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint |

## Security

- **RLS everywhere** — every table has Row Level Security enabled; the
  browser only ever holds the anon key, and every row-level permission is
  enforced in Postgres, not just in application code.
- **No client-writable role assignment** — a user's role can only ever be
  set by the `handle_new_user()` trigger (hardcoded to `TEAM`) or by the
  server-only service-role client; there is no policy or code path that lets
  a signed-in or anonymous request change a role.
- **Secrets stay server-side** — `SUPABASE_SERVICE_ROLE_KEY` is only read
  from `lib/supabase-admin.ts`, which is exclusively imported by
  `"use server"` code.
- **User-submitted content is escaped** before being interpolated into
  outgoing HTML emails.
- **Uploaded media is validated by file signature** (magic bytes), not by
  the client-supplied MIME type, before being stored.

Found a security issue? Please report it privately rather than opening a
public issue.

## Project Partners

USIT · Euro · IFALL · FAAL

This project is funded by the European Commission's Erasmus+ Programme. The
content on this website reflects the views only of the authors, and the
European Commission cannot be held responsible for any use which may be made
of the information contained herein.

## License

No open-source license is granted. This code is published for reference and
portfolio purposes as part of the Erasmus+ "Bridges" project — all rights
reserved.
