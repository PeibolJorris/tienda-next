import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

// NextAuth() devuelve un handler que maneja todas las rutas de autenticación:
// GET /api/auth/session → devuelve la sesión actual
// POST /api/auth/signin/credentials → login con email/password
// GET /api/auth/signin/google → redirige a Google
// GET /api/auth/callback/google → Google redirige aquí después del login
// POST /api/auth/signout → cierra sesión
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
