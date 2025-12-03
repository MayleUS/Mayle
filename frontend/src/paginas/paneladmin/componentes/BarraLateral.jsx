import React from "react";

// Ícono genérico de cuadrícula
const IconoCuadricula = () => (
  <svg
    className="w-5 h-5 text-gray-400"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="3" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <rect x="13" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <rect x="3" y="13" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <rect x="13" y="13" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export default function BarraLateral({ seccionActiva = "cupones", onNavegar }) {
  const secciones = [
    { id: "cupones", nombre: "Cupones", icono: <IconoCuadricula /> },
    { id: "productos", nombre: "Productos", icono: <IconoCuadricula /> },
    { id: "inventario", nombre: "Inventario", icono: <IconoCuadricula /> },
    { id: "pedidos", nombre: "Pedidos", icono: <IconoCuadricula /> },   // ⬅️ NUEVA SECCIÓN
    { id: "reportes", nombre: "Reportes", icono: <IconoCuadricula /> },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-4 hidden lg:block">
      <nav className="space-y-2">
        <div className="text-xs font-semibold text-gray-500 uppercase">
          Navegación
        </div>

        <ul className="mt-3 space-y-1">
          {secciones.map((sec) => (
            <li
              key={sec.id}
              onClick={() => onNavegar && onNavegar(sec.id)}
              className={`px-2 py-2 rounded-md flex items-center gap-3 font-medium cursor-pointer transition-colors
                ${
                  seccionActiva === sec.id
                    ? "bg-gray-50 border-l-2 border-green-600 text-green-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
            >
              <span className="w-5 h-5">{sec.icono}</span>
              {sec.nombre}
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-6 pt-4 border-t border-gray-100 text-sm text-gray-500">
        <div className="mb-2">Última acción</div>
        <div className="text-xs text-gray-400">Hoy · Guardado automático</div>
      </div>
    </aside>
  );
}
