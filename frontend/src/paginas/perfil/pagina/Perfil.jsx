import { useState, useContext, useEffect } from "react";
import BarraLateral from "../componentes/BarraLateral";
import PerfilModulo from "../componentes/PerfilModulo";
import Pedidos from "../componentes/Pedidos";
import Configuracion from "../componentes/Configuracion";
import { ContextoAutenticacion } from "../../../contexto/ContextoAutenticacion";
import axios from "axios";

const Perfil = () => {
  const [seccionActiva, setSeccionActiva] = useState("perfil");
  const [perfil, setPerfil] = useState(null);
  const [cargandoPerfil, setCargandoPerfil] = useState(true);
  const [mensaje, setMensaje] = useState(null);

  const { usuario: usuarioContext } = useContext(ContextoAutenticacion);
  const token = localStorage.getItem("token");

  // 🔥 URL del backend desde .env
  const API = import.meta.env.VITE_BACKEND_URL;

  const obtenerPerfil = async () => {
    if (!usuarioContext?.id || !token) return;

    try {
      setCargandoPerfil(true);
      const res = await axios.get(
        `${API}/usuarios/perfil/${usuarioContext.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPerfil(res.data);
    } catch (error) {
      console.error("❌ Error al cargar perfil:", error);
      setPerfil(null);
    } finally {
      setCargandoPerfil(false);
    }
  };

  useEffect(() => {
    obtenerPerfil();
  }, [usuarioContext, token]);

  const mostrarMensaje = (txt, tipo = "ok") => {
    setMensaje({ txt, tipo });
    setTimeout(() => setMensaje(null), 4000);
  };

  const actualizarBasico = async (data) => {
    try {
      await axios.put(
        `${API}/usuarios/perfil/${usuarioContext.id}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      mostrarMensaje("Datos actualizados correctamente");
      obtenerPerfil();
    } catch (error) {
      mostrarMensaje("Error al actualizar los datos", "error");
    }
  };

  const cambiarCorreo = async (data) => {
    try {
      await axios.put(
        `${API}/usuarios/cambiar-correo/${usuarioContext.id}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      mostrarMensaje("Correo actualizado correctamente");
      obtenerPerfil();
    } catch (error) {
      mostrarMensaje(
        error.response?.data?.mensaje || "Error al actualizar correo",
        "error"
      );
    }
  };

  const cambiarContrasena = async (data) => {
    try {
      await axios.put(
        `${API}/usuarios/cambiar-contrasena/${usuarioContext.id}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      mostrarMensaje("Contraseña actualizada correctamente");
    } catch (error) {
      mostrarMensaje(
        error.response?.data?.mensaje || "Error al actualizar contraseña",
        "error"
      );
    }
  };

  const actualizarDireccion = async (data) => {
    try {
      await axios.put(
        `${API}/usuarios/editar-direccion/${usuarioContext.id}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      mostrarMensaje("Dirección actualizada correctamente");
      obtenerPerfil();
    } catch (error) {
      mostrarMensaje(
        error.response?.data?.mensaje || "Error al actualizar dirección",
        "error"
      );
    }
  };

  const renderContenido = () => {
    if (!perfil) return <p>No se pudo cargar el perfil.</p>;

    if (seccionActiva === "perfil") return <PerfilModulo usuario={perfil} />;

    if (seccionActiva === "pedidos")
      return <Pedidos userId={usuarioContext.id} token={token} />;

    if (seccionActiva === "configuracion") {
      return (
        <Configuracion
          perfil={perfil}
          mensaje={mensaje}
          onActualizarBasico={actualizarBasico}
          onCambiarCorreo={cambiarCorreo}
          onCambiarContrasena={cambiarContrasena}
          onActualizarDireccion={actualizarDireccion}
        />
      );
    }

    return <PerfilModulo usuario={perfil} />;
  };

  return (
    <div className="flex min-h-screen bg-gray-100 lg:pl-64">
      <BarraLateral
        seccionActiva={seccionActiva}
        setSeccionActiva={setSeccionActiva}
      />
      <section className="flex-1 p-8">
        {cargandoPerfil ? <p>Cargando perfil...</p> : renderContenido()}
      </section>
    </div>
  );
};

export default Perfil;
