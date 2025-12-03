import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ShinyText from "../../../componentes/ShinyText";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function BloquePromocional() {
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/productos`);
        const data = await res.json();

        const filtrados = data.filter((p) => p.galeriaPrincipal === true);
        setProductos(filtrados);

        filtrados.forEach((p) => {
          const img = new Image();
          img.src = p.colores?.[0]?.imagenes?.[0];
        });
      } catch (error) {
        console.error("Error cargando productos:", error);
      }
    };

    fetchProductos();
  }, []);

  return (
    <section className="w-full bg-[#F9F8F7] py-16 px-6">
      <div className="flex items-center justify-center mb-12">
        <span className="h-px w-12 bg-gray-300"></span>
        <h2 className="mx-4 text-center text-sm md:text-base tracking-[0.25em] font-medium uppercase">
          <ShinyText text="EXPLORE OUR LATEST COLLECTION — FRESH STYLES MADE FOR ENDLESS SUMMER DAYS." />
        </h2>
        <span className="h-px w-12 bg-gray-300"></span>
      </div>

      <div
        className="grid gap-8 w-full mx-auto"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}
      >
        {productos.map((producto) => (
          <div
            key={producto._id}
            className="flex flex-col items-center text-center w-full"
          >
            <div className="w-full aspect-[3/4] overflow-hidden">
              <img
                src={producto.colores?.[0]?.imagenes?.[0]}
                alt={producto.nombre}
                loading="eager"
                className="w-full h-auto object-cover mb-6 hover:scale-105 transition-transform duration-300"
              />
            </div>

            <h3 className="text-[12px] font-semibold uppercase text-black tracking-wide mt-3 mb-1">
              {producto.nombre}
            </h3>

            <p className="text-[11px] text-gray-600 mb-3">
              {producto.categoria?.[0] || "New Collection"}
            </p>

            <button
              onClick={() => navigate(`/producto/${producto._id}`)}
              className="relative rounded-full px-6 py-2 border border-gray-900 bg-black text-white overflow-hidden group shadow-md hover:scale-105 transition-transform duration-300"
            >
              <ShinyText
                text="SHOP NOW"
                speed={3}
                className="uppercase text-[11px] tracking-wide font-semibold"
              />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
//
