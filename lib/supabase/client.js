'use client';

import { createBrowserClient } from '@supabase/ssr';

// Cliente de Supabase para el NAVEGADOR (solo llave anon, pública).
// Se usa para iniciar/cerrar sesión desde el formulario de login.
export function createSupabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
