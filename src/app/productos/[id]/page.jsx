import { notFound } from 'next/navigation';  // Muestra la página 404 de Next.js
import { apiFetch } from '@/lib/api';
import { BotonAgregar } from '@/components/BotonAgregar'; // Componente de CLIENTE (parte 4)

// generateMetadata se ejecuta en el servidor ANTES de renderizar la página.
// Next.js llama a esta función para generar las meta tags del <head>.
export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const { datos: p } = await apiFetch(`/productos/${id}`);
    return { title: `${p.nombre} — TiendaNext`, description: p.descripcion };
  } catch {
    return { title: 'Producto no encontrado' };
  }
}

// La carpeta se llama [id] → /productos/3 llega aquí con params.id = "3"
export default async function PaginaProducto({ params }) {
  const { id } = await params;
  let producto;
  try {
    const res = await apiFetch(`/productos/${id}`);
    producto = res.datos;
  } catch { notFound(); }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <img src={producto.imagen} alt={producto.nombre}
             className="w-full rounded-xl" />
        <div>
          <h1 className="text-3xl font-bold">{producto.nombre}</h1>
          <p className="text-2xl font-bold text-emerald-600 mt-2">${producto.precio}</p>
          <p className="mt-4 text-gray-600">{producto.descripcion}</p>
          <p className="mt-2 text-sm text-gray-400">Stock: {producto.stock} unidades</p>
          <BotonAgregar producto={producto} />
        </div>
      </div>
    </main>
  );
}
