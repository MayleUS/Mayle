import React from "react";
import { motion } from "framer-motion";
import { FaGem, FaShoppingBag, FaTshirt } from "react-icons/fa";

export default function TarjetasResumen({ resumen }) {
  const tarjetas = [
    {
      titulo: "Ingresos del mes",
      valor: resumen.ingresos,
      subtitulo: "Promedio diario: $291.667",
      icono: <FaGem className="text-purple-500 text-2xl" />,
      color: "#7c3aed",
      porcentaje: 75, // 75%
    },
    {
      titulo: "Ventas totales",
      valor: resumen.ventas,
      subtitulo: "Incremento vs mes anterior: +12%",
      icono: <FaShoppingBag className="text-green-500 text-2xl" />,
      color: "#10b981",
      porcentaje: 60, // 60%
    },
    {
      titulo: "Producto más vendido",
      valor: resumen.topProducto,
      subtitulo: "Unidades vendidas: 45",
      icono: <FaTshirt className="text-yellow-500 text-2xl" />,
      color: "#f59e0b",
      porcentaje: 75, // 75%
    },
  ];

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-3 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      {tarjetas.map((tarjeta) => (
        <div
          key={tarjeta.titulo}
          className="bg-white p-6 rounded-2xl shadow hover:shadow-lg border border-gray-200 transition relative overflow-hidden"
        >
          <div
            className="absolute top-0 right-0 w-16 h-16 rounded-full opacity-10 blur-2xl"
            style={{ backgroundColor: tarjeta.color }}
          />
          <div className="flex items-center gap-3 mb-2">
            {tarjeta.icono}
            <h3 className="text-lg font-semibold text-gray-800">{tarjeta.titulo}</h3>
          </div>
          <p className="text-2xl font-bold text-gray-800">{tarjeta.valor}</p>
          <p className="text-sm text-gray-500 mt-1">{tarjeta.subtitulo}</p>

          {/* Barra de progreso */}
          <div className="w-full bg-gray-100 h-2 rounded-full mt-2 overflow-hidden">
            <motion.div
              className="h-2 rounded-full"
              style={{ backgroundColor: tarjeta.color, width: `${tarjeta.porcentaje}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${tarjeta.porcentaje}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </div>
      ))}
    </motion.div>
  );
}
