import { useEffect } from "react";
import { Link } from "react-router-dom";
import ShinyText from "../../../componentes/ShinyText";

export default function ExploraCatalogo() {
  const imagenes = [
    "https://res.cloudinary.com/dvgpq1ezx/image/upload/v1760048163/CAYENA_1_hfkyif.jpg"
  ];

  // Precargar la imagen al montar el componente
  useEffect(() => {
    imagenes.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  return (
    <section className="w-full bg-[#F9F8F7] py-20 px-6 flex flex-col md:flex-row items-center md:items-stretch">
      {/* Imagen lado izquierdo */}
      <div className="w-full md:w-1/2 flex justify-center">
        <img
          src="https://res.cloudinary.com/dvgpq1ezx/image/upload/f_auto,q_auto/v1760048163/CAYENA_1_hfkyif.jpg"
          alt="Explora catálogo"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Texto lado derecho */}
      <div className="w-full md:w-1/2 flex flex-col justify-center text-center md:text-left px-8">
        <span className="uppercase text-[11px] tracking-widest text-gray-500 mb-4">
          Discover
        </span>
        <h2 className="text-3xl md:text-4xl font-serif uppercase text-black mb-6 leading-snug">
          Explore Our Catalog
        </h2>
        <p className="text-[13px] text-gray-700 mb-8 leading-relaxed">
          Discover the elegance of our exclusive collection. With unique designs
          and refined details, each piece is created to highlight your best
          moments.
        </p>

        {/* Botón con efecto ShinyText */}
        <Link
          to="/catalogo"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <button className="rounded-full px-6 py-2 border border-gray-900 bg-black text-white relative overflow-hidden group">
            <ShinyText
              text="Explore Catalog"
              disabled={false}
              speed={3}
              className="uppercase text-[11px] tracking-wider font-semibold"
            />
          </button>
        </Link>
      </div>
    </section>
  );
}
