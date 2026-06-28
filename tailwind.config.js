/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      // Paleta cálida del Organizador (estudio.html). Los valores viven como
      // variables CSS en globals.css para que el panel y el Organizador
      // compartan EXACTAMENTE el mismo tema.
      colors: {
        bg: 'var(--color-bg)',
        bgSoft: 'var(--color-bg-soft)',
        rail: 'var(--color-rail)',
        cream: 'var(--color-cream)', // alias: fondo suave
        sand: 'var(--color-sand)', // alias: superficie de tarjeta (blanco)
        card: 'var(--color-card)',

        ink: 'var(--color-ink)',
        ink2: 'var(--color-ink-2)',
        muted: 'var(--color-muted)',
        faint: 'var(--color-faint)',

        line: 'var(--color-line)',
        lineSoft: 'var(--color-line-soft)',

        camel: 'var(--color-camel)',
        camelD: 'var(--color-camel-d)',
        camelBg: 'var(--color-camel-bg)',

        burg: 'var(--color-burg)',
        burgBg: 'var(--color-burg-bg)',
        charcoal: 'var(--color-charcoal)',

        // Aliases de marca que ya usaban componentes y gráficas.
        wine: 'var(--color-wine)',
        wineSoft: 'var(--color-wine-soft)',
        accent: 'var(--color-accent)',

        ok: 'var(--color-ok)',
        okBg: 'var(--color-ok-bg)',
        warn: 'var(--color-warn)',
        warnBg: 'var(--color-warn-bg)',
        danger: 'var(--color-danger)',
        dangerBg: 'var(--color-danger-bg)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '18px',
        xl2: '26px',
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
        softSm: 'var(--shadow-soft-sm)',
      },
      maxWidth: {
        shell: '1180px',
      },
    },
  },
  plugins: [],
};
