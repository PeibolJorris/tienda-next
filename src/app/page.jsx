// Este archivo ya existe — borra TODO su contenido y pon esto.
// Es un server component (no tiene 'use client'): los datos se cargan en el servidor.
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { TarjetaProducto } from '@/components/TarjetaProducto';

export const metadata = {
  title: 'TiendaNext — Tu tienda online',
  description: 'Ecommerce con Next.js, Tailwind y Stripe',
};

export default async function PaginaInicio() {
  // Traemos los productos destacados desde la API
  const { datos: destacados } = await apiFetch('/productos?destacado=true');
  // También traemos las categorías para mostrar enlaces rápidos
  const { datos: categorias } = await apiFetch('/categorias');

  return (
    <main>
      {/* Hero: lo primero que ve el usuario. Fondo oscuro, texto grande, botón de acción. */}
      <section className="bg-gradient-to-r from-emerald-700 to-emerald-500 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-black">TiendaNext</h1>
          <p className="mt-4 text-xl text-emerald-100">
            Tu tienda online con Next.js, Tailwind y Stripe
          </p>
          <Link href="/productos"
                className="mt-8 inline-block px-8 py-3 bg-white text-emerald-700 font-bold rounded-lg hover:bg-emerald-50 transition">
            Ver catálogo
          </Link>
        </div>
      </section>

      {/* Categorías: enlaces rápidos para filtrar */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-4">Categorías</h2>
        <div className="flex gap-3 flex-wrap">
          {categorias.map(c => (
            <Link key={c.id} href={`/categorias/${c.slug}`}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-emerald-100 transition">
              {c.nombre}
            </Link>
          ))}
        </div>
      </section>

      {/* Productos destacados: los que tienen destacado = true en la BD */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold mb-6">Productos destacados</h2>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {destacados.map(p => <TarjetaProducto key={p.id} producto={p} />)}
        </div>
      </section>
    </main>
  );
}
