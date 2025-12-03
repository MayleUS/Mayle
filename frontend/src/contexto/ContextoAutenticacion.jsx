// 📁 src/contexto/ContextoAutenticacion.jsx
import { createContext, useState, useEffect } from "react";
import { loginUsuario } from "../servicios/servicioUsuarios";
import API from "../api";

export const ContextoAutenticacion = createContext();

export default function ProveedorAutenticacion({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  // 🔹 Revisar si hay token guardado y cargar datos del usuario
  useEffect(() => {
    const token = localStorage.getItem("token");
    const usuarioGuardado = localStorage.getItem("usuario");

    if (token && usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }

    setCargando(false);
  }, []);

  // 🔹 Iniciar sesión
  const iniciarSesion = async (datos) => {
    const respuesta = await loginUsuario(datos);

    if (respuesta.error) {
      return respuesta;
    }

    const { token, usuario } = respuesta;

    localStorage.setItem("token", token);
    localStorage.setItem("usuario", JSON.stringify(usuario));
    setUsuario(usuario);

    return { exito: true, usuario };
  };

  // 🔹 Cerrar sesión
  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setUsuario(null);
  };

  return (
    <ContextoAutenticacion.Provider
      value={{
        usuario,
        cargando,
        iniciarSesion,
        cerrarSesion,
        estaAutenticado: !!usuario,
      }}
    >
      {children}
    </ContextoAutenticacion.Provider>
  );
}
