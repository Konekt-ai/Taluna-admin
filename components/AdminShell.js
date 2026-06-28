'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { logoutAction } from '@/app/actions/auth';

// Iconos de línea (mismo estilo que el Organizador / estudio.html).
const ICONS = {
  home: '<path d="M3 11l9-8 9 8M5 10v10h14V10"/>',
  bag: '<path d="M6 8h12l1 12H5L6 8zM9 8a3 3 0 0 1 6 0"/>',
  layers: '<path d="M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 16.5l9 5 9-5"/>',
  wand: '<path d="M5 19L15 9M14 3.5l.8 1.7 1.7.8-1.7.8-.8 1.7-.8-1.7-1.7-.8 1.7-.8zM19.5 11l.5 1 1 .5-1 .5-.5 1-.5-1-1-.5 1-.5z"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  logout: '<path d="M15 4h4v16h-4M11 8l-4 4 4 4M7 12h9"/>',
};

function Icon({ name, className = 'h-[18px] w-[18px]' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: ICONS[name] || '' }}
    />
  );
}

const NAV = [
  { sep: 'Panel' },
  { href: '/', label: 'Inicio', icon: 'home', exact: true },
  { sep: 'Catálogo' },
  { href: '/productos', label: 'Productos', icon: 'bag' },
  { href: '/categorias', label: 'Categorías', icon: 'layers' },
  { sep: 'Herramientas' },
  { href: '/estudio.html', label: 'Organizador', icon: 'wand', external: true },
];

function isActive(pathname, item) {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(item.href + '/');
}

// Título de la barra superior según la ruta actual.
function titleFor(pathname) {
  if (pathname === '/') return 'Inicio';
  if (pathname.startsWith('/productos/nuevo')) return 'Nuevo producto';
  if (pathname.startsWith('/productos/')) return 'Editar producto';
  if (pathname.startsWith('/productos')) return 'Productos';
  if (pathname.startsWith('/categorias')) return 'Categorías';
  return 'Taluna';
}

export default function AdminShell({ userEmail, children }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="min-h-screen md:grid md:grid-cols-[268px_1fr]">
      {/* Fondo oscuro para cerrar el menú en móvil */}
      <div
        onClick={close}
        className={`fixed inset-0 z-[70] bg-[rgba(40,35,30,0.34)] backdrop-blur-[2px] transition md:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* ---- Barra lateral ---- */}
      <aside
        className={`fixed inset-y-0 left-0 z-[80] flex w-[268px] flex-col border-r border-lineSoft bg-rail px-4 pb-3.5 pt-4 transition-transform duration-300 md:sticky md:top-0 md:h-screen md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Link
          href="/"
          onClick={close}
          className="flex items-center gap-2.5 px-2 pb-4 pt-1"
          aria-label="Taluna · Inicio"
        >
          <Image
            src="/logo.png"
            alt="Taluna MX"
            width={182}
            height={129}
            priority
            className="h-11 w-auto rounded-lg"
          />
          <span className="font-display text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-camelD">
            Panel
          </span>
        </Link>

        <nav className="-mx-1 flex flex-1 flex-col gap-0.5 overflow-y-auto px-1">
          {NAV.map((item, i) => {
            if (item.sep) {
              return (
                <div
                  key={`sep-${i}`}
                  className="px-3 pb-1.5 pt-3.5 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-faint"
                >
                  {item.sep}
                </div>
              );
            }
            const active = isActive(pathname, item);
            const cls = `group flex items-center gap-3 rounded-[13px] px-3 py-2.5 text-sm font-semibold transition ${
              active ? 'bg-charcoal text-white' : 'text-ink2 hover:bg-white'
            }`;
            const inner = (
              <>
                <span
                  className={`grid h-5 w-5 flex-none place-items-center ${
                    active ? 'text-camel' : 'text-muted'
                  }`}
                >
                  <Icon name={item.icon} />
                </span>
                {item.label}
              </>
            );
            return item.external ? (
              <a key={item.href} href={item.href} onClick={close} className={cls}>
                {inner}
              </a>
            ) : (
              <Link key={item.href} href={item.href} onClick={close} className={cls}>
                {inner}
              </Link>
            );
          })}
        </nav>

        <div className="mt-2 border-t border-lineSoft pt-3">
          {userEmail && (
            <p className="truncate px-1 pb-2 text-xs font-semibold text-muted">{userEmail}</p>
          )}
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-full border border-line bg-white px-3 py-2 text-sm font-bold text-ink transition hover:border-charcoal"
            >
              <Icon name="logout" className="h-4 w-4" />
              Salir
            </button>
          </form>
        </div>
      </aside>

      {/* ---- Columna principal ---- */}
      <div className="flex min-h-screen min-w-0 flex-col">
        <header className="sticky top-0 z-50 flex items-center gap-3 border-b border-lineSoft bg-white/85 px-4 py-2.5 backdrop-blur">
          <button
            onClick={() => setOpen(true)}
            aria-label="Menú"
            className="grid h-10 w-10 flex-none place-items-center rounded-xl border border-line bg-white md:hidden"
          >
            <Icon name="menu" className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <div className="font-display text-[1.05rem] font-medium leading-tight text-charcoal">
              {titleFor(pathname)}
            </div>
            <div className="text-[0.72rem] font-semibold text-muted">Taluna · Panel</div>
          </div>
          <div className="flex-1" />
          {userEmail && (
            <span className="hidden text-xs font-semibold text-muted sm:inline">{userEmail}</span>
          )}
        </header>

        <main className="mx-auto w-full max-w-shell flex-1 px-4 py-6 md:px-8 md:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
