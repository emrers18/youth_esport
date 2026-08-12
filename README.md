# YouthArenaEsports

The official website and participant management tool of the "Bridges: Anti
Discriminatory Language and Esports" Erasmus+ project.

## Tech Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 (custom theme via `tailwind.config.ts`)
- shadcn/ui (built on Base UI primitives)
- React Hook Form + Zod
- Supabase (Postgres + Auth + Storage)
- Resend (transactional email — mocks to the console if no API key is set)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only, bypasses RLS) |
| `RESEND_API_KEY` | If left empty, emails are printed to the console in development |
| `EMAIL_FROM` | Sender address used for outgoing emails |
| `ADMIN_NOTIFICATION_EMAIL` | Admin email address notified about new team applications |

### 3. Start the development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## Other Commands

| Command | Description |
|---|---|
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |

## End-to-End Flows

1. **Team application:** Create an account via `/register` → submit an
   application via `/teams/new` → the application is created with status
   `PENDING` and a mock email is sent to the admin → the admin
   approves/rejects it from `/admin` → once approved, the team appears
   publicly on `/teams` and can create events.
2. **Creating an event:** Only teams with status `APPROVED` can create an
   event via `/events/new`. Events are published with status `PUBLISHED`
   by default.
3. **Admin login:** Via `/admin/login`, only accounts with `role = ADMIN`
   can sign in; the separate "Admin" link in the navbar points here.

## Project Structure

```
app/                  Next.js App Router routes (pages + server-action forms)
components/           Shared UI components (shadcn/ui + project components)
components/ui/        shadcn/ui components (Base UI based)
lib/actions/          Server actions (team, event, auth)
lib/validation/       Zod schemas
lib/email/            Mock/real email service and Resend config
lib/supabase.ts        Browser Supabase client
lib/supabase-server.ts  Server Supabase client + auth helpers
lib/supabase-admin.ts   Service-role Supabase client
lib/data.ts            Query helpers for pages
proxy.ts              /panel and /admin route protection
```

## Notes

- File/media uploads go through the `ImageUpload` component, which uploads
  to Supabase Storage via `lib/actions/media-actions.ts`.
- Email sending automatically falls back to a console mock if
  `RESEND_API_KEY` is not set; the `sendTeamApplicationEmail`,
  `sendApprovalEmail`, and `sendRejectionEmail` functions in
  `lib/email/index.ts` are ready for real Resend integration.
