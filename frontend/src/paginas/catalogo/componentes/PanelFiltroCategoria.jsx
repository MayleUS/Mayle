import React, { useState, useEffect } from "react";

export default function PanelFiltroCategoria({
  productos,
  filtroColor,
  setFiltroColor,
  filtroTalla,
  setFiltroTalla,
  filtroPrecio,
  setFiltroPrecio,
}) {
  const [mostrarTalla, setMostrarTalla] = useState(true);
  const [mostrarColor, setMostrarColor] = useState(true);
  const [mostrarPrecio, setMostrarPrecio] = useState(false);

  const [opciones, setOpciones] = useState({ tallas: [], colores: [] });

  useEffect(() => {
    // Extraemos tallas y colores de los productos
    const tallas = [
      ...new Set(
        productos.flatMap((p) =>
          p.colores?.flatMap((c) =>
            c.tallas?.map((t) => t.talla?.toUpperCase())
          ) || []
        )
      ),
    ];

    // Solo nombres de colores, ignorando valores hex
    const colores = [
      ...new Set(
        productos.flatMap((p) =>
          p.colores?.flatMap((c) =>
            c.color?.filter((col) => typeof col === "string" && !col.startsWith("#"))
          ) || []
        ).map((c) => c.toLowerCase())
      ),
    ];

    setOpciones({ tallas, colores });
  }, [productos]);

  return (
    <aside className="md:col-span-1 pr-6 pl-[60px]">
      {/* Filtro por talla */}
      <div className="mb-8">
        <button
          onClick={() => setMostrarTalla(!mostrarTalla)}
          className="flex items-center justify-between w-full text-sm font-Quicksand font-medium mb-3"
        >
          Size
          <span className="text-lg font-bold">{mostrarTalla ? "–" : "+"}</span>
        </button>
        {mostrarTalla && (
          <>
            <div className="grid grid-cols-4 gap-y-4">
              {opciones.tallas.map((talla) => (
                <button
                  key={talla}
                  onClick={() => setFiltroTalla(filtroTalla === talla ? "" : talla)}
                  className={`w-10 h-10 flex items-center justify-center border text-sm font-medium transition-all ${
                    filtroTalla === talla
                      ? "border-gray-800"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {talla}
                </button>
              ))}
            </div>
            {filtroTalla && (
              <button
                onClick={() => setFiltroTalla("")}
                className="mt-2 text-xs underline text-gray-500"
              >
                Limpiar
              </button>
            )}
          </>
        )}
      </div>

      {/* Filtro por color */}
      <div className="mb-8">
        <button
          onClick={() => setMostrarColor(!mostrarColor)}
          className="flex items-center justify-between w-full text-sm font-Quicksand font-medium mb-3"
        >
          Color
          <span className="text-lg font-bold">{mostrarColor ? "–" : "+"}</span>
        </button>
        {mostrarColor && (
          <>
            <div className="flex flex-col gap-2">
              {opciones.colores.map((color) => (
                <label
                  key={color}
                  className="flex items-center gap-2 text-sm text-gray-700 capitalize"
                >
                  <input
                    type="checkbox"
                    checked={filtroColor === color}
                    onChange={() =>
                      setFiltroColor(filtroColor === color ? "" : color)
                    }
                    className="accent-black"
                  />
                  <span>{color}</span>
                </label>
              ))}
            </div>
            {filtroColor && (
              <button
                onClick={() => setFiltroColor("")}
                className="mt-2 text-xs underline text-gray-500"
              >
                Limpiar
              </button>
            )}
          </>
        )}
      </div>

      {/* Filtro por rango de precio */}
      <div className="mb-8">
        <button
          onClick={() => setMostrarPrecio(!mostrarPrecio)}
          className="flex items-center justify-between w-full text-sm font-Quicksand font-medium mb-3"
        >
          Rango de precio
          <span className="text-lg font-bold">{mostrarPrecio ? "–" : "+"}</span>
        </button>
        {mostrarPrecio && (
          <>
            <input
              type="range"
              min="10"
              max="500"
              step="10"
              value={filtroPrecio}
              onChange={(e) => setFiltroPrecio(Number(e.target.value))}
              className="w-full accent-black"
            />
            <p className="text-sm text-gray-600 mt-2">
              Hasta ${filtroPrecio.toLocaleString("es-CO")}
            </p>
          </>
        )}
      </div>
    </aside>
  );
}
