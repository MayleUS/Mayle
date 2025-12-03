import { Link } from "react-router-dom";

export default function ProductosRelacionados({ productos }) {
  const productosAleatorios = [...productos]
    .filter((p) => p.colores?.[0]?.imagenes?.[0])
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="w-full bg-[#F9F8F7] py-20 px-6">
      <div className="max-w-[1400px] mx-auto">
        <h2 className="text-[14px] font-inter font-medium uppercase tracking-[1.2px] text-center mb-12">
          RELATED PRODUCTS FOR YOU
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {productosAleatorios.map((p, i) => {
            const primerColor = p.colores?.[0] || {};
            const imagenPrincipal = primerColor.imagenes?.[0] || "";
            const coloresHex = p.colores?.map((c) => c.color?.[1]) || [];

            return (
              <Link
                key={i}
                to={`/producto/${p._id}`}
                onClick={handleClick}
                className="flex flex-col items-center text-center"
              >
                <div className="w-full h-[450px] overflow-hidden mb-4">
                  <img
                    src={imagenPrincipal}
                    alt={p.nombre}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <h3 className="text-[13px] font-inter font-medium uppercase tracking-wide mb-1">
                  {p.nombre}
                </h3>
                <span className="text-[13px] font-inter font-normal text-black">
                  ${p.precio.toFixed(2)}
                </span>
                <span className="text-[12px] font-inter text-red-600 mt-1">
                  {p.descuento}
                </span>

                {/* Bolitas de color */}
                <div className="flex gap-2 mt-3">
                  {coloresHex.map((hex, idx) => (
                    <div
                      key={idx}
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: hex }}
                    ></div>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
