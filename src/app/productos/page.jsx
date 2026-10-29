import { apiFetch } from '@/lib/api';
import { TarjetaProducto } from '@/components/TarjetaProducto';
import { Buscador } from '@/components/Buscador'; // ejercicio 2

// metadata se exporta como objeto estático → Next.js lo usa para el <title> y las meta tags
export const metadata = { title: 'Catálogo — TiendaNext' };

// Esta función es async → se ejecuta en el servidor, NO en el navegador.
// searchParams viene de la URL: /productos?buscar=teclado → { buscar: "teclado" }
export default async function PaginaProductos({ searchParams }) {
  const params = await searchParams;
  // Convierte { buscar: "teclado", categoria: "electronica" } → "buscar=teclado&categoria=electronica"
  const query = new URLSearchParams(params).toString();
  const { datos } = await apiFetch(`/productos?${query}`);

  // ✏️ Igual que en la tarjeta: este comentario iba dentro del return → lo saco aquí.
  // max-w-6xl: ancho máximo de 1152px, centrado con mx-auto.
  // grid gap-6: cuadrícula con 24px entre tarjetas.
  // grid-cols-1 → móvil: 1 columna · sm:grid-cols-2 → tablet (≥640px): 2 · lg:grid-cols-4 → escritorio (≥1024px): 4
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Catálogo</h1>
      <Buscador />
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {datos.map(p => <TarjetaProducto key={p.id} producto={p} />)}
      </div>
    </main>
  );
}
