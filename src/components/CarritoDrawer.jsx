'use client';
import { useCarrito } from '@/contexts/CarritoContext';
import { BotonPagar } from '@/components/BotonPagar';

export function CarritoDrawer({ abierto, cerrar }) {
  const { items, quitar, actualizarCantidad, total } = useCarrito();

  return (
    <div className={`fixed inset-0 z-50 ${abierto ? '' : 'pointer-events-none'}`}>
      {/* Fondo oscuro */}
      <div className={`absolute inset-0 bg-black/40 transition ${abierto ? 'opacity-100' : 'opacity-0'}`}
           onClick={cerrar} />

      {/* Panel lateral */}
      <aside className={`absolute right-0 top-0 h-full w-80 bg-white dark:bg-gray-900 shadow-xl p-6 overflow-y-auto
                         transition-transform ${abierto ? '' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Carrito</h2>
          <button onClick={cerrar} aria-label="Cerrar" className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        {items.length === 0
          ? <p className="text-gray-400">Carrito vacío</p>
          : items.map(item => (
            <div key={item.id} className="flex justify-between items-center py-3 border-b dark:border-gray-700">
              <div>
                <p className="font-medium">{item.nombre}</p>
                <p className="text-sm text-gray-500">${item.precio} × {item.cantidad}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                        className="w-7 h-7 rounded bg-gray-100 dark:bg-gray-800">−</button>
                <span>{item.cantidad}</span>
                <button onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                        className="w-7 h-7 rounded bg-gray-100 dark:bg-gray-800">+</button>
                <button onClick={() => quitar(item.id)}
                        className="text-red-400 text-xs ml-2">Quitar</button>
              </div>
            </div>
          ))}
        <p className="mt-4 text-lg font-bold">Total: ${total.toFixed(2)}</p>
        <BotonPagar />
      </aside>
    </div>
  );
}
