'use client';
// EJERCICIO 3 — Página de registro
// Cliente: formulario con useState, eventos y signIn (todo eso vive en el navegador).
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

export default function PaginaRegistro() {
  // Un solo estado-objeto para los 4 campos (como el form de "nuevo producto").
  const [form, setForm] = useState({ nombre: '', email: '', password: '', repetir: '' });
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  // [e.target.name] = clave calculada: actualiza el campo cuyo name coincide.
  function cambiar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    // 1. Validar en el navegador ANTES de molestar al servidor.
    if (form.password !== form.repetir) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setEnviando(true);
    try {
      // 2. Crear la cuenta en nuestra API.
      const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: form.nombre, email: form.email, password: form.password }),
      });

      // 3. Si la API dice que no (ej. 409 "Ese email ya está registrado"), mostramos SU mensaje.
      if (!r.ok) {
        const { error: mensaje } = await r.json();
        setError(mensaje ?? 'No se pudo crear la cuenta');
        return;
      }

      // 4. Registro correcto → iniciamos sesión automáticamente con las mismas credenciales.
      const res = await signIn('credentials', {
        email: form.email, password: form.password, redirect: false,
      });
      if (res?.error) setError('Cuenta creada, pero no se pudo iniciar sesión. Prueba en /login');
      else window.location.href = '/';
    } catch {
      setError('No se pudo conectar con el servidor');
    } finally {
      setEnviando(false); // pase lo que pase, el botón vuelve a estar disponible
    }
  }

  const estiloInput = 'w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700';

  return (
    <main className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-6">Crear cuenta</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={cambiar}
               required className={estiloInput} />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={cambiar}
               required className={estiloInput} />
        <input name="password" type="password" placeholder="Contraseña (mín. 6)" value={form.password}
               onChange={cambiar} required minLength={6} className={estiloInput} />
        <input name="repetir" type="password" placeholder="Repite la contraseña" value={form.repetir}
               onChange={cambiar} required className={estiloInput} />
        <button type="submit" disabled={enviando}
                className="w-full py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50">
          {enviando ? 'Creando cuenta…' : 'Registrarme'}
        </button>
      </form>

      <p className="mt-6 text-sm text-center text-gray-500">
        ¿Ya tienes cuenta? <Link href="/login" className="text-emerald-600 underline">Inicia sesión</Link>
      </p>
    </main>
  );
}
