-- Tradie qualification documents (certs, LBP cards, etc.) for admin
-- review. Same shape as tradie_portfolio_photos (step7) — metadata table
-- here, bytes in Supabase Storage — with one deliberate difference: the
-- storage bucket is PRIVATE, not public. These are qualification/ID
-- documents, not public-facing marketing photos, so only the uploading
-- tradie (via RLS) or the service-role admin client can ever read them.
-- The admin panel views them through short-lived signed URLs, never a
-- public one. Run each numbered block separately in the Supabase SQL
-- editor, in order, top to bottom.

-- ============================================================
-- STEP 1 — tradie_qualification_documents: document metadata.
-- ============================================================
create table public.tradie_qualification_documents (
  id uuid primary key default gen_random_uuid(),
  tradie_id uuid not null references public.profiles(id) on delete cascade,
  storage_path text not null unique,
  file_name text not null,
  created_at timestamptz not null default now()
);

create index tradie_qualification_documents_tradie_id_idx
  on public.tradie_qualification_documents (tradie_id);

alter table public.tradie_qualification_documents enable row level security;

create policy "tradie_qualification_documents_select_own"
  on public.tradie_qualification_documents for select
  using (auth.uid() = tradie_id);

create policy "tradie_qualification_documents_insert_own"
  on public.tradie_qualification_documents for insert
  with check (auth.uid() = tradie_id);

create policy "tradie_qualification_documents_delete_own"
  on public.tradie_qualification_documents for delete
  using (auth.uid() = tradie_id);

-- ============================================================
-- STEP 2 — private storage bucket. Writes/reads scoped to the
-- uploader's own folder prefix "{tradie_id}/..." via RLS, same pattern
-- as tradie-portfolios (step7) minus the public-read policy.
-- ============================================================
insert into storage.buckets (id, name, public)
values ('tradie-qualifications', 'tradie-qualifications', false)
on conflict (id) do nothing;

create policy "tradie_qualification_objects_insert_own"
  on storage.objects for insert
  with check (
    bucket_id = 'tradie-qualifications'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "tradie_qualification_objects_select_own"
  on storage.objects for select
  using (
    bucket_id = 'tradie-qualifications'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "tradie_qualification_objects_delete_own"
  on storage.objects for delete
  using (
    bucket_id = 'tradie-qualifications'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
