'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function BotonBorrar({ id }) {
  const { data: session } = useSession();
  const router = useRouter();

  async function borrar() {
    // Confirmar antes de borrar — evita borrar por error
    if (!confirm('¿Seguro que quieres eliminar este producto?')) return;

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/productos/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    // router.refresh() recarga los datos del server component sin recargar toda la página
    router.refresh();
  }

  return (
    <button onClick={borrar} className="text-red-500 text-sm hover:text-red-700">
      Borrar
    </button>
  );
}
