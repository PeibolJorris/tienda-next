import { apiFetch } from '@/lib/api';
import Link from 'next/link';
import { BotonBorrar } from '@/components/BotonBorrar';

export default async function AdminProductos() {
  // cache: 'no-store' → siempre datos frescos (si no, tras borrar/editar verías la lista vieja 60 s)
  const { datos } = await apiFetch('/productos', { cache: 'no-store' });

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin — Productos</h1>
        <Link href="/admin/productos/nuevo"
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg">+ Nuevo</Link>
      </div>
      <table className="w-full text-left">
        <thead><tr className="border-b dark:border-gray-700">
          <th className="py-2">Nombre</th><th>Precio</th><th>Stock</th><th></th>
        </tr></thead>
        <tbody>
          {datos.map(p => (
            <tr key={p.id} className="border-b dark:border-gray-700">
              <td className="py-2">{p.nombre}</td>
              <td>${p.precio}</td>
              <td>{p.stock}</td>
              <td className="flex gap-2 py-2">
                <Link href={`/admin/productos/${p.id}/editar`}
                      className="text-blue-500 text-sm">Editar</Link>
                <BotonBorrar id={p.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
