import LoginForm from '@/components/LoginForm';

export const metadata = { title: 'Entrar · Taluna Admin' };

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <p className="font-display text-2xl text-wine">Taluna</p>
          <h1 className="mt-1 text-lg font-medium text-ink">Panel de inventario</h1>
          <p className="mt-1 text-sm text-muted">
            Ingresa con la cuenta de administradora.
          </p>
        </div>
        <div className="rounded-card border border-line bg-sand/60 p-6 shadow-soft">
          <LoginForm />
        </div>
        <p className="mt-4 text-center text-xs text-muted">
          ¿Olvidaste tu contraseña? Restablécela desde Supabase.
        </p>
      </div>
    </main>
  );
}
