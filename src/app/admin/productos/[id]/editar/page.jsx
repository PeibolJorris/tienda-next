'use client';
// EJERCICIO 6 — Formulario de editar producto.
// Cliente: carga los datos al montar (useEffect), formulario con useState y envío con PUT.
import { useState, useEffect, use } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function EditarProducto({ params }) {
  // En un componente CLIENTE no hay await → use() saca el id de la promesa params.
  const { id } = use(params);
  const { data: session } = useSession();
  const router = useRouter();
  const [form, setForm] = useState(null); // null = todavía cargando
  const [error, setError] = useState('');

  // 1. Al montar (y si cambia el id): pedir el producto y rellenar el formulario.
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/productos/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error('Producto no encontrado');
        return r.json();
      })
      .then(({ datos: p }) =>
        // Pre-rellenamos con los valores actuales (?? '' para no meter null en los inputs)
        setForm({
          nombre: p.nombre ?? '',
          descripcion: p.descripcion ?? '',
          precio: p.precio ?? '',
          imagen: p.imagen ?? '',
          stock: p.stock ?? '',
          categoria_id: p.categoria_id ?? '',
        })
      )
      .catch((e) => setError(e.message));
  }, [id]);

  function cambiar(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

  // 2. Al enviar: PUT con los datos nuevos y volver a la lista.
  async function handleSubmit(e) {
    e.preventDefault();
    const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/productos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({ ...form, precio: Number(form.precio), stock: Number(form.stock) }),
    });
    if (!r.ok) {
      const { error: mensaje } = await r.json();
      setError(mensaje ?? 'No se pudo guardar');
      return;
    }
    router.push('/admin/productos');
    router.refresh(); // que la lista del admin se vuelva a pedir con los datos nuevos
  }

  if (error && !form) return <main className="max-w-lg mx-auto px-4 py-8 text-red-500">{error}</main>;
  if (!form) return <main className="max-w-lg mx-auto px-4 py-8 animate-pulse text-gray-400">Cargando…</main>;

  const estilo = 'w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700';

  return (
    <main className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Editar producto #{id}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}
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
          Guardar cambios
        </button>
      </form>
    </main>
  );
}
