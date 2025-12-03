import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "sonner";
import CrearCupones from "../componentes/CrearCupones";
import ListaCupones from "../componentes/ListaCupones";
import API from "../../../../api";

export default function CuponesAdmin() {
  const [cupones, setCupones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);

  const [form, setForm] = useState({
    codigo: "",
    descuento: "",
    tipo: "una_vez_por_usuario",
    fecha_expiracion: "",
    usos_disponibles: "",
  });

  // Colores por tipo de cupón
  const tipoColor = {
    una_vez_total: "bg-blue-500",
    una_vez_por_usuario: "bg-purple-500",
    cantidad_limitada: "bg-green-500",
    permanente: "bg-orange-500",
  };

  // Cargar todos los cupones
  const cargarCupones = async () => {
    try {
      const { data } = await API.get("/cupones/todos");
      setCupones(data);
      setCargando(false);
    } catch (error) {
      console.error("Error obteniendo cupones:", error.response?.data || error);
      toast.error("Error cargando los cupones", { duration: 4000 });
    }
  };

  useEffect(() => {
    cargarCupones();
  }, []);

  // Crear cupón
  const crearCupon = async (e) => {
    e.preventDefault();

    const payload = {
      codigo: form.codigo,
      descuento: Number(form.descuento),
      tipo: form.tipo,
      fecha_expiracion: form.fecha_expiracion || null,
      usos_disponibles:
        form.tipo === "cantidad_limitada"
          ? Number(form.usos_disponibles)
          : undefined,
    };

    try {
      await API.post("/cupones/crear", payload);

      // Recargar lista completa
      await cargarCupones();

      // Resetear formulario
      setForm({
        codigo: "",
        descuento: "",
        tipo: "una_vez_por_usuario",
        fecha_expiracion: "",
        usos_disponibles: "",
      });

      setModalAbierto(false);
      toast.success(
        <span>
          Cupón <strong>{payload.codigo}</strong> creado
          <span
            className={`ml-2 px-2 py-0.5 text-white rounded ${tipoColor[payload.tipo]}`}
          >
            {payload.tipo.replace(/_/g, " ")}
          </span>
        </span>,
        { duration: 4000 }
      );
    } catch (error) {
      console.error("Error creando cupón:", error.response?.data || error);
      toast.error("Error creando el cupón", { duration: 4000 });
    }
  };

  // Eliminar cupón
  const eliminarCupon = async (id) => {
    try {
      const cup = cupones.find((c) => c._id === id);
      await API.delete(`/cupones/eliminar/${id}`);
      setCupones((prev) => prev.filter((c) => c._id !== id));
      toast.success(
        <span>
          Cupón <strong>{cup.codigo}</strong> eliminado
          <span
            className={`ml-2 px-2 py-0.5 text-white rounded ${tipoColor[cup.tipo]}`}
          >
            {cup.tipo.replace(/_/g, " ")}
          </span>
        </span>,
        { duration: 4000 }
      );
    } catch (error) {
      console.error("Error eliminando cupón:", error.response?.data || error);
      toast.error("Error eliminando el cupón", { duration: 4000 });
    }
  };

  return (
    <div className="space-y">
      <Toaster position="top-right" />

      {/* BOTÓN ABRIR MODAL */}
      <div className="flex justify-end">
        <button
          onClick={() => setModalAbierto(true)}
          className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition shadow"
        >
          Crear cupón
        </button>
      </div>

      {/* MODAL ANIMADO */}
      <AnimatePresence>
        {modalAbierto && (
          <motion.div
            key="backdrop"
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              key="modal"
              className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg relative"
              initial={{ opacity: 0, scale: 0.85, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 40 }}
              transition={{ type: "spring", duration: 0.35 }}
            >
              {/* CERRAR */}
              <button
                onClick={() => setModalAbierto(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
              >
                ×
              </button>

              <CrearCupones
                form={form}
                setForm={setForm}
                crearCupon={crearCupon}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ListaCupones
        cupones={cupones}
        cargando={cargando}
        eliminarCupon={eliminarCupon}
      />
    </div>
  );
}
