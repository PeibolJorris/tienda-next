'use client';  // Los contextos siempre son de cliente: usan useState y useEffect
import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';

// 1. Crear el contexto (un "canal" de datos que atraviesa el árbol de componentes)
const Ctx = createContext();
// 2. Hook personalizado para consumirlo: useCarrito() en vez de useContext(Ctx)
export const useCarrito = () => useContext(Ctx);

// La API devuelve filas { producto_id, nombre, precio, imagen, cantidad }.
// El carrito del navegador usa { id, nombre, precio, imagen, cantidad } → las traducimos.
function desdeApi(filas) {
  return filas.map((f) => ({
    id: f.producto_id,
    nombre: f.nombre,
    precio: Number(f.precio),
    imagen: f.imagen,
    cantidad: f.cantidad,
  }));
}

// EJERCICIO 4 — Sincronizar carrito al login/logout.
// Idea: SIN sesión → el carrito vive en localStorage (como en el curso).
//       CON sesión → el carrito vive en la API (tabla carrito_items), que es la que usa Stripe para cobrar.
export function CarritoProvider({ children }) {
  const { data: session, status } = useSession(); // status: 'loading' | 'authenticated' | 'unauthenticated'
  const [items, setItems] = useState([]);
  const token = session?.accessToken;

  // useRef = cajas que sobreviven entre redibujados SIN provocar redibujados.
  const estadoAnterior = useRef(status); // para saber si ACABA de cerrar sesión
  const cargado = useRef(false);         // para no pisar localStorage antes de haberlo leído

  // Llamada a la API del carrito con el token del usuario. Devuelve el carrito actualizado.
  async function api(ruta = '', opciones = {}) {
    const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/carrito${ruta}`, {
      ...opciones,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    });
    if (!r.ok) throw new Error('Error en el carrito');
    const { datos } = await r.json();
    return desdeApi(datos);
  }

  // A) Guardar en localStorage cada vez que cambia el carrito, SOLO si no hay sesión.
  // (Va ANTES que el efecto B a propósito: al cerrar sesión, B se ejecuta después y limpia.)
  useEffect(() => {
    if (cargado.current && status === 'unauthenticated') {
      localStorage.setItem('carrito', JSON.stringify(items));
    }
  }, [items, status]);

  // B) Reaccionar a los cambios de sesión.
  useEffect(() => {
    if (status === 'loading') return; // NextAuth aún no sabe si hay sesión → esperamos

    if (status === 'authenticated') {
      // AL INICIAR SESIÓN: subir lo que había en localStorage y cargar el carrito de la API.
      // Leemos y borramos localStorage ANTES de esperar nada: así, si el efecto se ejecuta
      // dos veces (StrictMode en desarrollo), la segunda vez ya no sube nada repetido.
      const locales = JSON.parse(localStorage.getItem('carrito') || '[]');
      localStorage.removeItem('carrito');
      (async () => {
        for (const i of locales) {
          await api('', { method: 'POST', body: JSON.stringify({ productoId: i.id, cantidad: i.cantidad }) });
        }
        setItems(await api());
      })().catch(console.error);
    } else if (estadoAnterior.current === 'authenticated') {
      // AL CERRAR SESIÓN: vaciamos el carrito en pantalla. Se queda guardado en la API
      // y vuelve la próxima vez que inicie sesión.
      localStorage.removeItem('carrito');
      setItems([]);
    } else {
      // SIN SESIÓN (al entrar en la web): cargamos el carrito guardado en el navegador.
      const guardado = localStorage.getItem('carrito');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (guardado) setItems(JSON.parse(guardado));
    }

    cargado.current = true;
    estadoAnterior.current = status;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // agregar: si el producto ya está en el carrito, incrementa cantidad.
  // Si no está, lo añade con cantidad 1.
  function agregar(producto) {
    if (token) {
      api('', { method: 'POST', body: JSON.stringify({ productoId: producto.id, cantidad: 1 }) })
        .then(setItems).catch(console.error);
      return;
    }
    setItems(prev => {
      const existe = prev.find(i => i.id === producto.id);
      if (existe) return prev.map(i =>
        i.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i
      );
      return [...prev, { ...producto, cantidad: 1 }];
    });
  }

  // quitar: elimina el producto del carrito completamente
  function quitar(id) {
    if (token) {
      api(`/${id}`, { method: 'DELETE' }).then(setItems).catch(console.error);
      return;
    }
    setItems(prev => prev.filter(i => i.id !== id));
  }

  // actualizarCantidad: si la cantidad baja a 0, lo quita del carrito
  function actualizarCantidad(id, cantidad) {
    if (cantidad < 1) return quitar(id);
    if (token) {
      api(`/${id}`, { method: 'PUT', body: JSON.stringify({ cantidad }) })
        .then(setItems).catch(console.error);
      return;
    }
    setItems(prev => prev.map(i => i.id === id ? { ...i, cantidad } : i));
  }

  // Valores calculados: total en dinero y total de unidades
  const total = items.reduce((s, i) => s + i.precio * i.cantidad, 0);
  const totalItems = items.reduce((s, i) => s + i.cantidad, 0);

  return (
    <Ctx.Provider value={{ items, agregar, quitar, actualizarCantidad, total, totalItems, setItems }}>
      {children}
    </Ctx.Provider>
  );
}
