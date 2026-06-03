# Taluna · Panel de inventario (Admin)

Panel **privado** para que la dueña de Taluna edite el catálogo y el stock sin tocar SQL.
Es una app aparte del sitio público, pero usa la **misma base de datos Supabase**: lo que
cambies aquí se ve en la tienda.

- **App:** Next.js 14 (App Router, JavaScript)
- **Auth:** Supabase Auth (correo + contraseña), sesión por cookies con `@supabase/ssr`
- **Escrituras:** en el servidor con la `service_role` (nunca se expone al navegador)
- **Deploy sugerido:** Vercel, como proyecto separado del sitio público

---

## ¿Cómo se conecta con el sitio público?

```
┌──────────────────┐        ┌─────────────────────┐        ┌──────────────────┐
│  Sitio público   │  lee   │   Supabase (misma   │  edita │   Panel Admin     │
│  (Taluna-bussine)│ <───── │   base de datos)    │ <───── │  (este proyecto)  │
└──────────────────┘        └─────────────────────┘        └──────────────────┘
```

El sitio público sigue leyendo de la vista `catalog_public`. El panel escribe en las
tablas base. **No se tocó nada del sitio público.**

---

## 1. Correr en tu compu (local)

Necesitas Node.js 18+.

```bash
npm install
npm run dev
```

Abre **http://localhost:3001** (el público corre en el 3000; este en el 3001 para no chocar).

> Antes de que guarde cambios, necesitas poner la `service_role` en `.env.local` (paso 3).

---

## 2. Preparar Supabase (una sola vez)

1. Entra a tu proyecto en https://supabase.com.
2. Ve a **SQL Editor → New query**, pega TODO el contenido de
   [`supabase/admin-setup.sql`](supabase/admin-setup.sql) y dale **Run**.
   (Asegura el bucket de fotos y el `updated_at`. No borra datos.)
3. Crea la cuenta de la dueña: **Authentication → Users → Add user → Create new user**.
   - Email: el correo de la dueña.
   - Password: una contraseña (apúntala).
   - Marca **Auto Confirm User** (para que pueda entrar sin verificar correo).

---

## 3. Variables de entorno

Crea un archivo `.env.local` (copia de `.env.example`) con:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co     # mismo del sitio público
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...               # mismo del sitio público
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...                   # Settings → API → service_role  (SECRETA)
ADMIN_EMAIL=correo-de-la-duena@ejemplo.com             # opcional: solo este correo entra
```

> 🔐 **La `service_role` es secreta.** Settings → API → `service_role`. No la subas a GitHub,
> no la pongas con `NEXT_PUBLIC_`. Solo va en `.env.local` y en Vercel.

Reinicia `npm run dev` después de editar `.env.local`.

---

## 4. Cómo iniciar sesión por primera vez (para la dueña, paso a paso)

1. Abre la página del panel (en local: `http://localhost:3001`; ya en internet: la URL de Vercel).
2. Te manda a la pantalla de **Entrar**.
3. Escribe el **correo** y la **contraseña** que se crearon en Supabase (paso 2.3).
4. Clic en **Entrar al panel**. Listo: verás el resumen del inventario.
5. Para salir, usa el botón **Salir** arriba a la derecha.

¿Olvidó la contraseña? Desde Supabase → Authentication → Users → (la dueña) → **Reset password**.

---

## 5. Qué puede hacer la dueña

- **Inicio:** total de productos, publicados, stock total, productos con bajo stock
  (≤ 3 piezas) y valor estimado del inventario.
- **Productos:** crear, editar y eliminar. Toggles rápidos para **publicar** y **destacar**.
- **Variantes y stock:** dentro de cada producto, colores/opciones con su stock, SKU y
  precio especial. Aquí se controla el inventario.
- **Fotos:** subir, reordenar y eliminar imágenes (se guardan en el bucket `productos`).
  Recomendado: 4:5 vertical, mínimo 900px de ancho.
- **Categorías:** crear/editar/eliminar (Bolsas, Straps, …) y su orden.

---

## 6. Publicar el panel (Vercel) — como proyecto separado

1. Sube **esta carpeta** a un repo propio de GitHub (distinto al del sitio público).
2. En https://vercel.com → **Add New → Project**, importa ese repo.
3. En **Environment Variables** agrega las 4 del paso 3
   (incluida `SUPABASE_SERVICE_ROLE_KEY`).
4. **Deploy.** Tendrás una URL tipo `https://taluna-admin.vercel.app`.

> Como es un deploy aparte y todo está detrás del login, **los clientes del sitio público
> nunca ven el panel**. Comparte esa URL solo con la dueña.

---

## Estructura del proyecto

```
app/
  login/page.js              Pantalla de inicio de sesión
  (panel)/layout.js          Protege todo el panel (exige sesión)
  (panel)/page.js            Dashboard / resumen
  (panel)/productos/...      Lista, crear y editar productos
  (panel)/categorias/page.js CRUD de categorías
  actions/                   Server Actions (escrituras seguras con service_role)
components/                  UI del panel (tablas, formularios, editores)
lib/
  supabase/client.js         Cliente navegador (anon) — login
  supabase/server.js         Cliente servidor (anon) — leer la sesión
  supabase/admin.js          Cliente service_role (SOLO servidor) — escribir
  auth.js                    requireUser() / getUser()
  data.js                    Lecturas del panel (ve TODO, publicado o no)
middleware.js                Redirige a /login si no hay sesión
supabase/admin-setup.sql     Configuración de Storage + updated_at (correr una vez)
```

---

## Seguridad (resumen)

- Todas las rutas (menos `/login`) están protegidas por `middleware.js` **y** por el
  layout del panel (doble verificación de sesión en el servidor).
- Las escrituras usan la `service_role` **solo en el servidor**; el navegador nunca la ve.
- Cada Server Action vuelve a verificar la sesión con `requireUser()` antes de tocar la base.
- Con `ADMIN_EMAIL` puedes limitar el acceso a un único correo.

---

## Roadmap (preparado, no construido aún)

El modelo de datos y la estructura permiten agregar después sin reescribir:

- [ ] Apartados / reservas
- [ ] Control de producción artesanal
- [ ] Stock por canal (tienda física, online, Instagram)
