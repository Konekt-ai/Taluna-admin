'use server';

import { redirect } from 'next/navigation';
import { createSupabaseServer } from '@/lib/supabase/server';

// Inicia sesión con email + contraseña. Devuelve { error } para mostrarlo
// en el formulario, o redirige al dashboard si todo salió bien.
export async function loginAction(prevState, formData) {
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');

  if (!email || !password) {
    return { error: 'Escribe tu correo y contraseña.' };
  }

  const allowed = process.env.ADMIN_EMAIL;
  if (allowed && email.toLowerCase() !== allowed.toLowerCase()) {
    return { error: 'Esta cuenta no tiene acceso al panel.' };
  }

  const supabase = createSupabaseServer();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: 'Correo o contraseña incorrectos.' };
  }

  redirect('/');
}

// Cierra la sesión y manda al login.
export async function logoutAction() {
  const supabase = createSupabaseServer();
  await supabase.auth.signOut();
  redirect('/login');
}
