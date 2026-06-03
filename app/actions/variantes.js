'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseAdmin } from '@/lib/supabase/admin';
import { requireUser } from '@/lib/auth';

function refresh(productId) {
  revalidatePath('/');
  revalidatePath('/productos');
  if (productId) revalidatePath(`/productos/${productId}`);
}

function parseVariant(formData) {
  const name = String(formData.get('name') || '').trim();
  const sku = String(formData.get('sku') || '').trim() || null;
  const stockRaw = String(formData.get('stock') || '0').trim();
  const stock = Math.trunc(Number(stockRaw));
  const overrideRaw = String(formData.get('price_override') || '').trim();
  const price_override = overrideRaw === '' ? null : Number(overrideRaw);
  const is_active = formData.get('is_active') === 'on';

  const errors = [];
  if (!name) errors.push('La variante necesita un nombre (color u opción).');
  if (Number.isNaN(stock) || stock < 0) errors.push('El stock debe ser un entero mayor o igual a 0.');
  if (price_override !== null && (Number.isNaN(price_override) || price_override < 0))
    errors.push('El precio especial debe ser un número mayor o igual a 0.');

  return { values: { name, sku, stock, price_override, is_active }, errors };
}

export async function addVariant(formData) {
  await requireUser();
  const productId = String(formData.get('product_id') || '');
  const { values, errors } = parseVariant(formData);
  if (!productId || errors.length) {
    refresh(productId);
    return;
  }
  const admin = createSupabaseAdmin();
  await admin.from('product_variants').insert({ product_id: productId, ...values });
  refresh(productId);
}

export async function updateVariant(formData) {
  await requireUser();
  const id = String(formData.get('id') || '');
  const productId = String(formData.get('product_id') || '');
  const { values, errors } = parseVariant(formData);
  if (!id || errors.length) {
    refresh(productId);
    return;
  }
  const admin = createSupabaseAdmin();
  await admin.from('product_variants').update(values).eq('id', id);
  refresh(productId);
}

// Edición rápida de SOLO el stock (el corazón del inventario).
export async function updateStock(formData) {
  await requireUser();
  const id = String(formData.get('id') || '');
  const productId = String(formData.get('product_id') || '');
  const stock = Math.trunc(Number(formData.get('stock')));
  if (!id || Number.isNaN(stock) || stock < 0) {
    refresh(productId);
    return;
  }
  const admin = createSupabaseAdmin();
  await admin.from('product_variants').update({ stock }).eq('id', id);
  refresh(productId);
}

export async function deleteVariant(formData) {
  await requireUser();
  const id = String(formData.get('id') || '');
  const productId = String(formData.get('product_id') || '');
  if (!id) return;
  const admin = createSupabaseAdmin();
  await admin.from('product_variants').delete().eq('id', id);
  refresh(productId);
}
