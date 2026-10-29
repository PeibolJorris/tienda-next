# TiendaNext — Frontend

Ecommerce completo hecho con **Next.js 16 (App Router)**, **Tailwind CSS 4**, **NextAuth** y **Stripe Checkout**.
Proyecto integrador de Programación Web II (U6) — Pablo Rupérez.

🌐 **Web:** https://tienda-next.vercel.app
🔌 **API (repo):** https://github.com/PeibolJorris/tienda-api

> La API está en el plan gratuito de Render: si lleva un rato sin usarse, la primera carga puede tardar ~50 s.

## Funcionalidades

- **Catálogo** con buscador, filtro por categorías (con selector para cambiar de una a otra) y página de detalle.
- **Autenticación** con NextAuth (email + contraseña). Registro y login.
- **Carrito** con Context API: se guarda en `localStorage` sin sesión y en la API con sesión (se sincroniza al iniciar sesión).
- **Pago con Stripe Checkout** (modo test) + webhook que marca el pedido como pagado.
- **Historial de pedidos** del usuario (`/cuenta/pedidos`).
- **Panel admin** (`/admin/productos`): crear, editar y borrar productos. Solo para usuarios con rol `admin`.
- **Rutas protegidas** con `proxy.js` (`/cuenta/*` y `/admin/*` exigen sesión).
- **Responsive** (menú móvil), **modo oscuro** y estados de carga (skeleton).

## Probarlo

1. Entra en https://tienda-next.vercel.app y regístrate.
2. Añade productos al carrito y pulsa **Pagar**.
3. Tarjeta de prueba de Stripe: `4242 4242 4242 4242` · cualquier fecha futura · cualquier CVC.
4. El pedido aparece como **pagado** en *Mis pedidos*.

## Tecnologías

| Parte | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router, server y client components) |
| Estilos | Tailwind CSS 4 |
| Autenticación | NextAuth v4 (Credentials) |
| Pagos | Stripe Checkout |
| Estado global | React Context (carrito) |
| Despliegue | Vercel |

## Estructura

```
src/
├── app/            → páginas (cada carpeta es una ruta)
│   ├── productos/  → catálogo y detalle [id]
│   ├── categorias/[slug]/
│   ├── login/ · registro/
│   ├── cuenta/pedidos/
│   ├── admin/productos/   → CRUD de productos
│   ├── pago/exito · pago/cancelado
│   └── api/        → auth (NextAuth) y checkout
├── components/     → Cabecera, TarjetaProducto, CarritoDrawer, BotonPagar…
├── contexts/       → CarritoContext
├── lib/            → api.js (fetch a la API) y auth.js (NextAuth)
└── proxy.js        → protección de rutas
```

## Ejecutar en local

```bash
npm install
npm run dev        # http://localhost:3000
```

Variables en `.env.local`:

```
API_URL=http://localhost:4000/api
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=...
GOOGLE_CLIENT_ID=        # opcional: si se rellenan, aparece el botón "Continuar con Google"
GOOGLE_CLIENT_SECRET=
```

## Notas

- **Login con Google:** está implementado en `src/lib/auth.js`, pero desactivado en producción porque no se configuró Google Cloud. El botón solo aparece si existen las claves.
- Fotos de producto de Wikimedia Commons con licencia libre — créditos en `public/img/CREDITOS.md`.

## Dificultades y lo que aprendí

Me lió un poco **Tailwind** al principio: las clases larguísimas en el `className` me costaba leerlas y no sabía bien qué hacía cada una (`px-4`, `gap-6`, `rounded-xl`…). También tardé en pillar los prefijos: que `sm:`, `md:` y `lg:` aplican el estilo **a partir** de ese tamaño de pantalla (por eso `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` pasa de 1 a 4 columnas), y que `dark:` y `hover:` funcionan igual pero para el modo oscuro y el ratón encima. Al final lo que me sirvió fue leer las clases como frases: `flex gap-3 flex-wrap` = "ponlos en fila, separados, y si no caben, salta de línea".

Otras cosas pequeñas que me hicieron perder tiempo:

- Poner **comentarios `{/* */}` justo después de `return (`** daba error de sintaxis: el JSX tiene que empezar por una etiqueta.
- Distinguir **componentes de servidor y de cliente**: si uso `useState`, `useEffect` o eventos (`onClick`) necesito `'use client'`, y un componente de cliente no puede ser `async`.
- Que las variables de entorno sin `NEXT_PUBLIC_` **no llegan al navegador**, por eso hay dos (`API_URL` y `NEXT_PUBLIC_API_URL`).
