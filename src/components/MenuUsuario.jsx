'use client';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export function MenuUsuario() {
  const { data: session } = useSession();

  if (!session) return <Link href="/login" className="text-sm">Iniciar sesión</Link>;

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm">{session.user.name}</span>
      {session.user.rol === 'admin' &&
        <Link href="/admin/productos" className="text-xs text-emerald-500">Admin</Link>}
      <button onClick={() => signOut()} className="text-xs text-gray-400 hover:text-red-400">Salir</button>
    </div>
  );
}
