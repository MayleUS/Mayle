import React from "react";
import {
  FaEnvelope,
  FaUser,
  FaIdCard,
  FaPhone,
  FaBirthdayCake,
  FaHome,
  FaUserTag,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { BsPersonCircle } from "react-icons/bs";

const PerfilModulo = ({ usuario }) => {
  if (!usuario) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900"></div>
          <p className="mt-4 text-neutral-600 text-sm font-light">
            Cargando perfil...
          </p>
        </div>
      </div>
    );
  }

  // 🟡 Formateo de fecha ISO → YYYY-MM-DD
  const formatearFecha = (fecha) => {
    if (!fecha) return "No registrada";
    try {
      const d = new Date(fecha);
      if (isNaN(d.getTime())) return fecha; // si viene mala, la devolvemos tal cual
      return d.toISOString().split("T")[0];
    } catch {
      return fecha;
    }
  };

  const usuarioNormalizado = {
    nombre: usuario.nombre || "No registrado",
    correo: usuario.correo || "No registrado",
    documento:
      usuario.documento !== undefined &&
      usuario.documento !== null &&
      usuario.documento !== ""
        ? usuario.documento
        : "No registrado",
    telefono: usuario.telefono || "No registrado",
    fecha_nacimiento: formatearFecha(usuario.fecha_nacimiento),
    direccion: usuario.direccion
      ? [
          usuario.direccion.calle,
          usuario.direccion.ciudad,
          usuario.direccion.departamento,
          usuario.direccion.pais,
          usuario.direccion.codigo_postal,
        ]
          .filter(Boolean)
          .join(", ") || "No registrada"
      : "No registrada",
    rol: usuario.rol || "No registrado",
    activo: usuario.activo ? "Sí" : "No",
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <h1 className="text-4xl sm:text-5xl font-serif text-neutral-900 text-center mb-3 tracking-tight">
            Mi Perfil
          </h1>
          <p className="text-center text-neutral-500 text-sm font-light">
            Información de tu cuenta
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden shadow-sm">
          {/* Avatar y Nombre */}
          <div className="px-6 sm:px-8 py-8 border-b border-neutral-100 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-neutral-100 flex items-center justify-center border border-neutral-200">
                <BsPersonCircle className="text-neutral-400 w-16 h-16" />
              </div>
            </div>
            <h2 className="text-2xl font-serif text-neutral-900 mb-2">
              {usuarioNormalizado.nombre}
            </h2>
            <p className="text-sm text-neutral-500 font-light">
              {usuarioNormalizado.correo}
            </p>
          </div>

          {/* Información Personal */}
          <div className="px-6 sm:px-8 py-6">
            <h3 className="text-xs text-neutral-500 mb-6 uppercase tracking-wider font-medium">
              Información Personal
            </h3>

            <div className="space-y-5">
              {/* Documento */}
              <div className="flex items-start gap-4 pb-5 border-b border-neutral-100">
                <div className="mt-1">
                  <FaIdCard className="text-neutral-400 w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-neutral-500 mb-1 uppercase tracking-wider font-medium">
                    Documento
                  </p>
                  <p className="text-sm text-neutral-900 font-light">
                    {usuarioNormalizado.documento}
                  </p>
                </div>
              </div>

              {/* Teléfono */}
              <div className="flex items-start gap-4 pb-5 border-b border-neutral-100">
                <div className="mt-1">
                  <FaPhone className="text-neutral-400 w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-neutral-500 mb-1 uppercase tracking-wider font-medium">
                    Teléfono
                  </p>
                  <p className="text-sm text-neutral-900 font-light">
                    {usuarioNormalizado.telefono}
                  </p>
                </div>
              </div>

              {/* Fecha de Nacimiento */}
              <div className="flex items-start gap-4 pb-5 border-b border-neutral-100">
                <div className="mt-1">
                  <FaBirthdayCake className="text-neutral-400 w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-neutral-500 mb-1 uppercase tracking-wider font-medium">
                    Fecha de Nacimiento
                  </p>
                  <p className="text-sm text-neutral-900 font-light">
                    {usuarioNormalizado.fecha_nacimiento}
                  </p>
                </div>
              </div>

              {/* Dirección */}
              <div className="flex items-start gap-4 pb-5 border-b border-neutral-100">
                <div className="mt-1">
                  <FaHome className="text-neutral-400 w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-neutral-500 mb-1 uppercase tracking-wider font-medium">
                    Dirección
                  </p>
                  <p className="text-sm text-neutral-900 font-light leading-relaxed">
                    {usuarioNormalizado.direccion}
                  </p>
                </div>
              </div>

              {/* Rol */}
              <div className="flex items-start gap-4 pb-5 border-b border-neutral-100">
                <div className="mt-1">
                  <FaUserTag className="text-neutral-400 w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-neutral-500 mb-1 uppercase tracking-wider font-medium">
                    Rol
                  </p>
                  <p className="text-sm text-neutral-900 font-light">
                    {usuarioNormalizado.rol}
                  </p>
                </div>
              </div>

              {/* Estado */}
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  {usuarioNormalizado.activo === "Sí" ? (
                    <FaCheckCircle className="text-green-600 w-4 h-4" />
                  ) : (
                    <FaTimesCircle className="text-red-600 w-4 h-4" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-xs text-neutral-500 mb-1 uppercase tracking-wider font-medium">
                    Estado de la Cuenta
                  </p>
                  <p
                    className={`text-sm font-light ${
                      usuarioNormalizado.activo === "Sí"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {usuarioNormalizado.activo === "Sí"
                      ? "Activa"
                      : "Inactiva"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilModulo;
