-- ROOTMAN MONEY ROUTE — Migration 0008: pricing update + Route Kit bundle
-- New pricing:
--   Income Blueprint  199.00 THB = 19900 satang
--   Route Kit         299.00 THB = 29900 satang (bundles Income Blueprint free)
-- Prices are stored in the smallest currency unit (satang for THB).
-- The bundle grant itself is handled in the payments webhook: buying route_kit
-- also grants the income_blueprint entitlement. Metadata records the bundle for
-- reference. Apply via `node scripts/db-migrate.mjs`.

update public.products
set price = 19900,
    metadata = coalesce(metadata, '{}'::jsonb) || '{"price_note": "launch"}'::jsonb
where slug = 'income_blueprint';

update public.products
set price = 29900,
    metadata = coalesce(metadata, '{}'::jsonb)
      || '{"launch_price": true, "bundle": ["income_blueprint"]}'::jsonb
where slug = 'route_kit';
