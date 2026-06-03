/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      // Mismos colores que el sitio público (leen de variables CSS en globals.css)
      // para que el panel se sienta parte de la misma marca Taluna.
      colors: {
        cream: 'var(--color-cream)',
        sand: 'var(--color-sand)',
        ink: 'var(--color-ink)',
        wine: 'var(--color-wine)',
        wineSoft: 'var(--color-wine-soft)',
        accent: 'var(--color-accent)',
        muted: 'var(--color-muted)',
        line: 'var(--color-line)',
        ok: 'var(--color-ok)',
        warn: 'var(--color-warn)',
        danger: 'var(--color-danger)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '18px',
      },
      boxShadow: {
        soft: '0 10px 40px -18px rgba(40, 25, 25, 0.25)',
      },
      maxWidth: {
        shell: '1180px',
      },
    },
  },
  plugins: [],
};
