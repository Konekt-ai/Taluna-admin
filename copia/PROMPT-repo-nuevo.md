# Prompt para iniciar el repo nuevo del Organizador

> Cómo usarlo: crea una carpeta nueva (vacía), copia ahí el archivo
> `copia/public/estudio.html` (el prototipo que ya funciona) como
> `prototipo/estudio.html`, abre Claude Code en esa carpeta y pega el prompt de
> abajo. Si no copias el prototipo, igual sirve: el prompt describe todo.

---

## PROMPT (cópialo y pégalo)

Quiero construir **Taluna Organizador**: una app web **móvil** e interna para que la
dueña de una marca de bolsas artesanales (Taluna MX) **organice su catálogo y suba
fotos** desde el celular. NO es la tienda; es una herramienta de staging para ordenar
todo antes de pasarlo a la tienda real. Todo debe **guardarse en la nube** y poder
llenarse desde el celular, detrás de un **login**.

Tengo un prototipo de un solo archivo que ya funciona en `prototipo/estudio.html`
(HTML + JS vanilla, guarda en localStorage/IndexedDB). Úsalo como **fuente de la
verdad para el diseño y las funciones**: respétalo casi idéntico, pero conviértelo en
una app real con guardado en la nube. Si no encuentras el archivo, recréalo desde la
descripción de abajo.

### Stack
- **Next.js 14 (App Router) + React + Tailwind**.
- **Supabase**: Auth (login email+contraseña), Postgres y Storage.
- Escrituras en el servidor con `service_role` (rutas API), igual de seguro que un panel admin.
- Desplegable en Vercel. UI 100% en **español**, **mobile-first**.

### Arquitectura de datos (sencilla, tipo documento)
- El estado completo (bolsas, straps, cinturones, compatibilidades, combinaciones,
  metadatos) se guarda como **un documento JSON** en una tabla `studio_docs (id text pk,
  data jsonb, updated_at)`. Las **fotos** van a un bucket de Storage **`studio`** (público
  de lectura) y en el JSON solo se guardan las URLs.
- Rutas API autenticadas:
  - `GET/PUT /api/studio/state` — leer/guardar el JSON.
  - `POST/DELETE /api/studio/image` — subir/borrar fotos.
  - Cada una valida la sesión (getUser) y escribe con `service_role`.
- **Middleware** que protege toda la app y las APIs: sin sesión → redirige a `/login`.
- **Guardado en la nube con respaldo local**: guarda optimista en localStorage y hace
  push (debounced) al servidor; si no hay conexión/sesión, cae a modo local y reintenta
  (sube fotos pendientes cuando vuelve). Mostrar un indicador "Guardando… / Guardado en
  la nube / Sin conexión / Inicia sesión".

### Modelo de catálogo (del prototipo)
- **Bolsas**: nombre, descripción corta/larga, color, tamaño (Mini/Chica/Mediana/Grande/
  Celular), precio, stock, estado (Activa/Oculta/Agotada/Próximamente), categoría,
  material, herrajes, dimensiones, etiquetas, notas, y un set de **fotos por ángulo**
  (fondo blanco frontal/3-4/lateral/trasera, en modelo, close-ups, tamaño en persona,
  lifestyle, video). Cada foto puede tener "roles" (Principal, Catálogo, Hero, etc.).
- **Straps**: nombre, tipo (Chiapas/Huichol/Shakria/…), color, base de piel, precio,
  stock, estado, patrón, largo/ancho, material, fotos.
- **Cinturones**: similar, más simple.
- **Compatibilidades**: por cada bolsa, marcar qué straps combinan (toggle), con precio
  final, flags (recomendado/premium/casual/elegante/regalo/foto principal/ocultar),
  notas. Solo los marcados se muestran al cliente.
- **Combinaciones**: bolsa + strap guardada, con precio final, foto de la combinación,
  y un estado "lista para tienda" (valida que tenga foto/precio/stock/compatibilidad).

### Pantallas (mismas que el prototipo)
1. **Inicio** — asistente paso a paso (5 pasos) con barra de progreso.
2. **Bolsas / Straps / Cinturones** — listas con tarjetas, filtros y un editor en hoja
   deslizable (datos esenciales + "más detalles" colapsable + subir fotos por espacio).
3. **Compatibilidades** — elegir bolsa y marcar straps compatibles.
4. **Arma tu Taluna** (constructor) — vista previa de cómo el cliente armaría su bolsa.
5. **Combinaciones** — revisar/marcar "lista para tienda".
6. **Subir fotos** (guiado) — lista de lo que falta por producto.
7. **Qué falta** (checklist) — pendientes automáticos (fotos/precio/stock/descripción).
8. **Vista previa de tienda** — simulación (hero, categorías, página de producto, IG).
9. **Exportar** — JSON completo, CSV de productos, CSV de combinaciones, checklist de
   fotos, resumen para WhatsApp, resumen para equipo de fotos. Y "borrar todo".

### Diseño (respétalo del prototipo)
- Tipografías **Fraunces** (títulos) + **Manrope** (texto). Paleta cálida: crema
  (#FAF7F2), camel (#B07C4B / #8F6231), vino (#6E2B39), carbón (#2C2823), líneas suaves.
- Layout con **sidebar** (fijo en desktop, deslizable con hamburguesa en móvil),
  **topbar** con título de sección, tarjetas blancas redondeadas con sombra tenue, pills,
  botones redondeados (principal carbón, camel, fantasma). Animaciones suaves.

### Entregables
- App Next.js funcional, con `.env.example` (NEXT_PUBLIC_SUPABASE_URL, ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY).
- Un `.sql` para correr una vez en Supabase: crea `studio_docs` (con RLS cerrada,
  trigger de updated_at) y el bucket `studio` público.
- README con pasos para Supabase, `.env.local`, correr local y desplegar en Vercel,
  y cómo crear la cuenta de la dueña en Supabase Auth.

Empieza proponiendo la estructura de carpetas y el `.sql`, luego implementa. Mantén la
UI idéntica al prototipo en look & feel.
