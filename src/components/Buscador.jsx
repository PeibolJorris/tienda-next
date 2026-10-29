'use client';
// EJERCICIO 2 — Buscador con debounce
// Es de CLIENTE porque usa useState, useRef, eventos (onChange) y hooks de navegación.
import { useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export function Buscador() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Input controlado: arranca con lo que ya diga la URL (?buscar=…) o vacío.
  const [texto, setTexto] = useState(searchParams.get('buscar') ?? '');

  // useRef: caja que sobrevive entre redibujados para guardar el temporizador y poder cancelarlo.
  const temporizador = useRef(null);

  function manejarCambio(e) {
    const valor = e.target.value;
    setTexto(valor);

    // DEBOUNCE: cancelo la búsqueda pendiente y programo otra para dentro de 400 ms.
    // Si el usuario sigue tecleando, se cancela otra vez → solo se busca cuando para.
    clearTimeout(temporizador.current);
    temporizador.current = setTimeout(() => {
      if (valor.trim()) {
        // encodeURIComponent: prepara el texto para la URL (espacios, &, ñ…)
        router.push(`/productos?buscar=${encodeURIComponent(valor.trim())}`);
      } else {
        router.push('/productos'); // input vacío → catálogo sin filtro
      }
    }, 400);
  }

  return (
    <input
      type="search"
      value={texto}
      onChange={manejarCambio}
      placeholder="Buscar productos…"
      className="w-full px-4 py-2 border rounded-lg mb-6 dark:bg-gray-800 dark:border-gray-700"
    />
  );
}
