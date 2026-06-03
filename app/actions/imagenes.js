'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseAdmin } from '@/lib/supabase/admin';
import { requireUser } from '@/lib/auth';
import { slugify } from '@/lib/slug';

const BUCKET = 'productos';

function refresh(productId) {
  revalidatePath('/productos');
  if (productId) revalidatePath(`/productos/${productId}`);
}

// Sube un archivo al bucket "productos" y guarda la URL pública en product_images.
export async function uploadImage(formData) {
  await requireUser();
  const productId = String(formData.get('product_id') || '');
  const productSlug = String(formData.get('product_slug') || 'producto');
  const file = formData.get('file');
  const alt = String(formData.get('alt') || '').trim() || null;

  if (!productId || !file || typeof file === 'string' || file.size === 0) {
    refresh(productId);
    return;
  }

  const admin = createSupabaseAdmin();

  // Nombre de archivo único y limpio dentro de una carpeta por producto.
  const ext = (file.name?.split('.').pop() || 'jpg').toLowerCase();
  const stamp = `${productId.slice(0, 8)}-${file.size}`;
  const path = `${slugify(productSlug)}/${stamp}-${slugify(file.name?.replace(/\.[^.]+$/, '') || 'foto')}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const { error: upErr } = await admin.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType: file.type || 'image/jpeg', upsert: true });

  if (upErr) {
    refresh(productId);
    return;
  }

  const { data: pub } = admin.storage.from(BUCKET).getPublicUrl(path);

  // La nueva imagen va al final (position máxima + 1).
  const { data: existing } = await admin
    .from('product_images')
    .select('position')
    .eq('product_id', productId)
    .order('position', { ascending: false })
    .limit(1);
  const nextPos = existing && existing.length ? (existing[0].position ?? 0) + 1 : 0;

  await admin.from('product_images').insert({
    product_id: productId,
    url: pub.publicUrl,
    alt,
    position: nextPos,
  });

  refresh(productId);
}

// Guarda una nueva posición (reordenar).
export async function updateImagePosition(formData) {
  await requireUser();
  const id = String(formData.get('id') || '');
  const productId = String(formData.get('product_id') || '');
  const position = Math.trunc(Number(formData.get('position')));
  if (!id || Number.isNaN(position)) {
    refresh(productId);
    return;
  }
  const admin = createSupabaseAdmin();
  await admin.from('product_images').update({ position }).eq('id', id);
  refresh(productId);
}

export async function deleteImage(formData) {
  await requireUser();
  const id = String(formData.get('id') || '');
  const productId = String(formData.get('product_id') || '');
  const url = String(formData.get('url') || '');
  if (!id) return;

  const admin = createSupabaseAdmin();
  await admin.from('product_images').delete().eq('id', id);

  // Intenta borrar también el archivo del Storage (si está en nuestro bucket).
  const marker = `/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx !== -1) {
    const storagePath = decodeURIComponent(url.slice(idx + marker.length));
    await admin.storage.from(BUCKET).remove([storagePath]);
  }

  refresh(productId);
}
