import { useState, useEffect } from "react";

const Configuracion = ({
  perfil,
  onActualizarBasico,
  onCambiarCorreo,
  onCambiarContrasena,
  onActualizarDireccion,
  mensaje
}) => {
  const [formBasico, setFormBasico] = useState({});
  const [formCorreo, setFormCorreo] = useState({ nuevoCorreo: "", contraseñaActual: "" });
  const [formContrasena, setFormContrasena] = useState({
    contraseñaActual: "",
    nuevaContraseña: "",
    confirmarNuevaContraseña: ""
  });
  const [formDireccion, setFormDireccion] = useState({
    calle: "",
    ciudad: "",
    departamento: "",
    pais: "",
    codigo_postal: ""
  });

  // Función para transformar ISO a YYYY-MM-DD
  const formatearISOaDateInput = (iso) => {
    if (!iso) return "";
    try {
      return iso.split("T")[0];
    } catch {
      return "";
    }
  };

  useEffect(() => {
    if (!perfil) return;

    setFormBasico({
      nombre: perfil.nombre || "",
      documento: perfil.documento || "",
      telefono: perfil.telefono || "",
      fecha_nacimiento: formatearISOaDateInput(perfil.fecha_nacimiento)
    });

    if (perfil.direccion) {
      setFormDireccion({
        calle: perfil.direccion.calle || "",
        ciudad: perfil.direccion.ciudad || "",
        departamento: perfil.direccion.departamento || "",
        pais: perfil.direccion.pais || "",
        codigo_postal: perfil.direccion.codigo_postal || ""
      });
    }
  }, [perfil]);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <h1 className="text-4xl sm:text-5xl font-serif text-neutral-900 text-center mb-3 tracking-tight">
            Configuración
          </h1>
          <p className="text-center text-neutral-500 text-sm font-light">
            Administra tu información personal
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Mensaje de feedback */}
        {mensaje && (
          <div
            className={`rounded-lg border p-4 mb-8 text-center ${
              mensaje.tipo === "error"
                ? "bg-red-50 border-red-200 text-red-700"
                : "bg-green-50 border-green-200 text-green-700"
            }`}
          >
            <p className="text-sm font-light">{mensaje.txt}</p>
          </div>
        )}

        {/* INFORMACIÓN PERSONAL */}
        <div className="bg-white rounded-lg border border-neutral-200 shadow-sm mb-6 overflow-hidden">
          <div className="px-6 sm:px-8 py-6 border-b border-neutral-100">
            <h2 className="text-xl font-serif text-neutral-900 mb-1">
              Información Personal
            </h2>
            <p className="text-xs text-neutral-500 font-light">
              Actualiza tus datos básicos
            </p>
          </div>

          <div className="px-6 sm:px-8 py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs text-neutral-500 mb-2 uppercase tracking-wider font-medium">
                  Nombre completo
                </label>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={formBasico.nombre || ""}
                  onChange={(e) => setFormBasico({ ...formBasico, nombre: e.target.value })}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded text-neutral-900 text-sm focus:outline-none focus:border-neutral-900 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-500 mb-2 uppercase tracking-wider font-medium">
                  Documento
                </label>
                <input
                  type="text"
                  placeholder="Número de documento"
                  value={formBasico.documento || ""}
                  onChange={(e) => setFormBasico({ ...formBasico, documento: e.target.value })}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded text-neutral-900 text-sm focus:outline-none focus:border-neutral-900 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-500 mb-2 uppercase tracking-wider font-medium">
                  Teléfono
                </label>
                <input
                  type="tel"
                  placeholder="Número de contacto"
                  value={formBasico.telefono || ""}
                  onChange={(e) => setFormBasico({ ...formBasico, telefono: e.target.value })}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded text-neutral-900 text-sm focus:outline-none focus:border-neutral-900 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-500 mb-2 uppercase tracking-wider font-medium">
                  Fecha de nacimiento
                </label>
                <input
                  type="date"
                  value={formBasico.fecha_nacimiento || ""}
                  onChange={(e) => setFormBasico({ ...formBasico, fecha_nacimiento: e.target.value })}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded text-neutral-900 text-sm focus:outline-none focus:border-neutral-900 transition-colors"
                />
              </div>
            </div>

            <button
              onClick={() => onActualizarBasico(formBasico)}
              className="mt-6 w-full sm:w-auto px-8 py-3 bg-neutral-900 text-white text-sm font-light rounded hover:bg-neutral-800 transition-colors"
            >
              Guardar cambios
            </button>
          </div>
        </div>

        {/* CAMBIAR CORREO */}
        <div className="bg-white rounded-lg border border-neutral-200 shadow-sm mb-6 overflow-hidden">
          <div className="px-6 sm:px-8 py-6 border-b border-neutral-100">
            <h2 className="text-xl font-serif text-neutral-900 mb-1">
              Cambiar Correo Electrónico
            </h2>
            <p className="text-xs text-neutral-500 font-light">
              Actualiza tu dirección de correo
            </p>
          </div>

          <div className="px-6 sm:px-8 py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs text-neutral-500 mb-2 uppercase tracking-wider font-medium">
                  Nuevo correo
                </label>
                <input
                  type="email"
                  placeholder="nuevo@correo.com"
                  value={formCorreo.nuevoCorreo}
                  onChange={(e) => setFormCorreo({ ...formCorreo, nuevoCorreo: e.target.value })}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded text-neutral-900 text-sm focus:outline-none focus:border-neutral-900 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-500 mb-2 uppercase tracking-wider font-medium">
                  Contraseña actual
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={formCorreo.contraseñaActual}
                  onChange={(e) => setFormCorreo({ ...formCorreo, contraseñaActual: e.target.value })}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded text-neutral-900 text-sm focus:outline-none focus:border-neutral-900 transition-colors"
                />
              </div>
            </div>

            <button
              onClick={() => onCambiarCorreo(formCorreo)}
              className="mt-6 w-full sm:w-auto px-8 py-3 bg-neutral-900 text-white text-sm font-light rounded hover:bg-neutral-800 transition-colors"
            >
              Actualizar correo
            </button>
          </div>
        </div>

        {/* CAMBIAR CONTRASEÑA */}
        <div className="bg-white rounded-lg border border-neutral-200 shadow-sm mb-6 overflow-hidden">
          <div className="px-6 sm:px-8 py-6 border-b border-neutral-100">
            <h2 className="text-xl font-serif text-neutral-900 mb-1">
              Cambiar Contraseña
            </h2>
            <p className="text-xs text-neutral-500 font-light">
              Actualiza tu contraseña de acceso
            </p>
          </div>

          <div className="px-6 sm:px-8 py-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs text-neutral-500 mb-2 uppercase tracking-wider font-medium">
                  Contraseña actual
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={formContrasena.contraseñaActual}
                  onChange={(e) => setFormContrasena({ ...formContrasena, contraseñaActual: e.target.value })}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded text-neutral-900 text-sm focus:outline-none focus:border-neutral-900 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-500 mb-2 uppercase tracking-wider font-medium">
                  Nueva contraseña
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={formContrasena.nuevaContraseña}
                  onChange={(e) => setFormContrasena({ ...formContrasena, nuevaContraseña: e.target.value })}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded text-neutral-900 text-sm focus:outline-none focus:border-neutral-900 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-500 mb-2 uppercase tracking-wider font-medium">
                  Confirmar nueva
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={formContrasena.confirmarNuevaContraseña}
                  onChange={(e) => setFormContrasena({ ...formContrasena, confirmarNuevaContraseña: e.target.value })}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded text-neutral-900 text-sm focus:outline-none focus:border-neutral-900 transition-colors"
                />
              </div>
            </div>

            <button
              onClick={() => onCambiarContrasena(formContrasena)}
              className="mt-6 w-full sm:w-auto px-8 py-3 bg-neutral-900 text-white text-sm font-light rounded hover:bg-neutral-800 transition-colors"
            >
              Cambiar contraseña
            </button>
          </div>
        </div>

        {/* DIRECCIÓN */}
        <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
          <div className="px-6 sm:px-8 py-6 border-b border-neutral-100">
            <h2 className="text-xl font-serif text-neutral-900 mb-1">
              Dirección
            </h2>
            <p className="text-xs text-neutral-500 font-light">
              Actualiza tu dirección de envío
            </p>
          </div>

          <div className="px-6 sm:px-8 py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className="block text-xs text-neutral-500 mb-2 uppercase tracking-wider font-medium">
                  Calle y número
                </label>
                <input
                  type="text"
                  placeholder="Dirección completa"
                  value={formDireccion.calle}
                  onChange={(e) => setFormDireccion({ ...formDireccion, calle: e.target.value })}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded text-neutral-900 text-sm focus:outline-none focus:border-neutral-900 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-500 mb-2 uppercase tracking-wider font-medium">
                  Ciudad
                </label>
                <input
                  type="text"
                  placeholder="Ciudad"
                  value={formDireccion.ciudad}
                  onChange={(e) => setFormDireccion({ ...formDireccion, ciudad: e.target.value })}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded text-neutral-900 text-sm focus:outline-none focus:border-neutral-900 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-500 mb-2 uppercase tracking-wider font-medium">
                  Departamento
                </label>
                <input
                  type="text"
                  placeholder="Departamento/Estado"
                  value={formDireccion.departamento}
                  onChange={(e) => setFormDireccion({ ...formDireccion, departamento: e.target.value })}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded text-neutral-900 text-sm focus:outline-none focus:border-neutral-900 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-500 mb-2 uppercase tracking-wider font-medium">
                  País
                </label>
                <input
                  type="text"
                  placeholder="País"
                  value={formDireccion.pais}
                  onChange={(e) => setFormDireccion({ ...formDireccion, pais: e.target.value })}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded text-neutral-900 text-sm focus:outline-none focus:border-neutral-900 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-500 mb-2 uppercase tracking-wider font-medium">
                  Código postal
                </label>
                <input
                  type="text"
                  placeholder="CP"
                  value={formDireccion.codigo_postal}
                  onChange={(e) => setFormDireccion({ ...formDireccion, codigo_postal: e.target.value })}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded text-neutral-900 text-sm focus:outline-none focus:border-neutral-900 transition-colors"
                />
              </div>
            </div>

            <button
              onClick={() => onActualizarDireccion(formDireccion)}
              className="mt-6 w-full sm:w-auto px-8 py-3 bg-neutral-900 text-white text-sm font-light rounded hover:bg-neutral-800 transition-colors"
            >
              Guardar dirección
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuracion;