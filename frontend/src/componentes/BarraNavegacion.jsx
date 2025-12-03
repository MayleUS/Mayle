import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { HiOutlineUser } from "react-icons/hi2";
import { FiMenu, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Carrito from "./Carrito";
import { ContextoAutenticacion } from "../contexto/ContextoAutenticacion";

export default function BarraNavegacion() {
  const [productos, setProductos] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState(null);
  const [mostrarMenuUsuario, setMostrarMenuUsuario] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);

  const { cerrarSesion, estaAutenticado, usuario } = useContext(ContextoAutenticacion);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/productos`)
      .then((res) => setProductos(res.data))
      .catch((err) => console.error("Error cargando productos:", err));
  }, []);

  const categorias = productos.reduce((acc, prod) => {
    const principales = prod.categoriaPrincipal || ["Otros"];
    principales.forEach((principal) => {
      if (!acc[principal]) acc[principal] = new Set();
      const subcats = prod.categoria || [];
      subcats.forEach((sub) => acc[principal].add(sub));
    });
    return acc;
  }, {});

  const handleClickCategoria = (categoria) => {
    setCategoriaActiva((prev) => (prev === categoria ? null : categoria));
  };

  const handleCerrarSesion = () => {
    cerrarSesion();
    setMostrarMenuUsuario(false);
    navigate("/login");
  };

  const handleUsuarioClick = () => {
    if (usuario?.rol === "ADMIN") {
      navigate("/admin");
    } else {
      setMostrarMenuUsuario((prev) => !prev);
    }
  };

  return (
    <nav className="bg-white shadow-sm relative z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-16 w-full relative">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="https://res.cloudinary.com/dvgpq1ezx/image/upload/v1757571936/Logo_lb2nfx.png"
            alt="Maylé Logo"
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Menú desktop */}
        <div className="hidden lg:flex flex-1 items-center justify-center">
          <div className="flex items-center gap-10">
            {Object.keys(categorias).map((catPrincipal) => (
              <div key={catPrincipal} className="relative">
                <span
                  onClick={() => handleClickCategoria(catPrincipal)}
                  className={`cursor-pointer text-sm tracking-[0.15em] ${
                    categoriaActiva === catPrincipal
                      ? "text-black"
                      : "text-gray-700"
                  } hover:text-black transition-all duration-200`}
                >
                  {catPrincipal}
                </span>

                {/* Submenú */}
                {categoriaActiva === catPrincipal && (
                  <div className="absolute top-full left-0 bg-white shadow-lg w-72 mt-2 p-4 rounded-lg z-50">
                    <ul className="space-y-2">
                      {[...categorias[catPrincipal]].map((subcat, idx) => (
                        <li key={idx}>
                          <Link
                            to={`/categoria/${encodeURIComponent(subcat)}`}
                            className="block text-sm text-gray-600 hover:text-black transition"
                            onClick={() => setCategoriaActiva(null)}
                          >
                            {subcat}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Carrito + Usuario */}
        <div className="flex items-center gap-6 relative">
          <Carrito />

          {/* Usuario */}
          {estaAutenticado ? (
            <div className="relative">
              <button
                onClick={handleUsuarioClick}
                className="flex items-center text-gray-600 hover:text-black transition-colors"
              >
                <HiOutlineUser size={22} />
              </button>

              {/* Menú desplegable solo para usuarios normales */}
              {usuario?.rol !== "ADMIN" && mostrarMenuUsuario && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-100">
                  <ul className="py-2 text-sm text-gray-700">
                    <li>
                      <Link
                        to="/perfil"
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setMostrarMenuUsuario(false)}
                      >
                        Perfil
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleCerrarSesion}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Cerrar sesión
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center text-gray-600 hover:text-black transition-colors"
            >
              <HiOutlineUser size={22} />
            </Link>
          )}

          {/* Botón hamburguesa - sólo móvil */}
          <button
            className="lg:hidden text-gray-700"
            onClick={() => setMenuAbierto(true)}
          >
            <FiMenu size={24} />
          </button>
        </div>
      </div>

      {/* Overlay y menú lateral móvil */}
      <AnimatePresence>
        {menuAbierto && (
          <>
            {/* Fondo oscuro */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setMenuAbierto(false)}
            />

            {/* Menú lateral */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 90, damping: 20 }}
              className="fixed top-0 right-0 w-72 h-full bg-white shadow-2xl z-50 p-6 flex flex-col"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-lg font-semibold">Categorías</h2>
                <button onClick={() => setMenuAbierto(false)}>
                  <FiX size={24} className="text-gray-700" />
                </button>
              </div>

              <div className="overflow-y-auto flex-1">
                {Object.keys(categorias).map((catPrincipal) => (
                  <div key={catPrincipal} className="mb-4">
                    <button
                      onClick={() => handleClickCategoria(catPrincipal)}
                      className="w-full text-left text-gray-800 font-medium"
                    >
                      {catPrincipal}
                    </button>

                    <AnimatePresence>
                      {categoriaActiva === catPrincipal && (
                        <motion.ul
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="pl-4 mt-2 space-y-1 text-sm"
                        >
                          {[...categorias[catPrincipal]].map((subcat, idx) => (
                            <li key={idx}>
                              <Link
                                to={`/categoria/${encodeURIComponent(subcat)}`}
                                className="block text-gray-600 hover:text-black"
                                onClick={() => {
                                  setCategoriaActiva(null);
                                  setMenuAbierto(false);
                                }}
                              >
                                {subcat}
                              </Link>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
