# Dalmia Rajgangpur Grievance Portal

An employee-facing portal for submitting and tracking workplace grievances, with AI-assisted
priority triage, built for Dalmia Cement (Bharat) Limited's Rajgangpur Plant. Ships as a web app
and as an Android app via Capacitor. Includes a separate HR Admin portal for org-wide analytics.

## Stack

- [Vite](https://vite.dev/) + React 19 + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/), themed with Dalmia Bharat brand colors
- [Motion for React](https://motion.dev/docs/react) for animations and transitions
- React Router v7
- **PostgreSQL + [Prisma](https://www.prisma.io/)** for real, persistent data (users, grievances,
  comments, notifications, audit logs — see [Database setup](#database-setup) below)
- **JWT auth in an httpOnly cookie**, bcrypt-hashed passwords, OTP-based password reset
- Express backend (local dev), mirrored as Vercel serverless functions (`api/`) for production —
  both call the same shared handler functions
- [Capacitor](https://capacitorjs.com/) for the Android build

## Features

- **Employee registration** (Employee ID, name, company email, mobile, department, password) and
  **login** by Employee ID or email, with show/hide password, "remember me", and forgot-password
  (email → 6-digit OTP → reset)
- Role-based redirect after login: Employee → employee dashboard, Department Admin / Super Admin
  → HR Admin dashboard
- Full grievance intake form: category/sub-category (25 categories including plant-operations
  categories like Housing/Quarters, Security, Transport, Electrical, Mechanical, Civil,
  Purchase — every category includes an "Other" sub-category), incident date, persons involved,
  confidential submission, preferred resolution
- **AI priority triage**: every submitted grievance is sent to Claude, which assigns a priority
  (Low/Medium/High/Critical) with a reasoning note — employees never pick a priority themselves
- **Deterministic department routing**: each category maps to one of 13 departments (HR,
  Housing, IT, Administration, Security, Transport, Finance, Medical, Safety, Electrical,
  Mechanical, Civil, Purchase); a grievance is automatically routed there, not guessed by AI
- Status tracking (Open → In Progress → Resolved → Closed), comments thread per grievance,
  reopen if the issue persists
- Employee satisfaction rating & feedback once a grievance is marked Resolved (closes the ticket)
- In-app notification center (bell icon) for status changes, comments, and assignment
- Employee profile page with update-profile and change-password forms
- HR Admin dashboard (Department Admin / Super Admin): complaints by department, average
  resolution time overall and per department, a filterable grievance queue, and inline
  status/resolution/assignment actions on each grievance's detail page — scoped to the
  Rajgangpur Unit and to the admin's own department (Super Admin sees all departments)
- Audit log of sensitive actions (`/api/admin/audit-logs`, Super Admin only)
- Interactive API docs at `/api-docs.html` (Swagger UI, backed by `public/openapi.yaml`)

## Getting started (web)

```bash
npm install
cp .env.example .env   # then fill in DATABASE_URL and JWT_SECRET — see below
npm run db:migrate      # creates the tables in your database
npm run db:seed         # seeds departments, roles, and the grievance category taxonomy
npm run dev:all         # runs the Vite dev server + the API backend together
```

Open the printed local URL, register a new employee account, then sign in. Without an
`ANTHROPIC_API_KEY`, AI triage falls back to a simple rule-based priority so the app still works
end-to-end. Without a `RESEND_API_KEY`, password-reset OTPs are printed to the server console and
returned in the API response instead of emailed.

### Database setup

The app needs a real PostgreSQL database — there's no bundled/local one. Either of these free
managed providers takes about two minutes to set up:

1. **[Supabase](https://supabase.com/)** (or **[Neon](https://neon.tech/)**) → create a free
   project.
2. Copy the **connection string** it gives you:
   - Supabase: Project Settings → Database → Connection string → **URI** (use the "Transaction"
     pooler string for serverless/Vercel; use the direct connection for local dev).
   - Neon: Dashboard → Connection Details → copy the connection string shown.
3. Paste it into `.env` as `DATABASE_URL=postgresql://...`.
4. Generate a `JWT_SECRET` (any long random string, e.g. `openssl rand -base64 48`) and put it in
   `.env` too.
5. Run the migration and seed commands:
   ```bash
   npm run db:migrate   # applies prisma/migrations/*.sql to your database
   npm run db:seed      # inserts departments, roles (Employee/Department Admin/Super Admin),
                         # and the 25-category grievance taxonomy with sub-categories
   ```
6. (Optional) `npm run db:studio` opens Prisma Studio, a GUI for browsing/editing the tables.

To make someone a **Department Admin** or **Super Admin** (registration only ever creates
Employee accounts), update their `role` in the database — either via Prisma Studio, or with SQL:
```sql
update users set role_id = (select id from roles where name = 'Super Admin') where employee_id = 'EMP001';
```

### Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string (Supabase/Neon) |
| `JWT_SECRET` | Yes | Signs auth session tokens — keep this secret |
| `JWT_EXPIRES_IN` | No | Token lifetime, default `7d` |
| `RESEND_API_KEY` | No | Enables real emails (OTP, notifications) via [Resend](https://resend.com/) |
| `RESEND_FROM_EMAIL` | No | From-address for emails, e.g. `Dalmia Grievance Portal <onboarding@resend.dev>` |
| `APP_URL` | No | Used in email templates for links/branding, default `http://localhost:5173` |
| `ANTHROPIC_API_KEY` | No | Enables real AI priority triage via Claude |
| `ANTHROPIC_MODEL` | No | Default `claude-haiku-4-5-20251001` |
| `VITE_API_BASE_URL` | No | Only for the Android build — see [Android](#android-capacitor) below |

## API reference

The full REST API is documented with OpenAPI at `public/openapi.yaml` and browsable via Swagger
UI at `/api-docs.html` once the app is running. Endpoints, all under `/api`:

- `POST /auth/register`, `POST /auth/login`, `POST /auth/logout`, `GET/PATCH /auth/me`
- `POST /auth/change-password`, `POST /auth/forgot-password`, `POST /auth/reset-password`
- `GET /departments`, `GET /categories`
- `GET/POST /grievances`, `GET/PATCH /grievances/:id`
- `POST /grievances/:id/comments`, `POST /grievances/:id/satisfaction`, `POST /grievances/:id/reopen`
- `GET /notifications`, `PATCH /notifications/:id`, `POST /notifications/read-all`
- `GET /admin/audit-logs` (Super Admin only)
- `POST /prioritize`, `POST /prioritize-batch` (AI triage)

## Scripts

- `npm run dev` — Vite dev server only
- `npm run dev:server` — API backend only
- `npm run dev:all` — both, together (recommended for local dev)
- `npm run build` — type-check and build the web app for production
- `npm run lint` — run oxlint
- `npm run preview` — preview the production web build locally
- `npm run db:migrate` — apply migrations to your database (local dev)
- `npm run db:deploy` — apply migrations in production (no prompts, used by Vercel)
- `npm run db:seed` — seed departments, roles, and the grievance taxonomy
- `npm run db:studio` — open Prisma Studio

## Deploying to Vercel

The frontend and the whole backend (`api/**`) deploy together as a single Vercel project — no
separate backend hosting needed. `postinstall` runs `prisma generate` automatically on every
Vercel build.

1. Push this repo to GitHub (already done if you're reading this there).
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo. Vercel auto-detects the
   Vite framework, build command (`npm run build`), and output directory (`dist`) — no config
   needed beyond that.
3. Before deploying, add these under **Settings → Environment Variables** (see
   [Environment variables](#environment-variables) above for what each does):
   - `DATABASE_URL` — required. Use your Supabase/Neon **pooled** connection string here
     (Vercel functions are short-lived, so the pooler avoids exhausting connections).
   - `JWT_SECRET` — required.
   - `ANTHROPIC_API_KEY`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `APP_URL` — optional, same
     fallback behavior as local dev if omitted.
4. Run migrations against the same database once, from your machine:
   ```bash
   DATABASE_URL="<your production connection string>" npm run db:deploy
   DATABASE_URL="<your production connection string>" npm run db:seed
   ```
5. Click **Deploy**. You'll get a `https://<project>.vercel.app` URL with the frontend and the
   `/api/*` functions both live on the same domain — the frontend's relative `fetch('/api/...')`
   calls work with no extra configuration.

Every push to the connected branch redeploys automatically.

## Android (Capacitor)

The `android/` folder is a real Android Studio project generated by Capacitor and is committed
to the repo — you don't need to regenerate it to get started.

### Open it in Android Studio

1. Install [Android Studio](https://developer.android.com/studio) (includes a compatible JDK).
2. Open Android Studio → **Open** → select the `android/` folder in this repo.
3. Let Gradle sync finish (first sync downloads dependencies and can take a few minutes).
4. Press **Run** to install on an emulator or a connected device.

### Connecting the app to the AI backend

The Android WebView has no dev proxy, so it needs a real reachable backend URL, set via
`VITE_API_BASE_URL` **at build time** before syncing web assets into the native project:

```bash
# Android emulator talking to a backend running on your own machine:
VITE_API_BASE_URL=http://10.0.2.2:3001 npm run build
npx cap sync android

# Physical device on the same Wi-Fi as your machine, replace with your LAN IP:
VITE_API_BASE_URL=http://192.168.1.23:3001 npm run build
npx cap sync android

# Or point at your deployed Vercel backend (works from anywhere, no local server needed):
VITE_API_BASE_URL=https://<your-project>.vercel.app npm run build
npx cap sync android
```

For the first two options, run `npm run dev:server` so that local address is actually listening.
`AndroidManifest.xml` currently allows cleartext (plain `http://`) traffic for the local-dev
workflow — once you point `VITE_API_BASE_URL` at your `https://` Vercel deployment, remove
`android:usesCleartextTraffic="true"` before shipping a real release build.

### After any web code change

Rebuild and re-sync so the native project picks up the new bundle:

```bash
npm run build
npx cap sync android
```
