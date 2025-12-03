import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Panel({ producto }) {
  const [tallaSeleccionada, setTallaSeleccionada] = useState("");
  const [showGuia, setShowGuia] = useState(false);

  useEffect(() => {
    if (producto.tallas && producto.tallas.length > 0) {
      setTallaSeleccionada(producto.tallas[0]);
    }
  }, [producto.tallas]);

  const [openSections, setOpenSections] = useState({
    descripcion: true,
    cuidados: false,
    shipping: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleAgregar = () => {
    if (!tallaSeleccionada) return;

    producto.agregarProducto({
      id: producto.productoId,
      nombre: producto.nombre,
      imagen: producto.imagenPrincipal,
      talla: tallaSeleccionada,
      color: producto.color,
      cantidad: 1,
    });
  };

  const formatoUSD = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <>
      <div className="flex flex-col w-full max-w-[600px]">
        {/* Categoría */}
        {producto.categoria && producto.categoria.length > 0 && (
          <span className="text-[13px] text-gray-500 mb-1 tracking-wide">
            {producto.categoria.join(" / ")}
          </span>
        )}

        {/* Nombre */}
        <h1 className="text-[24px] text-[#4C4845] font-semibold uppercase tracking-wide mb-0">
          {producto.nombre}
        </h1>

        {/* Precio */}
        <div className="mb-4 border-b border-gray-300 pb-4 flex items-center gap-3">
          {producto.descuentoPorcentaje > 0 ? (
            <>
              <span className="font-Quicksand text-[18px] text-[#4C4845]">
                {formatoUSD.format(producto.precioConDescuento)}
              </span>

              <span className="font-Quicksand text-[15px] text-gray-500 line-through">
                {formatoUSD.format(producto.precio)}
              </span>

              <span className="font-Quicksand text-[14px] font-bold text-red-500 bg-red-100 px-2 py-0.5 rounded">
                -{producto.descuentoPorcentaje}%
              </span>
            </>
          ) : (
            <span className="font-Quicksand text-[20px] font-semibold text-black">
              {formatoUSD.format(producto.precio)}
            </span>
          )}
        </div>

        {/* Color */}
        <div className="mb-4 border-b border-gray-300 pb-4">
          <div className="flex items-center">
            <div className="flex flex-col items-start">
              <span className="text-[14px] font-inter font-semibold">Color</span>
              <span className="mt-1 text-[13px] text-black">
                {producto.color?.[0]}
              </span>
            </div>

            <div className="ml-[122px] flex gap-2">
              {producto.coloresDisponibles.map((c, idx) => (
                <button
                  key={idx}
                  onClick={() => producto.setColorSeleccionado(idx)}
                  className={`w-8 h-8 rounded-full border ${
                    idx === producto.colorSeleccionado
                      ? "border-black"
                      : "border-gray-300"
                  }`}
                  style={{ backgroundColor: c.color[1] }}
                  title={c.color[0]}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Size */}
        <div className="mb-1 border-b border-gray-300 pb-6">
          <div className="flex items-start mb-2">
            <div className="flex flex-col items-start">
              <span className="text-[14px] font-inter font-semibold">Size</span>
              <span className="mt-1 text-[14px] font-Quicksand font-normal">
                {tallaSeleccionada}
              </span>
            </div>

            <div className="ml-32 grid grid-cols-8 gap-2">
              {producto.tallas.map((talla) => {
                const disponible =
                  !producto.tallasNoDisponibles?.includes(talla);

                return (
                  <button
                    key={talla}
                    onClick={() => disponible && setTallaSeleccionada(talla)}
                    disabled={!disponible}
                    className={`w-[40px] h-[41px] flex items-center justify-center text-[13px] uppercase transition-all duration-200 border ${
                      talla === tallaSeleccionada
                        ? "border-black font-semibold"
                        : "border-gray-300"
                    } ${
                      !disponible
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:border-black hover:bg-gray-100"
                    }`}
                  >
                    {talla}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="mb-4 border-b border-gray-300 pb-6">
          <div className="mb-4">
            <button
              onClick={() => setShowGuia(true)}
              className="text-[12px] underline text-gray-600 hover:text-black transition"
            >
              Size Guide
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <button
              onClick={handleAgregar}
              className="bg-[#7A7369] text-white text-[13px] uppercase font-inter font-normal tracking-wide px-10 py-4 hover:opacity-90 transition-all duration-300"
            >
              Add to Cart
            </button>

            {/* WhatsApp con icono añadido */}
            <a
              href={`https://api.whatsapp.com/send?phone=19298327601&text=${encodeURIComponent(
                `Hola, estoy interesado(a) en el producto "${producto.nombre}"${
                  tallaSeleccionada ? ` en la talla ${tallaSeleccionada}` : ""
                }. ¿Está disponible?`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 border border-[#25D366] text-[#25D366] text-[13px] uppercase font-inter font-normal tracking-wide px-10 py-4 hover:bg-[#25D366] hover:text-white transition-all duration-300"
            >
              Contact by WhatsApp

              {/* Ícono de WhatsApp */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20.52 3.48A11.8 11.8 0 0 0 12.04 0C5.64 0 .37 5.27.37 11.67c0 2.06.54 4.07 1.57 5.85L0 24l6.67-1.97a11.63 11.63 0 0 0 5.37 1.37h.01c6.4 0 11.67-5.27 11.67-11.67 0-3.12-1.21-6.06-3.34-8.19Zm-8.48 17.7h-.01a9.85 9.85 0 0 1-5.02-1.37l-.36-.21-3.96 1.17 1.17-3.86-.24-.4a9.78 9.78 0 0 1-1.49-5.21c0-5.43 4.43-9.86 9.87-9.86 2.64 0 5.12 1.03 6.99 2.89a9.82 9.82 0 0 1 2.88 6.99c0 5.44-4.43 9.86-9.87 9.86Zm5.48-7.38c-.3-.15-1.77-.87-2.05-.96-.28-.1-.48-.15-.67.15-.2.3-.77.96-.94 1.15-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.23-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.87 1.22 3.07.15.2 2.1 3.2 5.08 4.48.71.31 1.27.5 1.7.64.72.23 1.37.2 1.88.12.57-.08 1.77-.72 2.02-1.41.25-.7.25-1.31.17-1.41-.07-.1-.27-.17-.57-.32Z" />
              </svg>
            </a>
          </div>
        </div>

        {/* ----------------- DESCRIPCIÓN ----------------- */}
        <div className="border-b border-gray-300 pb-2">
          <div
            className="flex justify-between items-center cursor-pointer py-2"
            onClick={() => toggleSection("descripcion")}
          >
            <h2 className="text-[14px] font-semibold uppercase text-black">
              Description
            </h2>
            <span className="text-[18px]">
              {openSections.descripcion ? "−" : "+"}
            </span>
          </div>

          <AnimatePresence>
            {openSections.descripcion && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <p className="text-[14px] text-gray-700 leading-relaxed pb-4">
                  {producto.descripcion}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ----------------- CUIDADOS ----------------- */}
        <div className="border-b border-gray-300 pb-2">
          <div
            className="flex justify-between items-center cursor-pointer py-2"
            onClick={() => toggleSection("cuidados")}
          >
            <span className="text-[13px] font-semibold uppercase text-black">
              Care instructions
            </span>
            <span className="text-[18px]">
              {openSections.cuidados ? "−" : "+"}
            </span>
          </div>

          <AnimatePresence>
            {openSections.cuidados && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="text-[13px] text-gray-700 leading-relaxed pb-4">
                  {producto.cuidados}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ----------------- SHIPPING ----------------- */}
        <div className="border-b border-gray-300 pb-2">
          <div
            className="flex justify-between items-center cursor-pointer py-2"
            onClick={() => toggleSection("shipping")}
          >
            <span className="text-[13px] font-semibold uppercase text-black">
              Shipping & Returns
            </span>
            <span className="text-[18px]">
              {openSections.shipping ? "−" : "+"}
            </span>
          </div>

          <AnimatePresence>
            {openSections.shipping && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="text-[13px] text-gray-700 leading-relaxed pb-4 whitespace-pre-line">
                  <p>Standard shipping: 3 to 7 business days</p>
                  <p>Express shipping: 1 to 3 business days</p>
                  <p>
                    Delivery times are approximate and may vary due to external
                    factors.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ------------------------------------------------------------ */}
      {/* 🔥 MODAL DE GUÍA DE TALLAS */}
      {/* ------------------------------------------------------------ */}
      <AnimatePresence>
        {showGuia && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg p-4 max-w-[90%] max-h-[90%] shadow-xl relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              {/* Cerrar */}
              <button
                onClick={() => setShowGuia(false)}
                className="absolute top-3 right-3 text-lg text-gray-700 hover:text-black"
              >
                ✕
              </button>

              {/* Imagen */}
              <img
                src={producto.guia}
                alt="Size Guide"
                className="max-w-full max-h-[80vh] object-contain mx-auto"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
