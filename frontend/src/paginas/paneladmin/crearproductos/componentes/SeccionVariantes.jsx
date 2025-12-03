import React from "react";

export default function SeccionVariantes({ variantes, setVariantes }) {
  // --- Funciones helper ---
  const agregarVariante = () => {
    const nueva = {
      id: Date.now(),
      colorNombre: "",
      colorHex: "",
      imagenes: [""],
      tallas: [{ id: Date.now(), talla: "", stock: 0, imagen: "" }],
    };
    setVariantes([...variantes, nueva]);
  };

  const eliminarVariante = (id) => {
    setVariantes(variantes.filter((v) => v.id !== id));
  };

  const actualizarVariante = (id, path, value) => {
    const nuevas = variantes.map((v) => {
      if (v.id !== id) return v;

      if (path.startsWith("imagenes")) {
        const match = path.match(/imagenes\[(\d+)\]/);
        if (match) {
          const idx = Number(match[1]);
          const imgs = [...v.imagenes];
          imgs[idx] = value;
          return { ...v, imagenes: imgs };
        }
      }

      if (path.startsWith("tallas")) {
        const match = path.match(/tallas\[(\d+)\]\.(.*)/);
        if (match) {
          const idx = Number(match[1]);
          const key = match[2];
          const ts = v.tallas.map((t, i) =>
            i === idx ? { ...t, [key]: value } : t
          );
          return { ...v, tallas: ts };
        }
      }

      return { ...v, [path]: value };
    });
    setVariantes(nuevas);
  };

  const agregarImagenVariante = (id) => {
    const nuevas = variantes.map((v) =>
      v.id === id ? { ...v, imagenes: [...v.imagenes, ""] } : v
    );
    setVariantes(nuevas);
  };

  const eliminarImagenVariante = (id, indexImg) => {
    const nuevas = variantes.map((v) =>
      v.id === id
        ? { ...v, imagenes: v.imagenes.filter((_, i) => i !== indexImg) }
        : v
    );
    setVariantes(nuevas);
  };

  const agregarTallaVariante = (id) => {
    const nuevas = variantes.map((v) =>
      v.id === id
        ? {
            ...v,
            tallas: [...v.tallas, { id: Date.now(), talla: "", stock: 0, imagen: "" }],
          }
        : v
    );
    setVariantes(nuevas);
  };

  const eliminarTallaVariante = (id, idTalla) => {
    const nuevas = variantes.map((v) =>
      v.id === id
        ? { ...v, tallas: v.tallas.filter((t) => t.id !== idTalla) }
        : v
    );
    setVariantes(nuevas);
  };

  return (
    <section className="rounded-md border border-gray-100 p-5 bg-white">
      <div className="flex items-center justify-between mb">
        <h2 className="text-lg font-semibold text-gray-800">Variantes</h2>
        <button
          type="button"
          onClick={agregarVariante}
          className="inline-flex items-center gap-2 bg-slate-800 text-white px-3 py-1.5 rounded-md text-sm hover:opacity-95"
        >
          + Agregar variante
        </button>
      </div>

      {/* TEXTO AGREGADO */}
      <p className="text-xs text-gray-500 mb-4 mt-1">
        Colores y tallas — agrega las combinaciones que vendas.
      </p>

      <div className="space-y-4">
        {variantes.map((v) => (
          <article
            key={v.id}
            className="border border-gray-100 rounded-md p-4 bg-gray-50"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  style={{ background: v.colorHex || "transparent" }}
                  className="w-8 h-8 rounded-md border"
                />
                <div>
                  <div className="font-medium text-gray-800">
                    {v.colorNombre || "Color sin nombre"}
                  </div>
                  <div className="text-xs text-gray-400">{v.colorHex || "-"}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => eliminarVariante(v.id)}
                className="text-red-600 text-sm hover:underline"
              >
                Eliminar
              </button>
            </div>

            {/* Color + HEX */}
            <div className="mt-3 grid grid-cols-1 lg:grid-cols-3 gap-3">
              <input
                placeholder="Nombre color"
                value={v.colorNombre}
                onChange={(e) => actualizarVariante(v.id, "colorNombre", e.target.value)}
                className="col-span-2 border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-green-500 outline-none"
              />
              <input
                placeholder="#HEX o rgb"
                value={v.colorHex}
                onChange={(e) => actualizarVariante(v.id, "colorHex", e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-green-500 outline-none"
              />
            </div>

            {/* Imágenes */}
            <div className="mt-3">
              <div className="text-xs text-gray-600 mb-2">Imágenes</div>
              <div className="space-y-2">
                {v.imagenes.map((img, idx) => (
                  <div key={idx} className="flex gap-3">
                    <input
                      value={img}
                      placeholder={`URL imagen #${idx + 1}`}
                      onChange={(e) =>
                        actualizarVariante(v.id, `imagenes[${idx}]`, e.target.value)
                      }
                      className="flex-grow border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-green-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => eliminarImagenVariante(v.id, idx)}
                      className="text-red-600 text-sm hover:underline"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => agregarImagenVariante(v.id)}
                  className="text-green-700 text-sm font-medium hover:underline"
                >
                  + Agregar imagen
                </button>
              </div>
            </div>

            {/* Tallas */}
            <div className="mt-3">
              <div className="text-xs text-gray-600 mb-2">Tallas</div>
              <div className="space-y-2">
                {v.tallas.map((t, idx) => (
                  <div key={t.id} className="flex gap-3 items-center">
                    <input
                      value={t.talla}
                      placeholder="Talla (S, M, L)"
                      onChange={(e) =>
                        actualizarVariante(v.id, `tallas[${idx}].talla`, e.target.value)
                      }
                      className="w-40 border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-green-500 outline-none"
                    />
                    <input
                      type="number"
                      value={t.stock}
                      placeholder="Stock"
                      onChange={(e) =>
                        actualizarVariante(v.id, `tallas[${idx}].stock`, e.target.value)
                      }
                      className="w-28 border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-green-500 outline-none"
                    />
                    <input
                      value={t.imagen}
                      placeholder="URL imagen talla"
                      onChange={(e) =>
                        actualizarVariante(v.id, `tallas[${idx}].imagen`, e.target.value)
                      }
                      className="flex-grow border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-green-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => eliminarTallaVariante(v.id, t.id)}
                      className="text-red-600 text-sm hover:underline"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => agregarTallaVariante(v.id)}
                  className="text-green-700 text-sm font-medium hover:underline"
                >
                  + Agregar talla
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
