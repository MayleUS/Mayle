import { Outlet } from "react-router-dom";
import InfoStrip from "../componentes/InfoStrip";
import BarraNavegacion from "../componentes/BarraNavegacion";
import Footer from "../componentes/Footer";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9f9]">
      {/* 🔹 Barrita superior */}
      <InfoStrip />

      {/* 🔹 Barra de navegación */}
      <BarraNavegacion />

      {/* 🔹 Contenido dinámico */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* 🔹 Footer */}
      <Footer />
    </div>
  );
}