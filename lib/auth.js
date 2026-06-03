import 'server-only';
import { redirect } from 'next/navigation';
import { createSupabaseServer } from '@/lib/supabase/server';

// Devuelve el usuario logueado o null. No redirige.
export async function getUser() {
  const supabase = createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // Si configuraste ADMIN_EMAIL, solo esa cuenta cuenta como admin.
  const allowed = process.env.ADMIN_EMAIL;
  if (allowed && user.email?.toLowerCase() !== allowed.toLowerCase()) {
    return null;
  }
  return user;
}

// Para usar al inicio de páginas y Server Actions protegidas.
// Si no hay sesión válida, manda al login.
export async function requireUser() {
  const user = await getUser();
  if (!user) redirect('/login');
  return user;
}
