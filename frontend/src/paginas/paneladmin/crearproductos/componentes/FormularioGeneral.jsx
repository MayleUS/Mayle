import React, { useState } from "react";

export default function FormularioGeneral({
  form,
  setForm,
  actualizarCategoria,
  agregarCategoria,
  eliminarCategoria,
  actualizarCategoriaPrincipal,
  agregarCategoriaPrincipal,
  eliminarCategoriaPrincipal,
  categoriasDisponibles = [],
  categoriasPrincipalesDisponibles = [],
}) {
  const [creandoCatPrincipal, setCreandoCatPrincipal] = useState({});
  const [creandoCategoria, setCreandoCategoria] = useState({});
  const [nuevasCatPrincipales, setNuevasCatPrincipales] = useState({});
  const [nuevasCategorias, setNuevasCategorias] = useState({});

  const [dropdownOpenPrincipal, setDropdownOpenPrincipal] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState({});

  const setField = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const inputClass =
    "w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-green-500 outline-none transition-all bg-white shadow-sm disabled:bg-gray-100";

  const textareaClass =
    "w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-green-500 outline-none transition-all resize-none bg-white shadow-sm disabled:bg-gray-100";

  const dropdownButtonClass =
    "w-full border border-gray-300 rounded-xl px-3 py-2 text-sm text-left bg-white shadow-sm flex justify-between items-center cursor-pointer";

  const dropdownItemClass =
    "cursor-pointer px-3 py-2 text-sm hover:bg-green-100 transition-all";

  return (
    <section className="rounded-md border border-gray-100 p-5 bg-white">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Información básica</h2>
          <p className="text-xs text-gray-500 mt-1">Nombre, precios y categorías principales.</p>
        </div>
        <div className="text-xs text-gray-400">
          Estado: <span className="ml-2 font-medium text-green-600">Borrador</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Nombre del producto <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.nombre}
            onChange={(e) => setField("nombre", e.target.value)}
            placeholder="Ej: Camisa clásica blanca"
            required
            className={inputClass}
          />
        </div>

        {/* Precio y Descuento */}
        <div className="grid lg:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Precio base (USD)</label>
            <input
              type="number"
              value={form.precio}
              onChange={(e) => setField("precio", e.target.value)}
              placeholder="0"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Descuento %</label>
            <input
              type="number"
              value={form.Descuento}
              onChange={(e) => setField("Descuento", e.target.value)}
              placeholder="0"
              className={inputClass}
            />
          </div>
        </div>

        {/* Categoría Principal */}
        <div>
          <label className="text-sm font-medium text-gray-700">Categoría Principal</label>
          <div className="mt-2 space-y-2">
            {form.categoriaPrincipal.map((c, i) => (
              <div key={i} className="flex gap-2 items-center relative">
                <div className="relative w-full">
                  <div
                    className={dropdownButtonClass}
                    onClick={() =>
                      setDropdownOpenPrincipal((prev) => ({ ...prev, [i]: !prev[i] }))
                    }
                  >
                    {creandoCatPrincipal[i] ? "Crear nueva categoria principal" : c || "Selecciona una categoría principal"}
                    <span>&#9662;</span>
                  </div>
                  {dropdownOpenPrincipal[i] && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                      {categoriasPrincipalesDisponibles.map((cat) => (
                        <div
                          key={cat}
                          className={dropdownItemClass}
                          onClick={() => {
                            actualizarCategoriaPrincipal(i, cat);
                            setDropdownOpenPrincipal((prev) => ({ ...prev, [i]: false }));
                            setCreandoCatPrincipal((prev) => ({ ...prev, [i]: false })); // asegurar que no quede en modo crear
                          }}
                        >
                          {cat}
                        </div>
                      ))}
                      <div
                        className={dropdownItemClass + " text-green-600 font-medium"}
                        onClick={() => {
                          setCreandoCatPrincipal((prev) => ({ ...prev, [i]: true }));
                          setNuevasCatPrincipales((prev) => ({ ...prev, [i]: "" }));
                          setDropdownOpenPrincipal((prev) => ({ ...prev, [i]: false }));
                        }}
                      >
                        Crear nueva categoria principal
                      </div>
                    </div>
                  )}
                </div>

                {creandoCatPrincipal[i] && (
                  <input
                    value={nuevasCatPrincipales[i]}
                    onChange={(e) =>
                      setNuevasCatPrincipales((prev) => ({ ...prev, [i]: e.target.value }))
                    }
                    placeholder="Nueva categoría principal"
                    className={inputClass}
                  />
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (creandoCatPrincipal[i]) {
                      const nueva = (nuevasCatPrincipales[i] || "").trim();
                      if (!nueva) return;
                      actualizarCategoriaPrincipal(i, nueva);
                      if (!categoriasPrincipalesDisponibles.includes(nueva)) {
                        categoriasPrincipalesDisponibles.push(nueva);
                      }
                      setCreandoCatPrincipal((prev) => ({ ...prev, [i]: false }));
                    } else {
                      eliminarCategoriaPrincipal(i);
                    }
                  }}
                  className={`text-sm font-medium hover:underline ${
                    creandoCatPrincipal[i] ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {creandoCatPrincipal[i] ? "Guardar" : "Eliminar"}
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={agregarCategoriaPrincipal}
              className="text-green-700 font-medium mt-1 hover:underline"
            >
              + Agregar categoría principal
            </button>
          </div>
        </div>

        {/* Categorías secundarias */}
        <div>
          <label className="text-sm font-medium text-gray-700">Categorías</label>
          <div className="mt-2 space-y-2">
            {form.categoria.map((c, i) => (
              <div key={i} className="flex gap-2 items-center relative">
                <div className="relative w-full">
                  <div
                    className={dropdownButtonClass}
                    onClick={() => setDropdownOpen((prev) => ({ ...prev, [i]: !prev[i] }))}
                  >
                    {creandoCategoria[i] ? "Crear nueva categoria" : c || "Selecciona una categoría"}
                    <span>&#9662;</span>
                  </div>
                  {dropdownOpen[i] && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                      {categoriasDisponibles.map((cat) => (
                        <div
                          key={cat}
                          className={dropdownItemClass}
                          onClick={() => {
                            actualizarCategoria(i, cat);
                            setDropdownOpen((prev) => ({ ...prev, [i]: false }));
                            setCreandoCategoria((prev) => ({ ...prev, [i]: false })); // reset para permitir otras selecciones
                          }}
                        >
                          {cat}
                        </div>
                      ))}
                      <div
                        className={dropdownItemClass + " text-green-600 font-medium"}
                        onClick={() => {
                          setCreandoCategoria((prev) => ({ ...prev, [i]: true }));
                          setNuevasCategorias((prev) => ({ ...prev, [i]: "" }));
                          setDropdownOpen((prev) => ({ ...prev, [i]: false }));
                        }}
                      >
                        Crear nueva categoria
                      </div>
                    </div>
                  )}
                </div>

                {creandoCategoria[i] && (
                  <input
                    value={nuevasCategorias[i]}
                    onChange={(e) =>
                      setNuevasCategorias((prev) => ({ ...prev, [i]: e.target.value }))
                    }
                    placeholder="Nueva categoría"
                    className={inputClass}
                  />
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (creandoCategoria[i]) {
                      const nueva = (nuevasCategorias[i] || "").trim();
                      if (!nueva) return;
                      actualizarCategoria(i, nueva);
                      if (!categoriasDisponibles.includes(nueva)) {
                        categoriasDisponibles.push(nueva);
                      }
                      setCreandoCategoria((prev) => ({ ...prev, [i]: false }));
                    } else {
                      eliminarCategoria(i);
                    }
                  }}
                  className={`text-sm font-medium hover:underline ${
                    creandoCategoria[i] ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {creandoCategoria[i] ? "Guardar" : "Eliminar"}
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={agregarCategoria}
              className="text-green-700 font-medium mt-1 hover:underline"
            >
              + Agregar categoría
            </button>
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
          <textarea
            value={form.descripcion}
            onChange={(e) => setField("descripcion", e.target.value)}
            placeholder="Descripción detallada del producto"
            rows={4}
            className={textareaClass}
          />
        </div>

        {/* Cuidados */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Cuidados</label>
          <textarea
            value={form.cuidados}
            onChange={(e) => setField("cuidados", e.target.value)}
            placeholder="Instrucciones de lavado o mantenimiento del producto"
            rows={3}
            className={textareaClass}
          />
        </div>
      </div>
    </section>
  );
}
