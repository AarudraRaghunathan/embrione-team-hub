# Embrione Team Hub — Recruitment Challenge

A full-stack, three-page member onboarding and moderation app built for The Embrione Web Development Domain Recruitment Challenge. Stack: Next.js App Router, TypeScript, Tailwind CSS v4, Supabase PostgreSQL + Storage, and Vercel.

## Features

- `/register`: validated member form, live preview, browser-side image resizing and WebP conversion, upload only on submit, duplicate SRN prevention, pending status.
- `/admin`: challenge admin credentials, signed HTTP-only session cookie, counters, pending/approved/rejected filters, approve/reject/delete actions.
- `/team`: approved members only, search, domain and position filters, responsive cards, optional LinkedIn/GitHub links.
- Six fictional, pre-approved demo members seeded by SQL.
- Server-side Supabase service-role access; the service-role key is never sent to the browser. No public database update policies are created.

## 1. Install the tools

Install these first if needed:

1. Node.js 20.9 or newer: https://nodejs.org/
2. Git: https://git-scm.com/downloads
3. A code editor such as Visual Studio Code: https://code.visualstudio.com/
4. Accounts: https://supabase.com, https://github.com, https://vercel.com

## 2. Create the Supabase project

1. Sign in to Supabase and create a new project. Save its database password somewhere private.
2. Open **SQL Editor → New query**.
3. Open `supabase/schema.sql` from this project, copy the entire file, paste it into the SQL editor, and click **Run**.
4. In **Project Settings → API** (or **Connect**), copy the project URL, the publishable/anon key, and the **service_role** key. The service-role key is secret; never place it in frontend code or GitHub.
5. Confirm the `members` table exists in **Table Editor** and `member-photos` exists in **Storage**. The SQL creates both the table and public photo bucket.

The six seeded demo profiles use fictional names and example.com emails. They are approved and appear on `/team` immediately.

## 3. Run the app locally

Open a terminal in this project folder and run:

```bash
npm install
```

Copy `.env.example` to `.env.local`:

**Windows PowerShell**

```powershell
Copy-Item .env.example .env.local
```

**macOS / Linux**

```bash
cp .env.example .env.local
```

Edit `.env.local` and replace the placeholder Supabase values:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
ADMIN_EMAIL=admin@embrione.pes.edu
ADMIN_PASSWORD=EmbrioneAdmin@2026
ADMIN_SESSION_SECRET=replace-with-a-long-random-secret-at-least-32-characters
```

Generate a random session secret with Node if you want one:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

Paste the generated value into `ADMIN_SESSION_SECRET`. Do not commit `.env.local`.

Start the development server:

```bash
npm run dev
```

Open http://localhost:3000. Use the navigation to try `/register`, `/admin`, and `/team`.

## 4. Test the required flow

1. Open `/register`. Fill every required field and choose a PNG/JPG/WebP photo.
2. Confirm the preview updates as you type. Select a photo; the browser converts it to WebP locally.
3. Submit. In Supabase, confirm a `.webp` object exists in Storage and a new row appears in `members` with `status = pending`.
4. Open `/admin`. Sign in with the exact challenge credentials from your `.env.local`.
5. Approve the new profile. Confirm the pending counter decreases and approved counter increases.
6. Open `/team`; the profile should now appear. Reject another profile and confirm it stays hidden.
7. Test a duplicate SRN; the app should show an error rather than creating a second profile.
8. Check the site at a narrow mobile width.

## 5. Push to GitHub

Create a **public** empty repository on GitHub. From the project folder:

```bash
git init
git add .
git commit -m "chore: initialize Embrione Team Hub"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

Make progressive commits as you work, for example:

```bash
git add . && git commit -m "feat: add member registration and live preview"
git add . && git commit -m "feat: convert profile images to WebP"
git add . && git commit -m "feat: add admin moderation workflow"
git add . && git commit -m "feat: add approved team directory"
```

Only commit code and safe example configuration. Never commit `.env.local`, service-role keys, passwords, or private member data.

## 6. Deploy on Vercel

1. Sign in to Vercel and click **Add New → Project**.
2. Import the GitHub repository.
3. In project **Settings → Environment Variables**, add all six values from `.env.local`: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET` (six variables total).
4. Use the required admin email and password exactly as shown in the challenge PDF.
5. Deploy. If you change environment variables later, redeploy for the changes to take effect.
6. In Vercel project settings, configure the domain/subdomain requested by the challenge. The target format is `https://yourfirstname-embrione-task.vercel.app`; availability of a chosen subdomain is subject to Vercel.
7. Test the production URL again. Local success alone does not guarantee production environment variables are correct.

## 7. Two-minute demo video outline

- **0:00–0:25** — Open `/register`, fill in a name/domain/bio, show the live preview.
- **0:25–0:45** — Choose a JPG/PNG, show that it converts to WebP, submit, and point out the pending status in Supabase if time permits.
- **0:45–1:20** — Open `/admin`, sign in, show counters, approve the new profile.
- **1:20–1:45** — Open `/team`, show the approved profile and demonstrate a filter.
- **1:45–2:00** — Show the deployed URL and public GitHub repository.

## Important implementation/security notes

- The PDF's sample SQL mentions permissive public insert/read/update/delete policies. This implementation deliberately uses server routes with the service-role key instead, with admin actions protected by a signed, HTTP-only cookie. Do not add broad public update/delete policies; doing so would let visitors manipulate moderation state.
- The universal admin password is required by the challenge, so it is a shared review credential, not suitable for a real production system. Store it only in environment variables and rotate/remove it after evaluation.
- The seeded profiles are dummy data. Replace them with permitted real profiles only if you have authorization.
- If registration fails, check the browser/server terminal, Supabase project URL, service-role key, and that the `member-photos` bucket exists.
- If the admin page returns a configuration error, check `ADMIN_SESSION_SECRET` is at least 32 characters and all admin environment variables are set in the same environment where the app is running.
