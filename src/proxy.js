// proxy.js (antes "middleware.js"): en Next 16 se llama proxy.
// Se ejecuta ANTES de cargar las rutas del matcher y comprueba si hay sesión de NextAuth.
// Si no hay sesión → redirige a /login.
import { withAuth } from 'next-auth/middleware';

// ✏️ El curso hacía: export { default } from 'next-auth/middleware';
// Next 16 no reconoce ese "re-export" y da error ("must export a function").
// Solución: creamos el protector con withAuth y lo envolvemos en una función nuestra.
const proteger = withAuth({ pages: { signIn: '/login' } });

export default function proxy(req, evento) {
  return proteger(req, evento);
}

// matcher: lista de rutas protegidas. :path* captura cualquier subruta.
// /cuenta/:path* protege /cuenta/pedidos, /cuenta/perfil, etc.
// /admin/:path* protege /admin/productos, /admin/productos/nuevo, etc.
export const config = {
  matcher: ['/cuenta/:path*', '/admin/:path*'],
};
