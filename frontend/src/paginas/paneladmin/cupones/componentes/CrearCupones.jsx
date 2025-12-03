import React from "react";

export default function CrearCupones({ form, setForm, crearCupon }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Crear nuevo cupón</h2>

      <form
        onSubmit={crearCupon}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div>
          <label className="block mb-1 font-medium">Código *</label>
          <input
            type="text"
            className="border p-2 w-full rounded"
            value={form.codigo}
            onChange={(e) =>
              setForm({
                ...form,
                codigo: e.target.value.replace(/\s/g, "").toUpperCase(),
              })
            }
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Descuento (%) *</label>
          <input
            type="number"
            min="1"
            max="100"
            className="border p-2 w-full rounded"
            value={form.descuento}
            onChange={(e) =>
              setForm({ ...form, descuento: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Tipo de cupón *</label>
          <select
            className="border p-2 w-full rounded"
            value={form.tipo}
            onChange={(e) => setForm({ ...form, tipo: e.target.value })}
          >
            <option value="una_vez_total">Una vez total</option>
            <option value="una_vez_por_usuario">Una vez por usuario</option>
            <option value="cantidad_limitada">Cantidad limitada</option>
            <option value="permanente">Permanente</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Fecha de expiración</label>
          <input
            type="date"
            className="border p-2 w-full rounded"
            value={form.fecha_expiracion}
            onChange={(e) =>
              setForm({ ...form, fecha_expiracion: e.target.value })
            }
          />
        </div>

        {form.tipo === "cantidad_limitada" && (
          <div>
            <label className="block mb-1 font-medium">Usos disponibles *</label>
            <input
              type="number"
              min="1"
              className="border p-2 w-full rounded"
              value={form.usos_disponibles}
              onChange={(e) =>
                setForm({ ...form, usos_disponibles: e.target.value })
              }
              required
            />
          </div>
        )}

        <div className="col-span-full">
          <button className="bg-slate-800 text-white px-4 py-2 rounded w-full hover:bg-slate-700 transition">
            Crear cupón
          </button>
        </div>
      </form>
    </div>
  );
}
