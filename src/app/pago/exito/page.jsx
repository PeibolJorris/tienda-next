import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// EJERCICIO 5 — Página de éxito con detalle del pedido.
// Stripe nos devuelve aquí con /pago/exito?session_id=cs_test_... (lo pusimos en success_url).
export default async function PagoExito({ searchParams }) {
  const { session_id } = await searchParams;
  const session = await getServerSession(authOptions);

  // Pedimos a la API el pedido asociado a esa sesión de Stripe.
  // Puede no existir todavía: el pedido lo crea el WEBHOOK de Stripe, que llega unos segundos después.
  let pedido = null;
  if (session_id && session) {
    const r = await fetch(`${process.env.API_URL}/pedidos/sesion/${encodeURIComponent(session_id)}`, {
      headers: { Authorization: `Bearer ${session.accessToken}` },
      cache: 'no-store',
    });
    if (r.ok) pedido = (await r.json()).datos;
  }

  return (
    <main className="max-w-md mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold text-emerald-600">Pago exitoso</h1>
      <p className="mt-4 text-gray-600 dark:text-gray-300">Tu pedido ha sido confirmado.</p>

      {pedido ? (
        <div className="mt-8 text-left border rounded-xl p-4 dark:border-gray-700">
          <h2 className="font-bold mb-3">Pedido #{pedido.id}</h2>
          {pedido.lineas?.map((l) => (
            <div key={l.producto_id} className="flex justify-between py-1 text-sm">
              <span>{l.nombre} × {l.cantidad}</span>
              <span>${(Number(l.precio_unit) * l.cantidad).toFixed(2)}</span>
            </div>
          ))}
          <p className="mt-3 pt-3 border-t font-bold flex justify-between dark:border-gray-700">
            <span>Total</span><span>${Number(pedido.total).toFixed(2)}</span>
          </p>
        </div>
      ) : (
        <p className="mt-6 text-sm text-gray-400">
          Estamos registrando tu pedido. Si no aparece, recarga en unos segundos.
        </p>
      )}

      <Link href="/cuenta/pedidos"
            className="mt-6 inline-block px-6 py-3 bg-emerald-600 text-white rounded-lg">
        Ver mis pedidos
      </Link>
    </main>
  );
}
