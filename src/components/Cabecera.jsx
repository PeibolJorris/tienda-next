'use client';
// Cabecera de la tienda (no viene en el curso como archivo: aquí juntamos las piezas que
// el curso crea sueltas — MenuUsuario, CarritoDrawer, NavMovil y BotonTema).
// Es cliente porque guarda en useState si el carrito está abierto.
import { useState } from 'react';
import Link from 'next/link';
import { useCarrito } from '@/contexts/CarritoContext';
import { MenuUsuario } from '@/components/MenuUsuario';
import { CarritoDrawer } from '@/components/CarritoDrawer';
import { NavMovil } from '@/components/NavMovil';
import { BotonTema } from '@/components/BotonTema';

export function Cabecera() {
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const { totalItems } = useCarrito();

  return (
    <header className="relative bg-white dark:bg-gray-900 border-b dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <NavMovil />
          <Link href="/" className="text-xl font-black text-emerald-600">TiendaNext</Link>
        </div>

        {/* hidden md:flex → oculto en móvil (ahí está NavMovil), visible desde 768px */}
        <nav className="hidden md:flex gap-6 text-sm">
          <Link href="/productos" className="hover:text-emerald-600">Catálogo</Link>
          <Link href="/cuenta/pedidos" className="hover:text-emerald-600">Mis pedidos</Link>
        </nav>

        <div className="flex items-center gap-4">
          <BotonTema />
          <MenuUsuario />
          <button onClick={() => setCarritoAbierto(true)} className="relative text-2xl" aria-label="Abrir carrito">
            🛒
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      <CarritoDrawer abierto={carritoAbierto} cerrar={() => setCarritoAbierto(false)} />
    </header>
  );
}
