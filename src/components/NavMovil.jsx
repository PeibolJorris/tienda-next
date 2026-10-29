'use client';
import { useState } from 'react';
import Link from 'next/link';

export function NavMovil() {
  const [abierto, setAbierto] = useState(false);

  return (
    <>
      <button onClick={() => setAbierto(!abierto)}
              className="md:hidden p-2" aria-label="Menú">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeWidth={2}
                d={abierto ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>
      {abierto && (
        <nav className="md:hidden absolute top-16 left-0 w-full bg-white dark:bg-gray-900 shadow-lg p-4 flex flex-col gap-3 z-40">
          <Link href="/productos" onClick={() => setAbierto(false)}>Catálogo</Link>
          <Link href="/cuenta/pedidos" onClick={() => setAbierto(false)}>Mis pedidos</Link>
        </nav>
      )}
    </>
  );
}
