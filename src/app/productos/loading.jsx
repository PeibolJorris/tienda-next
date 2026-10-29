import { Cargando } from '@/components/Cargando';

// loading.jsx: Next lo enseña solo mientras productos/page.jsx espera a la API.
export default function CargandoCatalogo() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="h-9 w-40 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-6" />
      <Cargando filas={8} />
    </main>
  );
}
