// InventarioDashboard.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TarjetaProductos from "../componentes/TarjetaProductos";
import Filtros from "../componentes/Filtros";
import API from "../../../../api";
import EditarProductoForm from "../../editarproductos/pagina/EditarProducto";
import { toast } from "sonner";

export default function InventarioDashboard() {
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const productosPorPagina = 9;
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  // debounce del buscador
  useEffect(() => {
    const timer = setTimeout(() => {
      setFiltro(textoBusqueda);
      setPaginaActual(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [textoBusqueda]);

  // Obtener productos
  const obtenerProductos = useCallback(async () => {
    try {
      const { data } = await API.get("/productos/paginados", {
        params: { limite: 9999 },
      });
      setProductos(data.productos || []);
    } catch (error) {
      console.error("Error al obtener productos:", error);
      toast.error("Error cargando productos", { duration: 4000 });
      setProductos([]);
    }
  }, []);

  useEffect(() => {
    obtenerProductos();
  }, [obtenerProductos]);

  // Filtrar productos localmente
  const productosFiltrados = useMemo(() => {
    if (!filtro.trim()) return productos;

    const normalizar = (str) =>
      str?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    return productos.filter((p) =>
      normalizar(p.nombre).includes(normalizar(filtro))
    );
  }, [productos, filtro]);

  // Paginación
  const productosPagina = useMemo(() => {
    const inicio = (paginaActual - 1) * productosPorPagina;
    return productosFiltrados.slice(inicio, inicio + productosPorPagina);
  }, [productosFiltrados, paginaActual]);

  useEffect(() => {
    setTotalPaginas(
      Math.max(1, Math.ceil(productosFiltrados.length / productosPorPagina))
    );
  }, [productosFiltrados]);

  // Eliminar producto
  const eliminarProducto = useCallback(
    async (id) => {
      try {
        await API.delete(`/productos/eliminar/${id}`);
        obtenerProductos();
        toast.success("Producto eliminado", { duration: 4000 });
      } catch (error) {
        console.error("Error al eliminar producto:", error);
        toast.error("Error al eliminar producto", { duration: 4000 });
      }
    },
    [obtenerProductos]
  );

  // Cambiar estado publicado (FIX DE try:)
  const togglePublicado = useCallback(
    async (producto) => {
      try {
        const updatedProducto = {
          ...producto,
          publicado: !producto.publicado,
        };

        await API.put(`/productos/${producto._id}`, updatedProducto);

        obtenerProductos();

        toast.success("Estado actualizado", { duration: 3000 });
      } catch (error) {
        console.error("Error al actualizar producto:", error);
        toast.error("Error al actualizar producto", { duration: 3000 });
      }
    },
    [obtenerProductos]
  );

  // Animaciones personalizadas
  const inventarioVariants = {
    initial: { opacity: 0, scale: 0.9, y: 50 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.6, y: 100 },
  };

  const editarVariants = {
    initial: { opacity: 0, scale: 0.6, y: 100 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, y: 50 },
  };

  const cambiarPagina = (nuevaPagina) => {
    setPaginaActual(nuevaPagina);
    setTimeout(() => {
      const contenedorScroll = document.querySelector(
        ".inventario-scroll, .overflow-y-auto, .scrollable"
      );
      if (contenedorScroll)
        contenedorScroll.scrollTo({ top: 0, behavior: "smooth" });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    }, 150);
  };

  return (
    <AnimatePresence mode="wait">
      {!productoSeleccionado ? (
        <motion.div
          key="inventario"
          variants={inventarioVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.45, ease: "easeInOut" }}
          className="space-y-6 inventario-scroll"
        >
          {/* Buscador */}
          <Filtros filtro={textoBusqueda} setFiltro={setTextoBusqueda} />

          {productosPagina.length === 0 ? (
            <div className="text-center text-gray-500 py-20">
              No hay productos que coincidan.
            </div>
          ) : (
            <motion.div
              key={paginaActual + filtro}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {productosPagina.map((producto) => (
                <motion.div
                  key={producto._id}
                  whileHover={{
                    scale: 1.03,
                    y: -5,
                    boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                  }}
                  whileTap={{ scale: 0.96, y: 2 }}
                  transition={{ type: "spring", stiffness: 250, damping: 15 }}
                  className="rounded-xl overflow-hidden bg-white cursor-pointer"
                  onClick={() => setProductoSeleccionado(producto)}
                >
                  <TarjetaProductos
                    producto={producto}
                    togglePublicado={() => togglePublicado(producto)}
                    eliminarProducto={() => eliminarProducto(producto._id)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Paginador */}
          {totalPaginas > 1 && (
            <div className="flex justify-center gap-2 mt-6 flex-wrap">
              <button
                onClick={() =>
                  paginaActual > 1 && cambiarPagina(paginaActual - 1)
                }
                disabled={paginaActual === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                &lt; Prev
              </button>

              {Array.from({ length: totalPaginas }, (_, i) => (
                <button
                  key={i}
                  onClick={() => cambiarPagina(i + 1)}
                  className={`px-3 py-1 border rounded ${
                    paginaActual === i + 1 ? "bg-green-500 text-white" : ""
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() =>
                  paginaActual < totalPaginas &&
                  cambiarPagina(paginaActual + 1)
                }
                disabled={paginaActual === totalPaginas}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next &gt;
              </button>
            </div>
          )}
        </motion.div>
      ) : (
        <motion.div
          key="editar"
          variants={editarVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.45, ease: "easeInOut" }}
        >
          <EditarProductoForm
            producto={productoSeleccionado}
            onCerrar={() => setProductoSeleccionado(null)}
            onGuardar={() => {
              setProductoSeleccionado(null);
              obtenerProductos();
              toast.success("Producto actualizado", { duration: 4000 });
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
