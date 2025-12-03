import React from "react";

export default function SeccionGuia({ guia, setGuia }) {
  return (
    <section className="rounded-md border border-gray-100 p-5 bg-white">
      <h2 className="text-lg font-semibold text-gray-800">Guía de tallas / Media</h2>
      <p className="text-xs text-gray-500 mt-1">Sube imágenes o pega URLs para la guía de tallas.</p>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700">URL guía de tallas</label>
          <input
            type="text"
            value={guia}
            onChange={(e) => setGuia(e.target.value)}
            placeholder="https://..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-green-500 outline-none mt-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Publicación</label>
          <div className="mt-2 flex items-center gap-3">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!guia}
                readOnly
                className="w-4 h-4 text-green-600 rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Mostrar guía al publicar</span>
            </label>
          </div>
        </div>
      </div>

      {guia && (
        <div className="mt-4 border border-gray-100 rounded-md p-3 bg-gray-50">
          <img src={guia} alt="Guía" className="w-full object-contain max-h-52 rounded-md" />
        </div>
      )}
    </section>
  );
}
