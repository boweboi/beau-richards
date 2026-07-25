-- step15-expand-trade-categories.sql
-- Expands trade categories from 15 to 24, renames 'Building & Construction' -> 'Building'.

-- 1. Migrate the one existing row holding the old name
update tradie_trade_categories
  set category = 'Building'
  where category = 'Building & Construction';

-- 2. Drop the auto-named inline CHECK (looks up the real name, no guessing)
do $$
declare
  cname text;
begin
  select conname into cname
  from pg_constraint
  where conrelid = 'tradie_trade_categories'::regclass
    and contype = 'c'
    and pg_get_constraintdef(oid) ilike '%category%';
  if cname is not null then
    execute format('alter table tradie_trade_categories drop constraint %I', cname);
  end if;
end $$;

-- 3. Re-add with an explicit name + the full 24-category list
alter table tradie_trade_categories
  add constraint tradie_trade_categories_category_check
  check (category in (
    'Building', 'Plumbing', 'Electrical',
    'Painting & Decorating', 'Roofing', 'Plastering & Gib Stopping',
    'Tiling', 'Flooring', 'Landscaping & Gardening', 'Fencing',
    'Concreting', 'Bricklaying & Blocklaying', 'Glazing & Windows',
    'Handyman / General', 'Cleaning',
    'Waterproofing', 'Pest Control', 'Excavation',
    'Heating & Cooling', 'Carpet Laying', 'Insulation',
    'Solar', 'Arborists', 'Locksmiths'
  ));
