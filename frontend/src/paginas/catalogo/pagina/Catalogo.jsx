import { useState, useEffect } from "react";
import VerTodosProductos from "../componentes/TarjetaProducto";
import PanelFiltro from "../componentes/PanelFiltro";
import ShinyText from "../../../componentes/ShinyText"; // 👈 importa el componente

export default function Catalogo() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filtroColor, setFiltroColor] = useState("");
  const [filtroTalla, setFiltroTalla] = useState("");
  const [filtroPrecio, setFiltroPrecio] = useState(500);

  const [mostrarFiltros, setMostrarFiltros] = useState(false); // iniciamos en false
  const [animandoSalida, setAnimandoSalida] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // Abrir panel automáticamente en escritorio
  useEffect(() => {
    if (window.innerWidth >= 768) { // md breakpoint de Tailwind
      setMostrarFiltros(true);
    }
  }, []);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/productos`);
        if (!res.ok) throw new Error("Error al cargar productos");
        const data = await res.json();
        setProductos(data);
      } catch (error) {
        console.error("Error cargando productos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  const productosFiltrados = productos.filter((producto) => {
    if (!producto.publicado) return false;

    const coincidePrecio = producto.precio <= filtroPrecio;
    let coincideColor = true;
    let coincideTalla = true;

    if (filtroColor) {
      coincideColor = producto.colores?.some((c) =>
        c.color?.some(
          (nombreColor) =>
            nombreColor.toLowerCase() === filtroColor.toLowerCase()
        )
      );
    }

    if (filtroTalla) {
      coincideTalla = producto.colores?.some((c) =>
        c.tallas?.some(
          (t) => t.talla?.toUpperCase() === filtroTalla.toUpperCase()
        )
      );
    }

    return coincideColor && coincideTalla && coincidePrecio;
  });

  const toggleFiltros = () => {
    if (mostrarFiltros) {
      setAnimandoSalida(true);
      setTimeout(() => {
        setMostrarFiltros(false);
        setAnimandoSalida(false);
      }, 350);
    } else {
      setMostrarFiltros(true);
    }
  };

  return (
    <>
      {/* Título principal con efecto ShinyText */}
      <div className="text-center font-inter font-medium text-2xl mt-6 mb-8">
        <ShinyText text="WOMEN'S CLOTHING" className="text-gray-900" />
      </div>

      {/* Bloque fijo con fondo */}
      <div className="sticky top-0 z-10 bg-[#F9F8F7]">
        <div className="border-t border-[#F2F0EE] w-full"></div>

        <button
          onClick={toggleFiltros}
          className="flex items-center gap-2 font-inter font-normal uppercase text-[12px] text-left my-4 ml-[60px]"
        >
          {mostrarFiltros ? "Hide Filters" : "Show Filters"}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-3 h-3 transition-transform duration-300 ${
              mostrarFiltros ? "rotate-0" : "rotate-180"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>

        <div className="border-b border-[#F2F0EE] w-full"></div>
      </div>

      {/* Grilla con panel alineado */}
      <div className="relative grid md:grid-cols-4">
        {/* Panel lateral en escritorio */}
        {mostrarFiltros && (
          <div
            className={`hidden md:block border-r border-[#F2F0EE] mr-20 ${
              animandoSalida ? "animate-slideOutLeft" : "animate-slideInLeft"
            } sticky top-[60px] h-[calc(100vh-60px)] overflow-y-auto`}
          >
            <div className="pt-4 pr-2">
              <PanelFiltro
                filtroColor={filtroColor}
                setFiltroColor={setFiltroColor}
                filtroTalla={filtroTalla}
                setFiltroTalla={setFiltroTalla}
                filtroPrecio={filtroPrecio}
                setFiltroPrecio={setFiltroPrecio}
              />
            </div>
          </div>
        )}

        {/* Panel deslizante lateral en móvil */}
        {mostrarFiltros && (
          <>
            <div
              className={`fixed inset-0 bg-[#F9F8F7] bg-opacity-70 z-40 md:hidden transition-opacity duration-300 ${
                animandoSalida ? "opacity-0" : "opacity-100"
              }`}
              onClick={toggleFiltros}
            ></div>

            <div
              className={`fixed top-0 left-0 h-full w-[80%] max-w-[320px] bg-[#F9F8F7] z-50 shadow-xl transform transition-transform duration-300 md:hidden ${
                animandoSalida
                  ? "-translate-x-full animate-slideOutLeft"
                  : "translate-x-0 animate-slideInLeft"
              }`}
            >
              <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Filtros</h2>
                <button
                  onClick={toggleFiltros}
                  className="text-gray-600 hover:text-black text-xl"
                >
                  ✕
                </button>
              </div>
              <div className="p-4 overflow-y-auto h-[calc(100%-60px)]">
                <PanelFiltro
                  filtroColor={filtroColor}
                  setFiltroColor={setFiltroColor}
                  filtroTalla={filtroTalla}
                  setFiltroTalla={setFiltroTalla}
                  filtroPrecio={filtroPrecio}
                  setFiltroPrecio={setFiltroPrecio}
                />
              </div>
            </div>
          </>
        )}

        {/* Productos */}
        <div className={mostrarFiltros ? "md:col-span-3 pr-[30px]" : "md:col-span-4"}>
          {loading ? (
            <div className="text-center py-20">Cargando productos...</div>
          ) : productosFiltrados.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              No se encontraron productos con esos filtros.
            </div>
          ) : (
            <VerTodosProductos productos={productosFiltrados} />
          )}
        </div>
      </div>
    </>
  );
}
