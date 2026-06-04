// Gráficas en SVG puro — sin librerías, server-safe y con los colores de la
// marca Taluna. Se renderizan en el servidor como cualquier otro componente.
import { Card } from '@/components/ui';

// Paleta de marca para series (se cicla si hay más categorías que colores).
const SERIES = [
  'var(--color-wine)',
  'var(--color-accent)',
  'var(--color-ok)',
  'var(--color-warn)',
  'var(--color-wine-soft)',
  'var(--color-ink)',
];

// Cabecera común de las gráficas (título, subtítulo y distintivo opcional).
function ChartHeader({ title, subtitle, note }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <p className="font-medium text-ink">{title}</p>
        {subtitle && <p className="text-xs text-muted">{subtitle}</p>}
      </div>
      {note && (
        <span className="shrink-0 rounded-full border border-line bg-cream px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted">
          {note}
        </span>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Gráfica de barras horizontales: stock por categoría.
// ---------------------------------------------------------------------------
export function BarChart({ title, subtitle, note, data, formatValue = (v) => v }) {
  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <Card>
      <ChartHeader title={title} subtitle={subtitle} note={note} />

      {data.length === 0 ? (
        <p className="text-sm text-muted">Aún no hay datos para mostrar.</p>
      ) : (
        <div className="space-y-3">
          {data.map((d, i) => {
            const pct = Math.round((d.value / max) * 100);
            const color = SERIES[i % SERIES.length];
            return (
              <div key={d.label}>
                <div className="mb-1 flex items-baseline justify-between gap-3">
                  <span className="truncate text-sm text-ink">{d.label}</span>
                  <span className="shrink-0 text-sm font-semibold text-ink">
                    {formatValue(d.value)}
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-line/50">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${Math.max(pct, 2)}%`, backgroundColor: color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Gráfica de dona (donut) con leyenda. Ideal para proporciones (2-6 partes).
// ---------------------------------------------------------------------------
function donutArc(cx, cy, r, startAngle, endAngle) {
  const toXY = (angle) => [
    cx + r * Math.cos((angle - 90) * (Math.PI / 180)),
    cy + r * Math.sin((angle - 90) * (Math.PI / 180)),
  ];
  const [x1, y1] = toXY(startAngle);
  const [x2, y2] = toXY(endAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
}

export function DonutChart({ title, subtitle, note, data }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const size = 168;
  const stroke = 22;
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;

  let cursor = 0; // ángulo acumulado
  const segments = data.map((d, i) => {
    const fraction = total > 0 ? d.value / total : 0;
    const start = cursor * 360;
    cursor += fraction;
    const end = cursor * 360;
    return {
      ...d,
      color: d.color || SERIES[i % SERIES.length],
      // 0.9999 evita un arco completo de 360° (que no se dibuja en SVG).
      path: donutArc(cx, cy, r, start, Math.min(end, 359.999)),
      pct: Math.round(fraction * 100),
    };
  });

  return (
    <Card>
      <ChartHeader title={title} subtitle={subtitle} note={note} />

      {total === 0 ? (
        <p className="text-sm text-muted">Aún no hay datos para mostrar.</p>
      ) : (
        <div className="flex items-center gap-6">
          <div className="relative shrink-0" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
              {/* pista base */}
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke="var(--color-line)"
                strokeOpacity="0.5"
                strokeWidth={stroke}
              />
              {segments.map((s) => (
                <path
                  key={s.label}
                  d={s.path}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={stroke}
                  strokeLinecap="round"
                />
              ))}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-3xl leading-none text-ink">{total}</span>
              <span className="text-xs text-muted">total</span>
            </div>
          </div>

          <ul className="flex-1 space-y-2.5">
            {segments.map((s) => (
              <li key={s.label} className="flex items-center gap-2.5">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: s.color }}
                />
                <span className="flex-1 text-sm text-ink">{s.label}</span>
                <span className="text-sm text-muted">{s.value}</span>
                <span className="w-9 text-right text-sm font-semibold text-ink">
                  {s.pct}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Gráfica de área + línea: una serie a lo largo del tiempo (ej. ventas semana).
// ---------------------------------------------------------------------------
export function AreaChart({ title, subtitle, note, data, formatValue = (v) => v }) {
  // Lienzo en coordenadas internas; el SVG escala al ancho del contenedor.
  const W = 560;
  const H = 220;
  const padX = 14;
  const padTop = 24;
  const padBottom = 34;
  const innerW = W - padX * 2;
  const innerH = H - padTop - padBottom;

  const max = Math.max(1, ...data.map((d) => d.value));
  const stepX = data.length > 1 ? innerW / (data.length - 1) : 0;
  const x = (i) => padX + stepX * i;
  const y = (v) => padTop + innerH * (1 - v / max);

  const pts = data.map((d, i) => [x(i), y(d.value)]);
  const line = pts.map((p, i) => `${i ? 'L' : 'M'} ${p[0]} ${p[1]}`).join(' ');
  const baseY = padTop + innerH;
  const area = data.length
    ? `${line} L ${x(data.length - 1)} ${baseY} L ${x(0)} ${baseY} Z`
    : '';

  const peak = data.reduce((m, d) => (d.value > m.value ? d : m), data[0] || { value: 0 });
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card>
      <ChartHeader title={title} subtitle={subtitle} note={note} />

      {data.length === 0 ? (
        <p className="text-sm text-muted">Aún no hay datos para mostrar.</p>
      ) : (
        <>
          <div className="mb-2 flex items-baseline gap-4">
            <div>
              <span className="font-display text-3xl text-ink">{formatValue(total)}</span>
              <span className="ml-1 text-xs text-muted">en la semana</span>
            </div>
            <span className="text-xs text-muted">
              Mejor día: <span className="font-medium text-ink">{peak.label}</span>
            </span>
          </div>

          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="h-auto w-full"
            role="img"
            aria-label={title}
          >
            <defs>
              <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-wine)" stopOpacity="0.35" />
                <stop offset="100%" stopColor="var(--color-wine)" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {/* líneas guía horizontales */}
            {[0, 0.5, 1].map((t) => (
              <line
                key={t}
                x1={padX}
                x2={W - padX}
                y1={padTop + innerH * t}
                y2={padTop + innerH * t}
                stroke="var(--color-line)"
                strokeOpacity="0.5"
                strokeDasharray="3 4"
              />
            ))}

            <path d={area} fill="url(#areaFill)" />
            <path
              d={line}
              fill="none"
              stroke="var(--color-wine)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {pts.map((p, i) => (
              <g key={data[i].label}>
                <circle cx={p[0]} cy={p[1]} r="4" fill="var(--color-cream)" stroke="var(--color-wine)" strokeWidth="2.5" />
                <text x={p[0]} y={p[1] - 10} textAnchor="middle" fontSize="12" fontWeight="600" fill="var(--color-ink)">
                  {data[i].value}
                </text>
                <text x={p[0]} y={H - 12} textAnchor="middle" fontSize="12" fill="var(--color-muted)">
                  {data[i].label}
                </text>
              </g>
            ))}
          </svg>
        </>
      )}
    </Card>
  );
}
