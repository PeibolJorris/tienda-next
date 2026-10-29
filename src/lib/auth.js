// NextAuth tiene "providers": cada uno es una forma de iniciar sesión.
// GoogleProvider: login con cuenta de Google (OAuth 2.0).
// CredentialsProvider: login con email y contraseña (nuestro propio formulario).
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

// ✏️ ADAPTADO A NUESTRA API: el curso esperaba que /auth/login devolviera
// { datos: { id, nombre, email, rol, token } }, pero nuestra API devuelve
// { datos: { usuario: { id, nombre, email, rol }, acceso, refresco } }.
// Esta función convierte nuestra respuesta en el usuario que NextAuth necesita.
function aUsuarioNextAuth(datos) {
  return {
    id: datos.usuario.id,
    name: datos.usuario.nombre,
    email: datos.usuario.email,
    rol: datos.usuario.rol,
    accessToken: datos.acceso, // el JWT de NUESTRA API (para Authorization: Bearer)
  };
}

export const authOptions = {
  providers: [
    // Provider de Google: el usuario pulsa "Continuar con Google",
    // se redirige a Google, y vuelve con un token que identifica al usuario.
    // Solo se activa si las claves de Google están en .env.local (si no, no hay botón).
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })]
      : []),
    // Provider de credenciales: email + contraseña. NextAuth llama a authorize()
    // con lo que el usuario escribió en el formulario. Si devuelve un objeto, es login
    // exitoso. Si devuelve null, las credenciales son incorrectas.
    CredentialsProvider({
      name: 'Credenciales',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials) {
        const r = await fetch(`${process.env.API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: credentials.email, password: credentials.password }),
        });
        if (!r.ok) return null;
        const { datos } = await r.json();
        return aUsuarioNextAuth(datos);
      },
    }),
  ],
  // Callbacks: funciones que NextAuth llama en momentos clave del flujo.
  // jwt: se ejecuta cada vez que se crea o actualiza el token JWT de sesión.
  // session: se ejecuta cada vez que alguien lee la sesión (getServerSession, useSession).
  callbacks: {
    // jwt: aquí añadimos datos personalizados al token (id, rol, accessToken de nuestra API)
    async jwt({ token, user, account }) {
      if (account?.provider === 'google') {
        // Registrar/login en nuestra API con el token de Google
        const r = await fetch(`${process.env.API_URL}/auth/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: account.id_token }),
        });
        const { datos } = await r.json();
        const u = aUsuarioNextAuth(datos);
        token.id = u.id;
        token.rol = u.rol;
        token.accessToken = u.accessToken;
      } else if (user) {
        token.id = user.id;
        token.rol = user.rol;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    // session: copia datos del token JWT a la sesión que ven los componentes.
    // Sin esto, useSession() solo tendría name y email, no id ni rol.
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.rol = token.rol;
      session.accessToken = token.accessToken;  // Para llamar a la API con Authorization: Bearer
      return session;
    },
  },
  // Redirige a /login cuando se necesita autenticación (en lugar de la página por defecto de NextAuth)
  pages: { signIn: '/login' },
  // Secreto para firmar las cookies — diferente al JWT_SECRET de la API Express
  secret: process.env.NEXTAUTH_SECRET,
};
