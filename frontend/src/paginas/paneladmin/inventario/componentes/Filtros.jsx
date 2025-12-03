// Filtros.jsx
import React from "react";

export default function Filtros({ filtro, setFiltro }) {
  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Buscar producto..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-green-500 outline-none w-full"
      />
    </div>
  );
}
