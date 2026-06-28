import Link from 'next/link';
import { getDashboard } from '@/lib/data';
import { formatPrice, formatNumber } from '@/lib/format';
import { Card, Badge } from '@/components/ui';
import { BarChart, AreaChart } from '@/components/Charts';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Inicio · Taluna Admin' };

// Tarjeta de métrica al estilo .stat del Organizador.
function Stat({ label, value, hint, tone }) {
  const card =
    tone === 'alert'
      ? 'bg-warnBg'
      : tone === 'good'
        ? 'bg-okBg'
        : 'bg-white border border-line';
  const num =
    tone === 'alert' ? 'text-warn' : tone === 'good' ? 'text-ok' : 'text-charcoal';
  const lab = tone === 'alert' ? 'text-[#9a6b1f]' : tone === 'good' ? 'text-[#2f5e43]' : 'text-muted';
  return (
    <div className={`relative overflow-hidden rounded-card p-[18px] shadow-softSm ${card}`}>
      <div className={`font-display text-[2.2rem] leading-none ${num}`}>{value}</div>
      <div className={`mt-1.5 text-[0.8rem] font-semibold ${lab}`}>{label}</div>
      {hint && <div className="mt-0.5 text-[0.72rem] text-muted">{hint}</div>}
    </div>
  );
}

export default async function DashboardPage() {
  const d = await getDashboard();

  return (
    <div>
      {/* Hero cálido */}
      <div className="mb-5 rounded-xl2 border border-line bg-gradient-to-br from-white to-bgSoft p-6 shadow-soft md:p-7">
        <span className="eyebrow">Resumen del inventario</span>
        <h1 className="mt-2 font-display text-[clamp(1.7rem,5vw,2.5rem)] leading-[1.05] text-charcoal">
          Tu catálogo, de un vistazo
        </h1>
        <p className="mt-1.5 max-w-[54ch] text-muted">
          Una mirada rápida a tus productos y existencias. Todo lo del catálogo vive aquí.
        </p>
        <div className="mt-5 flex flex-wrap gap-2.5">
          <Link
            href="/productos"
            className="inline-flex items-center gap-2 rounded-full border border-charcoal bg-charcoal px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#1e1b17]"
          >
            Ver productos
          </Link>
          <a
            href="/estudio.html"
            className="inline-flex items-center gap-2 rounded-full border border-camel bg-camel px-4 py-2.5 text-sm font-bold text-white transition hover:bg-camelD"
          >
            Abrir Organizador
          </a>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Productos" value={formatNumber(d.totalProducts)} hint={`${d.publishedProducts} publicados`} />
        <Stat label="Publicados" value={formatNumber(d.publishedProducts)} tone="good" />
        <Stat label="Stock total" value={formatNumber(d.stockTotal)} hint="En todas las variantes" />
        <Stat
          label="Bajo stock"
          value={formatNumber(d.lowStockCount)}
          tone={d.lowStockCount ? 'alert' : 'good'}
          hint={`${d.threshold} o menos`}
        />
      </div>

      {/* Valor del inventario — banner destacado */}
      <div className="mt-3">
        <div className="rounded-card border border-line bg-burgBg p-5 shadow-softSm">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-muted">Valor estimado del inventario</p>
              <p className="mt-1 font-display text-[2.4rem] leading-none text-burg">
                {formatPrice(d.inventoryValue)}
              </p>
              <p className="mt-1.5 text-xs text-muted">Suma de precio × stock de cada variante.</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-muted">Catálogo</p>
              <p className="mt-1 text-lg font-bold text-ink">
                {formatNumber(d.totalProducts)} productos
              </p>
              <p className="text-xs text-muted">
                {formatNumber(d.stockByCategory.length)} categorías activas
              </p>
            </div>
          </div>
        </div>
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
            <p className="font-display text-lg text-charcoal">Productos con bajo stock</p>
            <Link href="/productos" className="text-sm font-semibold text-accent hover:underline">
              Ver todos
            </Link>
          </div>

          {d.lowStock.length === 0 ? (
            <p className="text-sm text-muted">Todo en orden, ningún producto bajo el mínimo. 🎉</p>
          ) : (
            <ul className="divide-y divide-lineSoft">
              {d.lowStock.map((p) => (
                <li key={p.id} className="flex items-center justify-between py-2.5">
                  <div className="min-w-0">
                    <Link
                      href={`/productos/${p.id}`}
                      className="truncate font-semibold text-ink hover:text-burg"
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
