'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import SubmitButton from '@/components/SubmitButton';
import { Field, Input, Textarea, Select, Card } from '@/components/ui';
import { slugify } from '@/lib/slug';

// Formulario reutilizable para crear y editar producto.
// `action` es el Server Action (createProduct o updateProduct).
export default function ProductForm({ action, categories = [], product = null, submitLabel = 'Guardar' }) {
  const [state, formAction] = useFormState(action, {});
  const v = state.values || product || {};

  const [name, setName] = useState(v.name || '');
  const [slug, setSlug] = useState(v.slug || '');
  const [slugTouched, setSlugTouched] = useState(Boolean(v.slug));

  const fe = state.fieldErrors || {};

  function onNameChange(e) {
    const value = e.target.value;
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  return (
    <form action={formAction} className="space-y-4">
      {product?.id && <input type="hidden" name="id" value={product.id} />}

      {state.error && (
        <div className="rounded-xl bg-dangerBg px-4 py-3 text-sm font-semibold text-danger">
          {state.error}
        </div>
      )}
      {state.ok && (
        <div className="rounded-xl bg-okBg px-4 py-3 text-sm font-semibold text-ok">
          {state.ok}
        </div>
      )}

      <Card>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nombre" htmlFor="name" error={fe.name}>
            <Input id="name" name="name" value={name} onChange={onNameChange} placeholder="Bolsa Tauú" required />
          </Field>

          <Field label="Slug (URL)" htmlFor="slug" error={fe.slug} hint="Se genera del nombre; puedes editarlo.">
            <div className="flex gap-2">
              <Input
                id="slug"
                name="slug"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugTouched(true);
                }}
                placeholder="bolsa-tauu"
              />
              <button
                type="button"
                onClick={() => setSlug(slugify(name))}
                className="shrink-0 rounded-xl border border-line px-3 text-sm text-muted transition hover:bg-cream"
                title="Generar desde el nombre"
              >
                Auto
              </button>
            </div>
          </Field>

          <Field label="Categoría" htmlFor="category_id">
            <Select id="category_id" name="category_id" defaultValue={v.category_id || ''}>
              <option value="">— Sin categoría —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Precio" htmlFor="price" error={fe.price}>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="1"
                defaultValue={v.price ?? ''}
                placeholder="3800"
                required
              />
            </Field>
            <Field label="Moneda" htmlFor="currency">
              <Input id="currency" name="currency" defaultValue={v.currency || 'MXN'} />
            </Field>
          </div>
        </div>
      </Card>

      <Card>
        <div className="grid gap-4">
          <Field label="Descripción corta" htmlFor="short_desc" hint="Aparece en las tarjetas del catálogo.">
            <Input id="short_desc" name="short_desc" defaultValue={v.short_desc || ''} placeholder="La bolsa perfecta para cualquier salida. 100% piel." />
          </Field>

          <Field label="Historia / descripción larga" htmlFor="story">
            <Textarea id="story" name="story" defaultValue={v.story || ''} />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Materiales" htmlFor="materials">
              <Input id="materials" name="materials" defaultValue={v.materials || ''} placeholder="100% piel" />
            </Field>
            <Field label="Dimensiones" htmlFor="dimensions">
              <Input id="dimensions" name="dimensions" defaultValue={v.dimensions || ''} placeholder="30 × 25 × 12 cm" />
            </Field>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" name="is_published" defaultChecked={v.is_published ?? false} className="h-4 w-4 accent-camel" />
            Publicado (visible en la tienda)
          </label>
          <label className="flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" name="is_featured" defaultChecked={v.is_featured ?? false} className="h-4 w-4 accent-camel" />
            Destacado (aparece en el inicio)
          </label>
        </div>
      </Card>

      <div className="flex justify-end">
        <SubmitButton>{submitLabel}</SubmitButton>
      </div>
    </form>
  );
}
