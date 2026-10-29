'use client';
// EJERCICIO 7 — Tema oscuro con Tailwind (igual que el ejercicio 9 de los ejercicios de Next).
// ✏️ El curso dice "tailwind.config.js → darkMode: 'class'", pero eso es Tailwind 3.
// En Tailwind 4 se hace en globals.css con: @custom-variant dark (&:where(.dark, .dark *));
import { useState, useEffect } from 'react';

export function BotonTema() {
  const [oscuro, setOscuro] = useState(false);

  // Al montar: leer la preferencia guardada.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (localStorage.getItem('tema') === 'oscuro') setOscuro(true);
  }, []);

  // Cada vez que cambia: poner/quitar la clase dark en <html> y guardarlo.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', oscuro);
    localStorage.setItem('tema', oscuro ? 'oscuro' : 'claro');
  }, [oscuro]);

  return (
    <button onClick={() => setOscuro(!oscuro)} aria-label="Cambiar tema" className="text-xl">
      {oscuro ? '☀️' : '🌙'}
    </button>
  );
}
