import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// route.js = endpoint de API dentro de Next (devuelve JSON, no una página).
// Se ejecuta en el SERVIDOR: aquí podemos leer la sesión con seguridad.
export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: 'No autenticado' }, { status: 401 });

  const r = await fetch(`${process.env.API_URL}/stripe/crear-sesion`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.accessToken}`,
    },
  });
  const data = await r.json();
  return Response.json(data, { status: r.status });
}
