import React, { useState, useEffect } from "react";

export default function PanelFiltro({
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

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchOpciones = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/productos/filtros/opciones`);
        if (!res.ok) throw new Error("Error al cargar opciones de filtros");
        const data = await res.json();

        // Normaliza y elimina duplicados
        const tallas = [
          ...new Set((data.tallas || []).map((t) => t?.toString().toUpperCase())),
        ];

        // Tomar solo el nombre (ignorar los que son hexadecimales)
        const colores = [
          ...new Set(
            (data.colores || [])
              .map((c) => {
                if (Array.isArray(c)) {
                  // si es array, tomamos solo el primer valor que no sea hexadecimal
                  const nombre = c.find((v) => !v.startsWith("#"));
                  return nombre?.toString().toLowerCase();
                } else if (typeof c === "string" && !c.startsWith("#")) {
                  return c.toLowerCase();
                }
                return null;
              })
              .filter(Boolean)
          ),
        ];

        setOpciones({ tallas, colores });
      } catch (error) {
        console.error("Error cargando opciones de filtros:", error);
      }
    };
    fetchOpciones();
  }, [BACKEND_URL]);

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
              {opciones.tallas.map((talla, index) => (
                <button
                  key={`${talla}-${index}`}
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
            <button
              onClick={() => setFiltroTalla("")}
              className="mt-2 text-xs underline text-gray-500"
            >
              Limpiar
            </button>
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
              {opciones.colores.map((color, index) => (
                <label
                  key={`${color}-${index}`}
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
            <button
              onClick={() => setFiltroColor("")}
              className="mt-2 text-xs underline text-gray-500"
            >
              Limpiar
            </button>
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
