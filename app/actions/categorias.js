'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createSupabaseAdmin } from '@/lib/supabase/admin';
import { requireUser } from '@/lib/auth';
import { slugify } from '@/lib/slug';

// Redirige a /categorias con un mensaje de éxito (ok) o error.
function redirectCat(kind, message) {
  redirect('/categorias?' + kind + '=' + encodeURIComponent(message));
}

function refresh() {
  revalidatePath('/categorias');
  revalidatePath('/productos');
  revalidatePath('/');
}

function parseCategory(formData) {
  const name = String(formData.get('name') || '').trim();
  let slug = String(formData.get('slug') || '').trim();
  slug = slug ? slugify(slug) : slugify(name);
  const description = String(formData.get('description') || '').trim() || null;
  const positionRaw = String(formData.get('position') || '0').trim();
  const position = Math.trunc(Number(positionRaw)) || 0;
  const is_active = formData.get('is_active') === 'on';

  const ok = Boolean(name && slug);
  return { values: { name, slug, description, position, is_active }, ok };
}

export async function createCategory(formData) {
  await requireUser();
  const { values, ok } = parseCategory(formData);
  if (!ok) redirectCat('error', 'Nombre y slug son obligatorios.');
  const admin = createSupabaseAdmin();
  const { error } = await admin.from('categories').insert(values);
  if (error) redirectCat('error', 'No se pudo crear: ' + error.message);
  refresh();
  redirectCat('ok', 'Categoría creada.');
}

export async function updateCategory(formData) {
  await requireUser();
  const id = String(formData.get('id') || '');
  const { values, ok } = parseCategory(formData);
  if (!id || !ok) redirectCat('error', 'Datos incompletos.');
  const admin = createSupabaseAdmin();
  const { error } = await admin.from('categories').update(values).eq('id', id);
  if (error) redirectCat('error', 'No se pudo guardar: ' + error.message);
  refresh();
  redirectCat('ok', 'Categoría actualizada.');
}

export async function deleteCategory(formData) {
  await requireUser();
  const id = String(formData.get('id') || '');
  if (!id) redirectCat('error', 'Falta la categoría.');
  const admin = createSupabaseAdmin();
  // Si hay productos en la categoría, Postgres pondrá su category_id en NULL
  // (ON DELETE SET NULL en el esquema), no los borra.
  const { error } = await admin.from('categories').delete().eq('id', id);
  if (error) redirectCat('error', 'No se pudo eliminar: ' + error.message);
  refresh();
  redirectCat('ok', 'Categoría eliminada.');
}
