'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { logoutAction } from '@/app/actions/auth';

const NAV = [
  { href: '/', label: 'Inicio', exact: true },
  { href: '/productos', label: 'Productos' },
  { href: '/categorias', label: 'Categorías' },
  { href: '/estudio.html', label: 'Organizador', external: true },
];

function isActive(pathname, item) {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(item.href + '/');
}

export default function AdminShell({ userEmail, children }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-sand/70 backdrop-blur">
        <div className="shell flex flex-wrap items-center gap-x-6 gap-y-2 py-3">
          <Link href="/" className="flex items-center" aria-label="Taluna MX · Inicio">
            <Image
              src="/logo.png"
              alt="Taluna MX"
              width={182}
              height={129}
              priority
              className="h-16 w-auto rounded-lg"
            />
          </Link>

          <nav className="flex flex-1 flex-wrap items-center gap-1">
            {NAV.map((item) =>
              item.external ? (
                // El Organizador es una página propia (estática) fuera del
                // enrutado de Next: usamos <a> para una navegación normal.
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-3 py-1.5 text-sm text-ink transition hover:bg-line/50"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-3 py-1.5 text-sm transition ${
                    isActive(pathname, item)
                      ? 'bg-wine text-cream'
                      : 'text-ink hover:bg-line/50'
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          <div className="flex items-center gap-3">
            {userEmail && (
              <span className="hidden text-xs text-muted sm:inline">{userEmail}</span>
            )}
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-full border border-line px-3 py-1.5 text-sm text-ink transition hover:bg-line/50"
              >
                Salir
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="shell py-7">{children}</main>
    </div>
  );
}
