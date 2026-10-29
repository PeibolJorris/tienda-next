// process.env.API_URL solo existe en el servidor de Next.js (no lleva NEXT_PUBLIC_).
// Es seguro poner aquí la URL de tu API privada.
const BASE = process.env.API_URL;

export async function apiFetch(ruta, opciones = {}) {
  // Construye la URL completa: "http://localhost:4000/api" + "/productos"
  const r = await fetch(`${BASE}${ruta}`, {
    // revalidate: 60 → cachea la respuesta 60 segundos.
    // Después de 60s, la siguiente petición trae datos frescos.
    // ...opciones permite que cada llamada sobreescriba esto si necesita (ej: cache: 'no-store')
    next: { revalidate: 60 },
    ...opciones,
  });
  if (!r.ok) throw new Error(`API error: ${r.status}`);
  return r.json(); // Parsea la respuesta JSON y la devuelve como objeto
}
