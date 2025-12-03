import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import VerTodosProductos from "../componentes/TarjetaProducto";
import PanelFiltroCategoria from "../componentes/PanelFiltroCategoria";
import { Particles } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import ShinyText from "../../../componentes/ShinyText";

export default function CatalogoCategoria() {
  const { nombre } = useParams();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filtroColor, setFiltroColor] = useState("");
  const [filtroTalla, setFiltroTalla] = useState("");
  const [filtroPrecio, setFiltroPrecio] = useState(300000);

  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [animandoSalida, setAnimandoSalida] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  // 🔹 Abrir panel automáticamente en desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMostrarFiltros(true);
      } else {
        setMostrarFiltros(false);
      }
    };

    handleResize(); // ejecutar al montar
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/productos`);
        if (!res.ok) throw new Error("Error al cargar productos");
        const data = await res.json();

        const filtrados = data.filter(
          (p) =>
            p.publicado &&
            p.categoria?.some(
              (cat) => cat.toLowerCase() === nombre.toLowerCase()
            )
        );

        setProductos(filtrados);

        const maxPrecio = filtrados.length
          ? Math.max(...filtrados.map((p) => p.precio))
          : 300000;
        setFiltroPrecio(maxPrecio);
      } catch (error) {
        console.error("Error cargando productos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, [nombre]);

  const productosFiltrados = productos.filter((producto) => {
    const coincideColor = filtroColor
      ? producto.colores?.some((c) =>
          c.color?.some(
            (nombreColor) =>
              nombreColor.toLowerCase() === filtroColor.toLowerCase()
          )
        )
      : true;

    const coincideTalla = filtroTalla
      ? producto.colores?.some((c) =>
          c.tallas?.some(
            (t) => t.talla?.toUpperCase() === filtroTalla.toUpperCase()
          )
        )
      : true;

    const coincidePrecio = producto.precio <= filtroPrecio;

    return coincideColor && coincideTalla && coincidePrecio;
  });

  const toggleFiltros = () => {
    if (mostrarFiltros) {
      setAnimandoSalida(true);
      setTimeout(() => {
        setMostrarFiltros(false);
        setAnimandoSalida(false);
      }, 300);
    } else {
      setMostrarFiltros(true);
    }
  };

  return (
    <>
      {/* 🔹 Encabezado */}
      <section className="relative w-full py-4 overflow-hidden mb-10 bg-gradient-to-b from-[#f7f6f4] to-[#ffffff]">
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            background: { color: { value: "transparent" } },
            fpsLimit: 60,
            particles: {
              color: { value: "#d1c4b2" },
              move: { enable: true, speed: 0.6 },
              number: { value: 50 },
              opacity: { value: 0.5 },
              shape: { type: "circle" },
              size: { value: { min: 1, max: 3 } },
              links: {
                enable: true,
                color: "#bfa27a",
                distance: 120,
                opacity: 0.3,
              },
            },
            detectRetina: true,
          }}
          className="absolute inset-0"
        />

        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"></div>

        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-serif tracking-wide mb-3 animate-fadeIn">
            <ShinyText
              text={
                nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase()
              }
              className="text-gray-900"
            />
          </h1>
          <p className="text-gray-500 text-sm uppercase tracking-[0.2em]">
            Exclusive Collection
          </p>
        </div>
      </section>

      {/* 🔹 Barra fija de filtros */}
      <div className="sticky top-0 z-20 bg-[#F9F8F7]">
        <div className="border-t border-[#F2F0EE] w-full"></div>

        <button
          onClick={toggleFiltros}
          className="flex items-center gap-2 font-inter font-normal uppercase text-[12px] text-left my-4 ml-[20px] md:ml-[60px]"
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

      {/* 🔹 Contenedor principal */}
      <div className="relative grid md:grid-cols-4">
        {/* 🖥️ Panel lateral en escritorio */}
        {mostrarFiltros && (
          <div
            className={`hidden md:block border-r border-[#F2F0EE] mr-20 ${
              animandoSalida ? "animate-slideOutLeft" : "animate-slideInLeft"
            } sticky top-[60px] h-[calc(100vh-60px)] overflow-y-auto`}
          >
            <div className="pt-4 pr-2">
              <PanelFiltroCategoria
                productos={productos}
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

        {/* 📱 Panel deslizante lateral en móviles */}
        {mostrarFiltros && (
          <>
            {/* Fondo gris translúcido */}
            <div
              className={`fixed inset-0 bg-[#F9F8F7] bg-opacity-70 z-40 md:hidden transition-opacity duration-300 ${
                animandoSalida ? "opacity-0" : "opacity-100"
              }`}
              onClick={toggleFiltros}
            ></div>

            {/* Drawer */}
            <div
              className={`fixed top-0 left-0 h-full w-[80%] max-w-[320px] bg-[#F9F8F7] z-50 shadow-xl transform transition-transform duration-300 md:hidden ${
                animandoSalida ? "-translate-x-full animate-slideOutLeft" : "translate-x-0 animate-slideInLeft"
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
                <PanelFiltroCategoria
                  productos={productos}
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

        {/* 🛍️ Productos */}
        <div className={mostrarFiltros ? "md:col-span-3 pr-[30px]" : "md:col-span-4"}>
          {loading ? (
            <div className="text-center py-20">Loading products...</div>
          ) : productosFiltrados.length > 0 ? (
            <VerTodosProductos productos={productosFiltrados} />
          ) : (
            <div className="text-center py-20 text-gray-500">
              No products found in this category.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
