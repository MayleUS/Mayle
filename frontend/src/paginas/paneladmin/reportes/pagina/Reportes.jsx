import React, { useMemo } from "react";
import { FaTshirt, FaShoppingBag, FaClock, FaGem } from "react-icons/fa";
import TarjetasResumen from "../componentes/TarjetasResumen";
import GraficaVentas from "../componentes/GraficaVentas";
import ProductosMasVendidos from "../componentes/ProductosMasVendidos";

export default function Reportes() {
  const datosVentas = useMemo(
    () => [
      { dia: "1", ventas: 120 },
      { dia: "5", ventas: 280 },
      { dia: "10", ventas: 350 },
      { dia: "15", ventas: 420 },
      { dia: "20", ventas: 390 },
      { dia: "25", ventas: 500 },
      { dia: "30", ventas: 470 },
    ],
    []
  );

  const productosMasVendidos = useMemo(
    () => [
      { nombre: "Camisetas", ventas: 45, icono: <FaTshirt className="text-blue-500" /> },
      { nombre: "Jeans", ventas: 30, icono: <FaShoppingBag className="text-green-500" /> },
      { nombre: "Chaquetas", ventas: 15, icono: <FaClock className="text-yellow-500" /> },
      { nombre: "Accesorios", ventas: 10, icono: <FaGem className="text-pink-500" /> },
    ],
    []
  );

  const resumen = {
    ingresos: "$8.750.000",
    ventas: 132,
    topProducto: "Camisetas básicas",
  };

  return (
    <div className="space-y-8">
      <TarjetasResumen resumen={resumen} />
      <GraficaVentas datosVentas={datosVentas} />
      <ProductosMasVendidos productosMasVendidos={productosMasVendidos} />
    </div>
  );
}
