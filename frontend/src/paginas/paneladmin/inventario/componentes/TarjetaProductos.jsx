import React from "react";
import { Star } from "lucide-react";

function TarjetaProductos({
  producto,
  togglePublicado,
  eliminarProducto,
  toggleGaleriaPrincipal,
}) {
  const stockTotal = producto.colores?.reduce(
    (total, c) =>
      total + (c.tallas?.reduce((a, t) => a + (t.stock || 0), 0) || 0),
    0
  );

  const enInicio = producto.galeriaPrincipal;

  return (
    <div className="relative bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-md">

      {/* 🔥 ESTADO + EN INICIO */}
      <div className="flex justify-end gap-2 mb-2">
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-md ${
            producto.publicado
              ? "bg-green-600 text-white"
              : "bg-gray-300 text-gray-700"
          }`}
        >
          {producto.publicado ? "Publicado" : "Borrador"}
        </span>

        {enInicio && (
          <span className="flex items-center gap-1 px-2 py-1 text-xs font-bold rounded-full bg-yellow-400 text-yellow-900 shadow">
            <Star size={12} />
            En inicio
          </span>
        )}
      </div>

      {/* Nombre */}
      <h2 className="font-semibold text-gray-800 text-sm line-clamp-1 mb-2">
        {producto.nombre}
      </h2>

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
      <div className="mt-4 flex flex-col gap-2">

        {/* 🏠 BOTÓN INICIO unificado colores */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleGaleriaPrincipal();
          }}
          className={`w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all
            ${
              enInicio
                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
            }`}
        >
          <Star size={14} />
          {enInicio ? "Quitar del inicio" : "Mostrar en inicio"}
        </button>

        <div className="flex gap-2">
          {/* Publicar */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePublicado();
            }}
            className="flex-1 bg-slate-800 text-white px-3 py-1 rounded-md text-xs 
                       hover:bg-slate-700 transition-all"
          >
            {producto.publicado ? "Despublicar" : "Publicar"}
          </button>

          {/* Eliminar */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              eliminarProducto(producto._id);
            }}
            className="flex-1 border border-red-600 text-red-600 px-3 py-1 rounded-md text-xs 
                       hover:bg-red-50 transition-all"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

export default React.memo(TarjetaProductos);