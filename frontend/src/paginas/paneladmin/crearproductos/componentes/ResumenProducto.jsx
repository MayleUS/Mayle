import React from "react";

export default function ResumenProducto({ form, variantes, onGuardar, onLimpiar }) {
  return (
    <aside className="space-y-4">
      {/* Resumen rápido */}
      <div className="border border-gray-100 rounded-md p-4 bg-white">
        <h3 className="text-sm font-semibold text-gray-700">Resumen rápido</h3>
        <div className="mt-3 text-xs text-gray-500 space-y-2">
          <div>Variantes: <strong className="text-gray-800">{variantes.length}</strong></div>
          <div>Categorías: <strong className="text-gray-800">{form.categoria.filter(Boolean).length}</strong></div>
          <div>Publicado: <strong className="text-gray-800">{form.publicado ? 'Sí' : 'No'}</strong></div>
        </div>
      </div>

      {/* Acciones */}
      <div className="border border-gray-100 rounded-md p-4 bg-white space-y-2">
        <h3 className="text-sm font-semibold text-gray-700">Acciones</h3>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={onGuardar}
            className="w-full bg-slate-800 text-white px-4 py-2 rounded-md font-medium hover:bg-slate-900"
          >
            Guardar
          </button>

          <button
            type="button"
            onClick={() => navigator.clipboard && form.nombre && navigator.clipboard.writeText(form.nombre)}
            className="w-full border border-gray-200 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Copiar nombre
          </button>

          <button
            type="button"
            onClick={onLimpiar}
            className="w-full text-red-600 px-4 py-2 rounded-md hover:bg-red-50"
          >
            Limpiar
          </button>
        </div>
      </div>

      {/* Ayuda */}
      <div className="border border-gray-100 rounded-md p-3 bg-white">
        <div className="text-xs text-gray-500">Ayuda</div>
        <div className="mt-2 text-xs text-gray-600">
          Este panel es para crear productos de catálogo. Los campos son validables por el backend al guardar.
        </div>
      </div>
    </aside>
  );
}
