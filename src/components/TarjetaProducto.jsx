import Link from 'next/link';    // Navegación instantánea entre páginas (precarga)
import Image from 'next/image';  // Optimiza imágenes: WebP, lazy loading, resize automático

// ✏️ Este comentario estaba en la web DENTRO del return, antes del <Link> → error de sintaxis.
// Fuera del JSX los comentarios son con // (los {/* */} solo valen entre etiquetas).
// Link envuelve toda la tarjeta: al pulsar cualquier parte, navega al detalle.
// "group" es una clase Tailwind que permite aplicar estilos al padre cuando
// el hijo tiene hover — aquí lo usamos para hacer zoom en la imagen.
export function TarjetaProducto({ producto }) {
  return (
    <Link href={`/productos/${producto.id}`}
          className="group bg-white dark:bg-gray-900 rounded-xl shadow hover:shadow-lg transition overflow-hidden">
      {/* aspect-square: fuerza la imagen a ser cuadrada.
          fill: la imagen ocupa todo el contenedor (como background-size: cover).
          group-hover:scale-105: al hacer hover en la tarjeta, la imagen crece un 5%. */}
      <div className="aspect-square relative bg-gray-100 dark:bg-gray-800">
        <Image src={producto.imagen} alt={producto.nombre}
               fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
               className="object-cover group-hover:scale-105 transition" />
      </div>
      <div className="p-4">
        {/* truncate: si el nombre es muy largo, lo corta con "..." en vez de romper el layout */}
        <h3 className="font-semibold truncate text-gray-900 dark:text-gray-100">{producto.nombre}</h3>
        <p className="text-lg font-bold text-emerald-600">${producto.precio}</p>
      </div>
    </Link>
  );
}
