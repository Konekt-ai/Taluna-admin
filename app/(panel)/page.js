import Link from 'next/link';
import { getDashboard } from '@/lib/data';
import { formatPrice, formatNumber } from '@/lib/format';
import { Card, Badge } from '@/components/ui';
import { BarChart, AreaChart } from '@/components/Charts';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Inicio · Taluna Admin' };

function Metric({ label, value, hint, tone, accent }) {
  return (
    <Card className="relative overflow-hidden">
      {/* franja de acento lateral para dar carácter a cada métrica */}
      <span
        className="absolute inset-y-0 left-0 w-1"
        style={{ backgroundColor: accent || 'var(--color-wine)' }}
      />
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

      {/* Métricas principales */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Metric
          label="Productos"
          value={formatNumber(d.totalProducts)}
          hint={`${d.publishedProducts} publicados`}
          accent="var(--color-wine)"
        />
        <Metric
          label="Publicados"
          value={formatNumber(d.publishedProducts)}
          tone="text-ok"
          accent="var(--color-ok)"
        />
        <Metric
          label="Stock total"
          value={formatNumber(d.stockTotal)}
          hint="Piezas en todas las variantes"
          accent="var(--color-accent)"
        />
        <Metric
          label="Bajo stock"
          value={formatNumber(d.lowStockCount)}
          tone={d.lowStockCount ? 'text-warn' : 'text-ok'}
          hint={`Productos con ${d.threshold} o menos`}
          accent={d.lowStockCount ? 'var(--color-warn)' : 'var(--color-ok)'}
        />
      </div>

      {/* Valor del inventario — banner destacado */}
      <div className="mt-4">
        <Card className="relative overflow-hidden bg-wine/5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm text-muted">Valor estimado del inventario</p>
              <p className="mt-1 font-display text-4xl text-wine">
                {formatPrice(d.inventoryValue)}
              </p>
              <p className="mt-1 text-xs text-muted">
                Suma de precio × stock de cada variante.
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted">Catálogo</p>
              <p className="mt-1 text-lg font-semibold text-ink">
                {formatNumber(d.totalProducts)} productos
              </p>
              <p className="text-xs text-muted">
                {formatNumber(d.stockByCategory.length)} categorías activas
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Gráficas */}
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <AreaChart
          title="Ventas de la semana"
          subtitle="Piezas vendidas por día (últimos 7 días)"
          note={d.isDemoSales ? 'Datos de ejemplo' : undefined}
          data={d.weeklySales}
          formatValue={(v) => `${formatNumber(v)} pz`}
        />
        <BarChart
          title="Productos más vendidos"
          subtitle="Piezas vendidas en la semana, por producto"
          note={d.isDemoSales ? 'Datos de ejemplo' : undefined}
          data={d.topSold.map((p) => ({ label: p.name, value: p.units }))}
          formatValue={(v) => `${formatNumber(v)} pz`}
        />
      </div>

      {/* Bajo stock */}
      <div className="mt-4">
        <Card>
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
