import SubmitButton from '@/components/SubmitButton';
import { Input } from '@/components/ui';
import { addVariant, updateVariant, deleteVariant } from '@/app/actions/variantes';
import { LOW_STOCK_THRESHOLD } from '@/lib/slug';

// Editor de variantes (colores/opciones) y stock. Cada fila es UN formulario:
//  - "Guardar" envía a updateVariant
//  - "Eliminar" usa formAction para mandar la misma fila a deleteVariant
function VariantRow({ productId, variant }) {
  const low = (variant.stock ?? 0) <= LOW_STOCK_THRESHOLD;
  return (
    <form className="grid grid-cols-2 items-end gap-2 border-b border-lineSoft py-3 sm:grid-cols-12">
      <input type="hidden" name="id" value={variant.id} />
      <input type="hidden" name="product_id" value={productId} />

      <label className="col-span-1 sm:col-span-3">
        <span className="mb-1 block text-xs text-muted">Nombre</span>
        <Input name="name" defaultValue={variant.name || ''} placeholder="Negra" />
      </label>

      <label className="col-span-1 sm:col-span-3">
        <span className="mb-1 block text-xs text-muted">SKU</span>
        <Input name="sku" defaultValue={variant.sku || ''} placeholder="TAUU-NEG" />
      </label>

      <label className="col-span-1 sm:col-span-2">
        <span className="mb-1 block text-xs text-muted">
          Stock {low && <span className="text-warn">· bajo</span>}
        </span>
        <Input name="stock" type="number" min="0" step="1" defaultValue={variant.stock ?? 0} />
      </label>

      <label className="col-span-1 sm:col-span-2">
        <span className="mb-1 block text-xs text-muted">Precio especial</span>
        <Input
          name="price_override"
          type="number"
          min="0"
          step="1"
          defaultValue={variant.price_override ?? ''}
          placeholder="—"
        />
      </label>

      <label className="col-span-1 flex items-center gap-2 pb-2 sm:col-span-1">
        <input type="checkbox" name="is_active" defaultChecked={variant.is_active ?? true} className="h-4 w-4 accent-camel" />
        <span className="text-xs text-muted">Activa</span>
      </label>

      <div className="col-span-1 flex gap-2 sm:col-span-1">
        <SubmitButton formAction={updateVariant} className="px-3 py-1.5" pendingText="…">
          Guardar
        </SubmitButton>
        <SubmitButton
          formAction={deleteVariant}
          variant="danger"
          className="px-2 py-1.5"
          pendingText="…"
        >
          ✕
        </SubmitButton>
      </div>
    </form>
  );
}

export default function VariantsEditor({ productId, variants = [] }) {
  return (
    <div>
      {variants.length === 0 ? (
        <p className="py-2 text-sm text-muted">Aún no hay variantes. Agrega la primera abajo.</p>
      ) : (
        <div>
          {variants.map((v) => (
            <VariantRow key={v.id} productId={productId} variant={v} />
          ))}
        </div>
      )}

      {/* Fila para AGREGAR nueva variante */}
      <form className="mt-4 grid grid-cols-2 items-end gap-2 rounded-card border border-lineSoft bg-cream p-3 sm:grid-cols-12">
        <input type="hidden" name="product_id" value={productId} />
        <label className="col-span-1 sm:col-span-3">
          <span className="mb-1 block text-xs text-muted">Nombre</span>
          <Input name="name" placeholder="Nuevo color/opción" required />
        </label>
        <label className="col-span-1 sm:col-span-3">
          <span className="mb-1 block text-xs text-muted">SKU</span>
          <Input name="sku" placeholder="opcional" />
        </label>
        <label className="col-span-1 sm:col-span-2">
          <span className="mb-1 block text-xs text-muted">Stock</span>
          <Input name="stock" type="number" min="0" step="1" defaultValue={0} />
        </label>
        <label className="col-span-1 sm:col-span-2">
          <span className="mb-1 block text-xs text-muted">Precio especial</span>
          <Input name="price_override" type="number" min="0" step="1" placeholder="—" />
        </label>
        <label className="col-span-1 flex items-center gap-2 pb-2 sm:col-span-1">
          <input type="checkbox" name="is_active" defaultChecked className="h-4 w-4 accent-camel" />
          <span className="text-xs text-muted">Activa</span>
        </label>
        <div className="col-span-1 sm:col-span-1">
          <SubmitButton formAction={addVariant} variant="camel" className="px-3 py-1.5" pendingText="…">
            Agregar
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
