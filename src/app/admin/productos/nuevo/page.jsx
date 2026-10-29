'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function NuevoProducto() {
  const { data: session } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({ nombre: '', descripcion: '', precio: '', imagen: '', stock: '', categoria_id: '' });

  function cambiar(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

  async function handleSubmit(e) {
    e.preventDefault();
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/productos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({ ...form, precio: Number(form.precio), stock: Number(form.stock) }),
    });
    router.push('/admin/productos');
    router.refresh();
  }

  const estilo = 'w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700';

  return (
    <main className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Nuevo producto</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={cambiar}
               required className={estilo} />
        <textarea name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={cambiar}
                  className={estilo} />
        <input name="precio" type="number" step="0.01" placeholder="Precio" value={form.precio}
               onChange={cambiar} required className={estilo} />
        <input name="imagen" placeholder="URL imagen" value={form.imagen} onChange={cambiar}
               className={estilo} />
        <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={cambiar}
               required className={estilo} />
        <button type="submit"
                className="w-full py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
          Crear producto
        </button>
      </form>
    </main>
  );
}
