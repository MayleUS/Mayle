import React from "react";
import { motion } from "framer-motion";

export default function ProductosMasVendidos({ productosMasVendidos }) {
  const COLORS = ["#7c3aed", "#10b981", "#f59e0b", "#ef4444"];

  return (
    <motion.div
      className="bg-white p-6 rounded-2xl shadow-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.6 }}
    >
      <h2 className="text-base font-semibold text-gray-700 mb-6">
        Productos más vendidos
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {productosMasVendidos.map((producto, index) => {
          const totalVentas = productosMasVendidos.reduce((acc, p) => acc + p.ventas, 0);
          const porcentaje = ((producto.ventas / totalVentas) * 100).toFixed(1);
          const color = COLORS[index % COLORS.length];

          return (
            <motion.div
              key={producto.nombre}
              className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-2xl shadow hover:shadow-lg border border-gray-100 transition relative overflow-hidden"
              whileHover={{ y: -5 }}
            >
              <div
                className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-10 blur-2xl"
                style={{ backgroundColor: color }}
              />

              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-gray-100 rounded-full">{producto.icono}</div>
                <h3 className="font-semibold text-gray-800">{producto.nombre}</h3>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
                <motion.div
                  className="h-3 rounded-full"
                  style={{ backgroundColor: color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${porcentaje}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>

              <p className="text-sm text-gray-600">
                {producto.ventas} ventas totales
              </p>
              <p className="text-xs text-gray-400">{porcentaje}% del total</p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
