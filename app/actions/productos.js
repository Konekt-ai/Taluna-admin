'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createSupabaseAdmin } from '@/lib/supabase/admin';
import { requireUser } from '@/lib/auth';
import { slugify } from '@/lib/slug';

// Revalida las pantallas del panel que muestran productos.
function revalidateProducts(id) {
  revalidatePath('/');
  revalidatePath('/productos');
  if (id) revalidatePath(`/productos/${id}`);
}

// Lee y valida los campos comunes del formulario de producto.
function parseProductForm(formData) {
  const name = String(formData.get('name') || '').trim();
  let slug = String(formData.get('slug') || '').trim();
  slug = slug ? slugify(slug) : slugify(name);

  const category_id = String(formData.get('category_id') || '').trim() || null;
  const short_desc = String(formData.get('short_desc') || '').trim() || null;
  const story = String(formData.get('story') || '').trim() || null;
  const materials = String(formData.get('materials') || '').trim() || null;
  const dimensions = String(formData.get('dimensions') || '').trim() || null;
  const currency = String(formData.get('currency') || 'MXN').trim() || 'MXN';
  const priceRaw = String(formData.get('price') || '').trim();
  const price = priceRaw === '' ? NaN : Number(priceRaw);

  const is_published = formData.get('is_published') === 'on';
  const is_featured = formData.get('is_featured') === 'on';

  const fieldErrors = {};
  if (!name) fieldErrors.name = 'El nombre es obligatorio.';
  if (!slug) fieldErrors.slug = 'El slug no puede quedar vacío.';
  if (Number.isNaN(price) || price < 0) fieldErrors.price = 'El precio debe ser un número mayor o igual a 0.';

  return {
    values: {
      name,
      slug,
      category_id,
      short_desc,
      story,
      materials,
      dimensions,
      currency,
      price,
      is_published,
      is_featured,
    },
    fieldErrors,
  };
}

// Verifica que el slug no esté usado por OTRO producto.
async function slugTaken(admin, slug, exceptId) {
  let query = admin.from('products').select('id').eq('slug', slug).limit(1);
  if (exceptId) query = query.neq('id', exceptId);
  const { data } = await query;
  return Boolean(data && data.length);
}

export async function createProduct(prevState, formData) {
  await requireUser();
  const { values, fieldErrors } = parseProductForm(formData);
  if (Object.keys(fieldErrors).length) {
    return { error: 'Revisa los campos marcados.', fieldErrors, values };
  }

  const admin = createSupabaseAdmin();
  if (await slugTaken(admin, values.slug)) {
    return { error: 'Ya existe un producto con ese slug.', fieldErrors: { slug: 'Slug repetido, usa otro.' }, values };
  }

  const { data, error } = await admin.from('products').insert(values).select('id').single();
  if (error) {
    return { error: 'No se pudo crear el producto: ' + error.message, values };
  }

  revalidateProducts(data.id);
  redirect(`/productos/${data.id}?ok=Producto%20creado.%20Ahora%20agrega%20variantes%20y%20fotos.`);
}

export async function updateProduct(prevState, formData) {
  await requireUser();
  const id = String(formData.get('id') || '');
  if (!id) return { error: 'Falta el identificador del producto.' };

  const { values, fieldErrors } = parseProductForm(formData);
  if (Object.keys(fieldErrors).length) {
    return { error: 'Revisa los campos marcados.', fieldErrors, values };
  }

  const admin = createSupabaseAdmin();
  if (await slugTaken(admin, values.slug, id)) {
    return { error: 'Ya existe otro producto con ese slug.', fieldErrors: { slug: 'Slug repetido, usa otro.' }, values };
  }

  const { error } = await admin
    .from('products')
    .update({ ...values, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) {
    return { error: 'No se pudo guardar: ' + error.message, values };
  }

  revalidateProducts(id);
  return { ok: 'Cambios guardados.', values };
}

export async function deleteProduct(formData) {
  await requireUser();
  const id = String(formData.get('id') || '');
  if (!id) redirect('/productos?error=Falta%20el%20producto%20a%20eliminar.');

  const admin = createSupabaseAdmin();
  // Las variantes e imágenes se borran solas (ON DELETE CASCADE en el esquema).
  const { error } = await admin.from('products').delete().eq('id', id);
  if (error) {
    redirect('/productos?error=' + encodeURIComponent('No se pudo eliminar: ' + error.message));
  }
  revalidateProducts(id);
  redirect('/productos?ok=Producto%20eliminado.');
}

// Toggles rápidos desde la tabla.
async function toggleBool(formData, column) {
  await requireUser();
  const id = String(formData.get('id') || '');
  const next = formData.get('value') === 'true'; // valor al que queremos pasar
  if (!id) return;
  const admin = createSupabaseAdmin();
  await admin
    .from('products')
    .update({ [column]: next, updated_at: new Date().toISOString() })
    .eq('id', id);
  revalidateProducts(id);
}

export async function togglePublish(formData) {
  await toggleBool(formData, 'is_published');
}

export async function toggleFeature(formData) {
  await toggleBool(formData, 'is_featured');
}
