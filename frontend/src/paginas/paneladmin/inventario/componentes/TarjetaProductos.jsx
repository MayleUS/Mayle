import React from "react";

function TarjetaProductos({ producto, togglePublicado, eliminarProducto }) {
  const stockTotal = producto.colores?.reduce(
    (total, c) =>
      total + (c.tallas?.reduce((a, t) => a + (t.stock || 0), 0) || 0),
    0
  );

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-md">
      {/* Estado */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-semibold text-gray-800 text-sm line-clamp-1">
          {producto.nombre}
        </h2>
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-md ${
            producto.publicado
              ? "bg-green-600 text-white"
              : "bg-gray-300 text-gray-700"
          }`}
        >
          {producto.publicado ? "Publicado" : "Borrador"}
        </span>
      </div>

      {/* Info */}
      <div className="space-y-1 text-sm text-gray-700 flex-grow">
        <div className="text-xs text-gray-500">
          SKU: {producto.sku || producto._id}
        </div>
        <div className="text-xs text-gray-500">
          Categorías: {producto.categoria?.join(", ") || "-"}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">Precio:</span>
          <span>${producto.precioConDescuento || producto.precio}</span>
          {producto.descuentoPorcentaje > 0 && (
            <span className="text-green-600 font-semibold text-xs">
              -{producto.descuentoPorcentaje}%
            </span>
          )}
        </div>
        <div className="text-xs text-gray-600">
          Variantes: {producto.colores?.length || 0} | Stock: {stockTotal}
        </div>
      </div>

      {/* Botones */}
      <div className="mt-4 flex justify-between gap-2">
        {/* Botón Despublicar / Publicar */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // evita que el click llegue al motion.div padre
            togglePublicado();
          }}
          className="flex-1 bg-slate-800 text-white px-3 py-1 rounded-md text-xs 
                     hover:bg-slate-700 hover:shadow-md transition-all duration-200"
        >
          {producto.publicado ? "Despublicar" : "Publicar"}
        </button>

        {/* Botón Eliminar */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // evita que el click llegue al motion.div padre
            eliminarProducto(producto._id);
          }}
          className="flex-1 border border-red-600 text-red-600 px-3 py-1 rounded-md text-xs 
                     hover:bg-red-50 hover:shadow-sm transition-all duration-200"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}

export default React.memo(TarjetaProductos);
