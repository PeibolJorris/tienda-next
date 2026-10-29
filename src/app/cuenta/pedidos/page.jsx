import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Protegida por middleware.js: si no hay sesión, ni siquiera llega aquí (redirige a /login).
export default async function MisPedidos() {
  const session = await getServerSession(authOptions);
  const r = await fetch(`${process.env.API_URL}/pedidos`, {
    headers: { Authorization: `Bearer ${session.accessToken}` },
    cache: 'no-store',
  });
  const { datos: pedidos = [] } = r.ok ? await r.json() : {};

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mis pedidos</h1>
      {pedidos.length === 0 && <p className="text-gray-500">Todavía no tienes pedidos.</p>}
      {pedidos.map(p => (
        <div key={p.id} className="border rounded-lg p-4 mb-4 dark:border-gray-700">
          <div className="flex justify-between">
            <span className="font-semibold">Pedido #{p.id}</span>
            <span className="text-sm text-gray-500">{new Date(p.creado_en).toLocaleDateString()}</span>
          </div>
          <p className="text-emerald-600 font-bold">${p.total} — {p.estado}</p>
        </div>
      ))}
    </main>
  );
}
