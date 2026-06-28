'use client';

import { useFormStatus } from 'react-dom';

// Botón que se deshabilita y muestra "cargando" mientras el Server Action
// está en curso. Úsalo dentro de cualquier <form action={...}>.
// Variantes alineadas con los .btn del Organizador.
export default function SubmitButton({
  children,
  pendingText = 'Guardando…',
  className = '',
  variant = 'primary',
  ...props
}) {
  const { pending } = useFormStatus();

  const base =
    'inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold leading-none transition disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'border border-charcoal bg-charcoal text-white hover:bg-[#1e1b17]',
    camel: 'border border-camel bg-camel text-white hover:bg-camelD',
    ghost: 'border border-line bg-white text-ink hover:border-charcoal',
    danger: 'border border-dangerBg text-danger hover:bg-dangerBg hover:border-danger',
  };

  return (
    <button
      type="submit"
      disabled={pending}
      className={`${base} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {pending ? pendingText : children}
    </button>
  );
}
