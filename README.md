# Embrione Team Hub

A full-stack member registration and moderation platform built for The Embrione Web Development Domain Recruitment Challenge at PES University.

## Overview

Embrione Team Hub streamlines member onboarding by allowing users to submit their profiles, administrators to review submissions, and visitors to explore the approved team directory.

## Features

- **Member Registration:** Submit personal, academic, and social profile details.
- **Live Card Preview:** Preview the member profile card while filling out the form.
- **Image Conversion:** Convert profile pictures to WebP format in the browser before uploading.
- **Admin Dashboard:** Review pending submissions and approve or reject members.
- **Team Directory:** Display approved members with domain and position filters.
- **Database Integration:** Store member information in Supabase PostgreSQL.
- **Image Storage:** Store profile pictures using Supabase Storage.
- **Responsive UI:** Support desktop and mobile screen sizes.

## Tech Stack

- Next.js
- React and TypeScript
- Supabase PostgreSQL
- Supabase Storage
- Supabase JavaScript Client
- Vercel
- Git and GitHub

## Getting Started

### Prerequisites

- Node.js and npm
- A Supabase account
- Git

### 1. Clone the repository

```bash
git clone https://github.com/AarudraRaghunathan/embrione-team-hub.git
cd embrione-team-hub
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a local environment file:

```bash
Copy-Item .env.example .env.local
```

Add your Supabase project URL, publishable key, server-side secret key, and admin configuration to `.env.local`. Generate a strong random session secret.

Use the variable names defined in `.env.example`. Never commit `.env.local` or expose server-side secrets.

### 4. Set up the database

1. Create a project in Supabase.
2. Open the Supabase SQL Editor.
3. Run the SQL script in `supabase/schema.sql`.
4. Verify that the `members` table, storage bucket, and sample profiles have been created.

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Application Routes

| Route | Description |
|---|---|
| `/` | Home page |
| `/register` | Member registration and live preview |
| `/admin` | Admin login and moderation dashboard |
| `/team` | Public team directory |

## Deployment

The application is designed for deployment on Vercel.

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Configure the required environment variables in Vercel project settings.
4. Deploy and verify the application.

## Security

- Keep `.env.local` and all server-side secrets private.
- Never expose Supabase service-role or secret keys in client-side code.
- Protect administrative operations from unauthorized access.

## Challenge

Developed as part of The Embrione Web Development Domain Recruitment Challenge, Department of Computer Science & Engineering, PES University.