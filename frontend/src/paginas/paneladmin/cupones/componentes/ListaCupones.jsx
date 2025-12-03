import React from "react";

export default function ListaCupones({ cupones, cargando, eliminarCupon }) {
  return (
    <div className="mt-2">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Cupones creados
      </h2>

      {cargando ? (
        <p className="text-gray-600">Cargando cupones...</p>
      ) : cupones.length === 0 ? (
        <p className="text-gray-600">No hay cupones creados aún.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {cupones.map((c) => {
            const tipoLimpio = c?.tipo
              ? c.tipo.replace(/_/g, " ")
              : "Desconocido";

            return (
              <div
                key={c._id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 
                           flex flex-col justify-between transition-all duration-200 
                           transform hover:shadow-md hover:scale-105"
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-2">
                  <h2 className="font-semibold text-gray-800 text-sm line-clamp-1">
                    {c.codigo || "Sin código"}
                  </h2>

                  <span className="px-2 py-1 text-xs font-semibold rounded-md bg-green-600 text-white">
                    Cupón
                  </span>
                </div>

                {/* Info */}
                <div className="space-y-1 text-sm text-gray-700 flex-grow">
                  <div className="text-xs text-gray-500">Tipo: {tipoLimpio}</div>

                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Descuento:</span>
                    <span>{c?.descuento ?? 0}%</span>
                  </div>

                  <div className="text-xs text-gray-600">
                    Expira:{" "}
                    {c?.fecha_expiracion
                      ? new Date(c.fecha_expiracion).toLocaleDateString()
                      : "Sin expiración"}
                  </div>

                  {c?.tipo === "cantidad_limitada" && (
                    <div className="text-xs text-gray-600">
                      Usos disponibles: {c?.usos_disponibles ?? 0}
                    </div>
                  )}
                </div>

                {/* Botón eliminar */}
                <div className="mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // evita que el hover de la tarjeta se rompa
                      eliminarCupon(c._id);
                    }}
                    className="w-full border border-red-600 text-red-600 px-3 py-1 rounded-md text-xs 
                               hover:bg-red-50 transition-colors duration-200"
                  >
                    Eliminar cupón
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
