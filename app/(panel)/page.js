import Link from 'next/link';
import { getDashboard } from '@/lib/data';
import { formatPrice, formatNumber } from '@/lib/format';
import { Card, Badge } from '@/components/ui';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Inicio · Taluna Admin' };

function Metric({ label, value, hint, tone }) {
  return (
    <Card>
      <p className="text-sm text-muted">{label}</p>
      <p className={`mt-1 text-3xl font-semibold ${tone || 'text-ink'}`}>{value}</p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </Card>
  );
}

export default async function DashboardPage() {
  const d = await getDashboard();

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl text-ink">Resumen del inventario</h1>
        <p className="text-sm text-muted">Una mirada rápida a tu catálogo y existencias.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Metric label="Productos" value={formatNumber(d.totalProducts)} hint={`${d.publishedProducts} publicados`} />
        <Metric label="Publicados" value={formatNumber(d.publishedProducts)} tone="text-ok" />
        <Metric label="Stock total" value={formatNumber(d.stockTotal)} hint="Piezas en todas las variantes" />
        <Metric
          label="Bajo stock"
          value={formatNumber(d.lowStockCount)}
          tone={d.lowStockCount ? 'text-warn' : 'text-ok'}
          hint={`Productos con ${d.threshold} o menos`}
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <p className="text-sm text-muted">Valor estimado del inventario</p>
          <p className="mt-1 text-3xl font-semibold text-wine">{formatPrice(d.inventoryValue)}</p>
          <p className="mt-1 text-xs text-muted">Suma de precio × stock de cada variante.</p>
        </Card>

        <Card className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-medium text-ink">Productos con bajo stock</p>
            <Link href="/productos" className="text-sm text-accent hover:underline">
              Ver todos
            </Link>
          </div>

          {d.lowStock.length === 0 ? (
            <p className="text-sm text-muted">Todo en orden, ningún producto bajo el mínimo. 🎉</p>
          ) : (
            <ul className="divide-y divide-line">
              {d.lowStock.map((p) => (
                <li key={p.id} className="flex items-center justify-between py-2.5">
                  <div className="min-w-0">
                    <Link
                      href={`/productos/${p.id}`}
                      className="truncate font-medium text-ink hover:text-wine"
                    >
                      {p.name}
                    </Link>
                    {!p.is_published && (
                      <span className="ml-2 align-middle">
                        <Badge tone="muted">Borrador</Badge>
                      </span>
                    )}
                  </div>
                  <Badge tone={p.total_stock === 0 ? 'danger' : 'warn'}>
                    {p.total_stock} en stock
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
