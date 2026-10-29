'use client';  // Necesario: useState, signIn, eventos del navegador
import { signIn, getProviders } from 'next-auth/react';  // Funciones de autenticación para el cliente
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PaginaLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [hayGoogle, setHayGoogle] = useState(false);

  // Preguntamos a NextAuth qué proveedores están activos (Google solo si hay claves)
  useEffect(() => {
    getProviders().then(p => setHayGoogle(Boolean(p?.google)));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await signIn('credentials', {
      email, password, redirect: false,
    });
    if (res?.error) setError('Email o contraseña incorrectos');
    else window.location.href = '/';
  }

  return (
    <main className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-6">Iniciar sesión</h1>

      {hayGoogle && (
        <>
          <button onClick={() => signIn('google', { callbackUrl: '/' })}
                  className="w-full py-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 mb-6">
            Continuar con Google
          </button>
          <div className="text-center text-gray-400 mb-6">— o —</div>
        </>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input type="email" placeholder="Email" value={email}
               onChange={e => setEmail(e.target.value)} required
               className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
        <input type="password" placeholder="Contraseña" value={password}
               onChange={e => setPassword(e.target.value)} required
               className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
        <button type="submit"
                className="w-full py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
          Entrar
        </button>
      </form>

      <p className="mt-6 text-sm text-center text-gray-500">
        ¿No tienes cuenta? <Link href="/registro" className="text-emerald-600 underline">Regístrate</Link>
      </p>
    </main>
  );
}
