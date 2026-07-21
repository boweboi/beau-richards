-- Reviews: five category star ratings instead of one rating + comment.
-- Run in the Supabase SQL editor. reviews.rating/comment are dropped —
-- destructive for any rows already submitted, acceptable since the
-- feature only just shipped in step9.
--
-- No RLS policy changes needed — reviews_select_signed_in and
-- reviews_insert_homeowner_hired (step9) don't reference rating or
-- comment anywhere, only homeowner_id/lead_purchase_id/job_id/tradie_id/
-- status/engagement_status.

alter table public.reviews
  drop column rating,
  drop column comment,
  add column communication_rating integer not null check (communication_rating between 1 and 5),
  add column quality_rating integer not null check (quality_rating between 1 and 5),
  add column timeliness_rating integer not null check (timeliness_rating between 1 and 5),
  add column value_rating integer not null check (value_rating between 1 and 5),
  add column professionalism_rating integer not null check (professionalism_rating between 1 and 5);
