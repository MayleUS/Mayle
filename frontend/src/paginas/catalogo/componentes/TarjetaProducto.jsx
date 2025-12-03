import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function VerTodosProductos({ productos }) {
  const navigate = useNavigate();

  const formatearPrecio = (valor) =>
    Number(valor).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // 🔹 Pre-cargar imágenes
  useEffect(() => {
    productos.forEach((producto) => {
      const colorPrincipal = producto.colores?.[0] || {};
      const imagenPrincipal = colorPrincipal.imagenes?.[0] || "";
      if (imagenPrincipal) {
        const img = new Image();
        img.src = imagenPrincipal.includes("res.cloudinary.com")
          ? imagenPrincipal.replace("/upload/", "/upload/f_auto,q_auto/")
          : imagenPrincipal;
      }
    });
  }, [productos]);

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <section className="md:col-span-4">
          {productos.length === 0 ? (
            <div className="text-center text-gray-500">
              No hay productos disponibles
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {productos.map((producto) => {
                const colorPrincipal = producto.colores?.[0] || {};
                let imagenPrincipal = colorPrincipal.imagenes?.[0] || "";

                // Optimizar Cloudinary automáticamente
                if (imagenPrincipal.includes("res.cloudinary.com")) {
                  imagenPrincipal = imagenPrincipal.replace("/upload/", "/upload/f_auto,q_auto/");
                }

                const categorias = Array.isArray(producto.categoria)
                  ? producto.categoria.join(" / ")
                  : producto.categoria || "Sin categoría";

                const precioFinal = formatearPrecio(
                  producto.precioConDescuento || producto.precio
                );

                return (
                  <div
                    key={producto._id}
                    className="cursor-pointer transition-all duration-300"
                    onClick={() => navigate(`/producto/${producto._id}`)}
                  >
                    <div className="aspect-[4/6] w-full overflow-hidden relative">
                      {producto.descuentoPorcentaje > 0 && (
                        <span className="absolute top-2 left-2 bg-[#D5C8B5] text-[#35180B] text-[9px] font-inter px-2 py-1 min-w-[52px] min-h-[30px] flex items-center justify-center">
                          SALE
                        </span>
                      )}

                      <img
                        src={imagenPrincipal}
                        alt={producto.nombre}
                        className="w-full h-full object-cover transition-transform duration-300"
                      />
                    </div>

                    <div className="mt-3 px-1 text-center">
                      <p className="text-[11px] font-inter text-[#9A8B85]">
                        {categorias}
                      </p>

                      <h3 className="text-[12px] font-inter font-medium text-[#000000] mt-0.5">
                        {producto.nombre}
                      </h3>

                      <div className="mt-0.5 flex flex-col items-center">
                        <div className="flex items-center gap-2">
                          {producto.descuentoPorcentaje > 0 && (
                            <span className="text-[12px] text-[#948581] line-through">
                              {formatearPrecio(producto.precio)}
                            </span>
                          )}
                          <p className="text-[12px] font-semibold text-[#351A12]">
                            {precioFinal}
                          </p>
                        </div>

                        {producto.descuentoPorcentaje > 0 && (
                          <span className="text-[11px] text-[#C92519] font-medium mt-0.5">
                            With {producto.descuentoPorcentaje}% off
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
