import Link from 'next/link';
import { formatPrice, formatNumber } from '@/lib/format';
import { togglePublish, toggleFeature } from '@/app/actions/productos';
import { Badge } from '@/components/ui';
import { LOW_STOCK_THRESHOLD } from '@/lib/slug';

// Botón-interruptor que envía un Server Action. `value` es el estado
// AL QUE queremos cambiar (lo contrario del actual).
function Toggle({ action, id, current, onLabel, offLabel }) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="value" value={(!current).toString()} />
      <button
        type="submit"
        className={`rounded-full px-2.5 py-1 text-xs font-bold transition ${
          current
            ? 'bg-okBg text-ok hover:brightness-95'
            : 'border border-line bg-white text-muted hover:bg-cream'
        }`}
      >
        {current ? onLabel : offLabel}
      </button>
    </form>
  );
}

export default function ProductsTable({ products }) {
  if (!products.length) {
    return (
      <div className="rounded-card border border-dashed border-line bg-cream p-10 text-center text-muted">
        Aún no hay productos. Crea el primero con el botón “Nuevo producto”.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-card border border-line bg-white shadow-softSm">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-line bg-cream text-left text-[0.72rem] font-bold uppercase tracking-wide text-muted">
            <th className="px-4 py-3">Producto</th>
            <th className="px-4 py-3">Categoría</th>
            <th className="px-4 py-3">Precio</th>
            <th className="px-4 py-3">Stock</th>
            <th className="px-4 py-3">Destacado</th>
            <th className="px-4 py-3">Publicado</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {products.map((p) => {
            const low = p.total_stock <= LOW_STOCK_THRESHOLD;
            return (
              <tr key={p.id} className="border-b border-lineSoft last:border-0 hover:bg-cream">
                <td className="px-4 py-3">
                  <Link href={`/productos/${p.id}`} className="font-semibold text-ink hover:text-burg">
                    {p.name}
                  </Link>
                  <div className="text-xs text-muted">/{p.slug}</div>
                </td>
                <td className="px-4 py-3 text-muted">{p.category_name}</td>
                <td className="px-4 py-3 font-semibold text-ink">{formatPrice(p.price, p.currency)}</td>
                <td className="px-4 py-3">
                  <Badge tone={p.total_stock === 0 ? 'danger' : low ? 'warn' : 'muted'}>
                    {formatNumber(p.total_stock)}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Toggle
                    action={toggleFeature}
                    id={p.id}
                    current={p.is_featured}
                    onLabel="★ Destacado"
                    offLabel="☆ Normal"
                  />
                </td>
                <td className="px-4 py-3">
                  <Toggle
                    action={togglePublish}
                    id={p.id}
                    current={p.is_published}
                    onLabel="Publicado"
                    offLabel="Borrador"
                  />
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/productos/${p.id}`} className="text-sm font-semibold text-accent hover:underline">
                    Editar
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
