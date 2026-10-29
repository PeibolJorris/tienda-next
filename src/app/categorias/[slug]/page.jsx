import Link from 'next/link';
import { notFound } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { TarjetaProducto } from '@/components/TarjetaProducto';

// EJERCICIO 1 — Página de categoría
// La carpeta se llama [slug] → /categorias/electronica llega aquí con params.slug = "electronica".
// Un "slug" es el nombre preparado para la URL: minúsculas, sin tildes ni espacios.

// Busca la categoría por su slug en la lista de categorías de la API.
async function buscarCategoria(slug) {
  const { datos: categorias } = await apiFetch('/categorias');
  return categorias.find((c) => c.slug === slug);
}

// generateMetadata: el título de la pestaña depende de la categoría → función (no objeto fijo).
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const categoria = await buscarCategoria(slug);
  if (!categoria) return { title: 'Categoría no encontrada — TiendaNext' };
  return {
    title: `${categoria.nombre} — TiendaNext`,
    description: `Productos de la categoría ${categoria.nombre}`,
  };
}

export default async function PaginaCategoria({ params }) {
  const { slug } = await params;

  // 1. Traemos TODAS las categorías (las necesitamos para el selector de arriba)
  //    y buscamos la actual. Si no existe → 404 (guardia).
  const { datos: categorias } = await apiFetch('/categorias');
  const categoria = categorias.find((c) => c.slug === slug);
  if (!categoria) notFound();

  // 2. Pedimos a la API solo los productos de esa categoría (la API filtra por el slug).
  const { datos: productos } = await apiFetch(`/productos?categoria=${encodeURIComponent(slug)}`);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Selector de categorías: un enlace por categoría.
          La actual se pinta en verde (c.slug === slug) para saber dónde estás. */}
      <nav className="flex gap-2 flex-wrap mb-6">
        <Link href="/productos"
              className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition">
          Todos
        </Link>
        {categorias.map((c) => (
          <Link key={c.id} href={`/categorias/${c.slug}`}
                className={`px-4 py-2 rounded-full transition ${
                  c.slug === slug
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-emerald-100 dark:hover:bg-emerald-900'
                }`}>
            {c.nombre}
          </Link>
        ))}
      </nav>

      <h1 className="text-3xl font-bold mb-6">{categoria.nombre}</h1>

      {productos.length === 0 ? (
        <p className="text-gray-500">Todavía no hay productos en esta categoría.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {productos.map((p) => <TarjetaProducto key={p.id} producto={p} />)}
        </div>
      )}
    </main>
  );
}
