'use client';
// Componente cliente que envuelve los providers (la "regleta").
// El layout sigue siendo de servidor: solo esto es cliente.
import { SessionProvider } from 'next-auth/react';
import { CarritoProvider } from '@/contexts/CarritoContext';

export function Proveedores({ children }) {
  return (
    <SessionProvider>
      <CarritoProvider>{children}</CarritoProvider>
    </SessionProvider>
  );
}
