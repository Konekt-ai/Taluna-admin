'use client';

import { useFormStatus } from 'react-dom';

// Botón que se deshabilita y muestra "cargando" mientras el Server Action
// está en curso. Úsalo dentro de cualquier <form action={...}>.
export default function SubmitButton({
  children,
  pendingText = 'Guardando…',
  className = '',
  variant = 'primary',
  ...props
}) {
  const { pending } = useFormStatus();

  const base =
    'inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition disabled:opacity-60 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-wine text-cream hover:bg-wineSoft',
    ghost: 'border border-line text-ink hover:bg-sand',
    danger: 'border border-danger text-danger hover:bg-danger hover:text-cream',
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
