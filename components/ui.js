// Piezas de UI reutilizables (server-safe, sin estado de cliente).

export function Card({ children, className = '' }) {
  return (
    <div
      className={`rounded-card border border-line bg-sand/60 p-5 shadow-soft ${className}`}
    >
      {children}
    </div>
  );
}

export function Field({ label, htmlFor, hint, children, error }) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="mb-1 block text-sm font-medium text-ink">{label}</span>
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-muted">{hint}</span>}
      {error && <span className="mt-1 block text-xs text-danger">{error}</span>}
    </label>
  );
}

const inputBase =
  'w-full rounded-xl border border-line bg-cream px-3 py-2 text-sm text-ink outline-none focus:border-wine focus:ring-2 focus:ring-wine/20 placeholder:text-muted';

export function Input(props) {
  return <input {...props} className={`${inputBase} ${props.className || ''}`} />;
}

export function Textarea(props) {
  return (
    <textarea
      {...props}
      className={`${inputBase} min-h-[88px] ${props.className || ''}`}
    />
  );
}

export function Select(props) {
  return (
    <select {...props} className={`${inputBase} ${props.className || ''}`}>
      {props.children}
    </select>
  );
}

export function Badge({ children, tone = 'muted' }) {
  const tones = {
    ok: 'bg-ok/15 text-ok border-ok/30',
    warn: 'bg-warn/15 text-warn border-warn/30',
    danger: 'bg-danger/15 text-danger border-danger/30',
    muted: 'bg-line/40 text-muted border-line',
    wine: 'bg-wine/10 text-wine border-wine/30',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
        tones[tone] || tones.muted
      }`}
    >
      {children}
    </span>
  );
}

// Banda de aviso (éxito / error) leída de los searchParams (?ok= / ?error=).
export function FlashMessage({ ok, error }) {
  if (!ok && !error) return null;
  const isError = Boolean(error);
  return (
    <div
      className={`mb-4 rounded-xl border px-4 py-3 text-sm ${
        isError
          ? 'border-danger/30 bg-danger/10 text-danger'
          : 'border-ok/30 bg-ok/10 text-ok'
      }`}
    >
      {isError ? error : ok}
    </div>
  );
}
