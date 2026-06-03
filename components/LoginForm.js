'use client';

import { useFormState } from 'react-dom';
import { loginAction } from '@/app/actions/auth';
import SubmitButton from '@/components/SubmitButton';
import { Field, Input } from '@/components/ui';

export default function LoginForm() {
  const [state, formAction] = useFormState(loginAction, { error: null });

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {state.error}
        </div>
      )}

      <Field label="Correo" htmlFor="email">
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="tucorreo@ejemplo.com"
        />
      </Field>

      <Field label="Contraseña" htmlFor="password">
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
        />
      </Field>

      <SubmitButton pendingText="Entrando…" className="w-full">
        Entrar al panel
      </SubmitButton>
    </form>
  );
}
