import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ContextoAutenticacion } from "../../../contexto/ContextoAutenticacion";
import { HiOutlineLogout } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion"; // 👈 importamos Framer Motion

export default function Encabezado({
  usuario = "Administrador",
  titulo = "Panel administrativo",
  subtitulo = "Gestión de productos",
}) {
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { cerrarSesion } = useContext(ContextoAutenticacion);

  const handleLogout = () => {
    cerrarSesion();
    navigate("/login");
  };

  useEffect(() => {
    const handleClickFuera = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMostrarMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickFuera);
    return () => document.removeEventListener("mousedown", handleClickFuera);
  }, []);

  return (
    <header className="relative flex items-center justify-between px-8 py-4 border-b bg-white">
      {/* Logo y título */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-white font-semibold text-lg cursor-pointer select-none">
          M
        </div>
        <div>
          <h1 className="text-lg font-semibold text-gray-800">{titulo}</h1>
          <p className="text-sm text-gray-500">{subtitulo}</p>
        </div>
      </div>

      {/* Usuario + menú */}
      <div ref={menuRef} className="relative flex items-center gap-3">
        <div className="text-sm text-gray-600 text-right">
          <p className="font-medium">{usuario}</p>
          <p className="text-xs text-gray-500">Administrador</p>
        </div>

        <div
          onClick={() => setMostrarMenu((prev) => !prev)}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-200 transition"
        >
          {usuario ? usuario.slice(0, 2).toUpperCase() : "AD"}
        </div>

        {/* Dropdown animado */}
        <AnimatePresence>
          {mostrarMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 20, y: -10 }}
              animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 20, y: -10 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="absolute top-full right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50 origin-top-right"
            >
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <HiOutlineLogout className="text-gray-500 text-lg" />
                <span>Cerrar sesión</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
