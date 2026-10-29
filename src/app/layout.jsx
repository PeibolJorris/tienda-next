import './globals.css';
import { Proveedores } from '@/components/Proveedores';
import { Cabecera } from '@/components/Cabecera';

export const metadata = { title: 'TiendaNext', description: 'Ecommerce con Next.js' };

// El layout sigue siendo de SERVIDOR: los providers (cliente) van en Proveedores.jsx.
// suppressHydrationWarning: BotonTema añade la clase "dark" a <html> en el navegador;
// así React no avisa de que <html> no coincide con lo que mandó el servidor.
export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen">
        <Proveedores>
          <Cabecera />
          {children}
        </Proveedores>
      </body>
    </html>
  );
}
