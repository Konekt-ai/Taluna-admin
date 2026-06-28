import Image from 'next/image';
import LoginForm from '@/components/LoginForm';

export const metadata = { title: 'Entrar · Taluna Admin' };

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bgSoft px-5">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <Image
            src="/logo.png"
            alt="Taluna MX"
            width={160}
            height={113}
            priority
            className="mx-auto h-14 w-auto"
          />
          <h1 className="mt-3 font-display text-2xl text-charcoal">Panel de inventario</h1>
          <p className="mt-1 text-sm text-muted">
            Ingresa con tu cuenta para administrar el catálogo.
          </p>
        </div>
        <div className="rounded-card border border-line bg-white p-6 shadow-soft">
          <LoginForm />
        </div>
        <p className="mt-4 text-center text-xs text-muted">
          ¿Olvidaste tu contraseña? Restablécela desde Supabase.
        </p>
      </div>
    </main>
  );
}
