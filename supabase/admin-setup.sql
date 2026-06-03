-- =====================================================================
--  TALUNA ADMIN — Configuración de seguridad para el panel
--  Corre esto UNA VEZ en Supabase → SQL Editor → New query.
--
--  ENFOQUE ELEGIDO: las ESCRITURAS del panel se hacen en el servidor con
--  la SERVICE_ROLE_KEY (ver lib/supabase/admin.js). La service_role SALTA
--  RLS, así que NO necesitas políticas de escritura para que el panel
--  funcione. Las tablas siguen protegidas para el público (solo lectura).
--
--  Este archivo solo:
--   1) Garantiza que exista la columna updated_at en products (por si tu
--      schema viejo no la tenía) y un trigger que la mantenga al día.
--   2) Garantiza que el bucket de Storage "productos" exista y sea público.
--   3) Deja DOCUMENTADA (comentada) la alternativa con RLS por si algún día
--      prefieres no usar service_role.
-- =====================================================================

-- 1) updated_at en products -------------------------------------------------
alter table if exists public.products
  add column if not exists updated_at timestamptz not null default now();

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- 2) Bucket de Storage "productos" (público) --------------------------------
insert into storage.buckets (id, name, public)
values ('productos', 'productos', true)
on conflict (id) do update set public = true;

-- =====================================================================
--  ALTERNATIVA (NO la necesitas si usas service_role como aquí):
--  Dar permiso de escritura SOLO a la cuenta admin autenticada.
--  Descomenta y cambia el email si prefieres este camino.
-- =====================================================================
-- alter table public.products          enable row level security;
-- alter table public.product_variants  enable row level security;
-- alter table public.product_images    enable row level security;
-- alter table public.categories        enable row level security;
--
-- create policy "admin escribe productos" on public.products
--   for all to authenticated
--   using  (auth.jwt() ->> 'email' = 'correo-de-la-duena@ejemplo.com')
--   with check (auth.jwt() ->> 'email' = 'correo-de-la-duena@ejemplo.com');
--  (repite una política similar para product_variants, product_images y categories)
