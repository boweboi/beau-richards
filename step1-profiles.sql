create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('tradie', 'homeowner')),
  full_name text not null,
  email text not null,
  -- tradie-only fields, left empty for now — filled in later via profile editing
  trade_type text,
  service_region text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_role_idx on public.profiles (role);
