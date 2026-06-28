// Piezas de UI reutilizables (server-safe, sin estado de cliente).
// Mismo lenguaje visual que el Organizador: tarjetas blancas redondeadas,
// bordes cálidos suaves, foco camel.

export function Card({ children, className = '' }) {
  return (
    <div
      className={`rounded-card border border-line bg-white p-5 shadow-softSm ${className}`}
    >
      {children}
    </div>
  );
}

// Cabecera de página: eyebrow + título Fraunces + intro. Da coherencia a
// todas las pantallas del panel (igual que las view-head del Organizador).
export function PageHeader({ eyebrow, title, intro, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1 className="mt-1.5 font-display text-[clamp(1.6rem,4vw,2.1rem)] leading-tight text-charcoal">
          {title}
        </h1>
        {intro && <p className="mt-1 max-w-[62ch] text-sm text-muted">{intro}</p>}
      </div>
      {action}
    </div>
  );
}

export function Field({ label, htmlFor, hint, children, error }) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="mb-1.5 block text-[0.74rem] font-bold text-ink2">{label}</span>
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-muted">{hint}</span>}
      {error && <span className="mt-1 block text-xs font-semibold text-danger">{error}</span>}
    </label>
  );
}

const inputBase =
  'w-full rounded-xl border-[1.4px] border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-camel focus:ring-[3px] focus:ring-camelBg placeholder:text-faint';

export function Input(props) {
  return <input {...props} className={`${inputBase} ${props.className || ''}`} />;
}

export function Textarea(props) {
  return (
    <textarea
      {...props}
      className={`${inputBase} min-h-[88px] resize-y ${props.className || ''}`}
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
    ok: 'bg-okBg text-ok',
    warn: 'bg-warnBg text-warn',
    danger: 'bg-dangerBg text-danger',
    muted: 'bg-[rgba(42,38,34,0.08)] text-ink2',
    wine: 'bg-burgBg text-burg',
    camel: 'bg-camelBg text-camelD',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
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
      className={`mb-4 rounded-xl px-4 py-3 text-sm font-semibold ${
        isError ? 'bg-dangerBg text-danger' : 'bg-okBg text-ok'
      }`}
    >
      {isError ? error : ok}
    </div>
  );
}
