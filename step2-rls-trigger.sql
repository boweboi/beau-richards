-- Lock the table down: users can only see/edit their own row
alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

-- NOTE: the trigger below did not actually get created in this project
-- (confirmed via `select * from pg_trigger where tgname = 'on_auth_user_created'`
-- returning no rows) despite this script running without error. The profiles
-- row is now created explicitly in src/app/signup/actions.ts instead, right
-- after signUp() succeeds. Left here for reference / in case it's revisited.
--
-- Auto-create a profile row the moment someone signs up
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'role', 'homeowner'),
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.email
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
