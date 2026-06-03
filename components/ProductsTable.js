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
        className={`rounded-full border px-2.5 py-1 text-xs font-medium transition ${
          current
            ? 'border-ok/40 bg-ok/15 text-ok hover:bg-ok/25'
            : 'border-line bg-cream text-muted hover:bg-line/40'
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
      <div className="rounded-card border border-dashed border-line p-10 text-center text-muted">
        Aún no hay productos. Crea el primero con el botón “Nuevo producto”.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-card border border-line">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-line bg-sand/70 text-left text-muted">
            <th className="px-4 py-3 font-medium">Producto</th>
            <th className="px-4 py-3 font-medium">Categoría</th>
            <th className="px-4 py-3 font-medium">Precio</th>
            <th className="px-4 py-3 font-medium">Stock</th>
            <th className="px-4 py-3 font-medium">Destacado</th>
            <th className="px-4 py-3 font-medium">Publicado</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {products.map((p) => {
            const low = p.total_stock <= LOW_STOCK_THRESHOLD;
            return (
              <tr key={p.id} className="border-b border-line/70 last:border-0 hover:bg-sand/40">
                <td className="px-4 py-3">
                  <Link href={`/productos/${p.id}`} className="font-medium text-ink hover:text-wine">
                    {p.name}
                  </Link>
                  <div className="text-xs text-muted">/{p.slug}</div>
                </td>
                <td className="px-4 py-3 text-muted">{p.category_name}</td>
                <td className="px-4 py-3">{formatPrice(p.price, p.currency)}</td>
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
                  <Link href={`/productos/${p.id}`} className="text-sm text-accent hover:underline">
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
