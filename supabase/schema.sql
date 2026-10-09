-- Embrione Team Hub database setup.
-- Run this entire file in Supabase Dashboard -> SQL Editor -> New query.
-- The app accesses this table through server routes using SUPABASE_SERVICE_ROLE_KEY.
-- Do not expose the service-role key in browser code or commit it to Git.

create extension if not exists pgcrypto;

create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  domain text not null,
  position text not null,
  srn text not null,
  email text not null,
  linkedin_url text,
  github_url text,
  branch text not null,
  semester integer not null check (semester between 1 and 8),
  bio text check (char_length(bio) <= 200),
  photo_url text not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default timezone('utc'::text, now())
);

-- SRNs should be unique even if the same SRN is submitted with different letter casing.
create unique index if not exists members_srn_lower_unique on public.members (lower(srn));
create index if not exists members_status_created_idx on public.members (status, created_at desc);

alter table public.members enable row level security;
-- Intentionally no anon/public table policies. The app uses server-side routes and the service role.
-- This is safer than allowing anyone with the public anon key to update moderation statuses.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('member-photos', 'member-photos', true, 3145728, array['image/webp']::text[])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

-- Seed 6 approved demo profiles so /team is populated immediately.
-- These are fictional sample entries; replace or remove them before using real member data.
insert into public.members (name, domain, position, srn, email, linkedin_url, github_url, branch, semester, bio, photo_url, status)
values
('Aanya Rao','Web Development','Head','DEMO-WEB-001','aanya.demo@example.com','https://www.linkedin.com/','https://github.com/','CSE',6,'Building useful web experiences with thoughtful UI, clean code, and a love for learning.','https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80','approved'),
('Ishaan Mehta','Design','Core Member','DEMO-DES-002','ishaan.demo@example.com','https://www.linkedin.com/','https://github.com/','AIML',4,'Turning complex ideas into simple, accessible interfaces through research and visual design.','https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80','approved'),
('Mira Nair','Social Media','Core Member','DEMO-SM-003','mira.demo@example.com','https://www.linkedin.com/','https://github.com/','ECE',4,'Storytelling, community building, and creative campaigns that help good ideas reach people.','https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80','approved'),
('Kabir Shah','Operations','Vice-Head','DEMO-OPS-004','kabir.demo@example.com','https://www.linkedin.com/','https://github.com/','CSE',6,'Keeping projects moving with clear systems, reliable coordination, and a calm head.','https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80','approved'),
('Tara Menon','Sponsorship','Member','DEMO-SP-005','tara.demo@example.com','https://www.linkedin.com/','https://github.com/','EEE',2,'Connecting people and opportunities to create partnerships that benefit everyone involved.','https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=400&q=80','approved'),
('Dev Malhotra','Event Management','Member','DEMO-EV-006','dev.demo@example.com','https://www.linkedin.com/','https://github.com/','ME',2,'Enjoys planning memorable events, working with teams, and making details feel effortless.','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80','approved')
on conflict do nothing;
