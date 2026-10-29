'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useCarrito } from '@/contexts/CarritoContext';

export function BotonPagar() {
  const { totalItems } = useCarrito();
  const { data: session } = useSession();
  const [error, setError] = useState('');

  async function pagar() {
    setError('');
    // Sin sesión no se puede pagar: el carrito que cobra Stripe es el de la API (de tu usuario).
    if (!session) { window.location.href = '/login'; return; }
    const r = await fetch('/api/checkout', { method: 'POST' });
    const data = await r.json();
    if (data.url) window.location.href = data.url;  // nos vamos a la página de pago de Stripe
    else setError(data.error ?? 'No se pudo iniciar el pago');
  }

  if (!totalItems) return null;

  return (
    <>
      <button onClick={pagar}
              className="w-full py-3 mt-4 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400">
        {session ? 'Pagar con Stripe' : 'Inicia sesión para pagar'}
      </button>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </>
  );
}
