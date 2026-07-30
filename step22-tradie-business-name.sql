-- Business name for a tradie's profile, editable from the tradie
-- dashboard's new "Business details" section alongside the existing
-- nzbn/phone/email fields. Run in the Supabase SQL editor.
alter table public.profiles
  add column business_name text;
