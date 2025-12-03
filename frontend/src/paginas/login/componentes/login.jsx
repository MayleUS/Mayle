import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ContextoAutenticacion } from "../../../contexto/ContextoAutenticacion";

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [sugerencias, setSugerencias] = useState([]);

  const navigate = useNavigate();
  const { iniciarSesion } = useContext(ContextoAutenticacion);

  // 🔹 Cargar correos guardados
  useEffect(() => {
    const correosGuardados = JSON.parse(localStorage.getItem("correosLogin")) || [];
    setSugerencias(correosGuardados);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      const res = await iniciarSesion({ correo, contraseña });

      if (res.error) {
        setError(res.mensaje || "Error al iniciar sesión");
      } else if (res.exito) {
        // 🔹 Guardar correo si no existe
        const correosGuardados = JSON.parse(localStorage.getItem("correosLogin")) || [];
        if (!correosGuardados.includes(correo)) {
          correosGuardados.push(correo);
          localStorage.setItem("correosLogin", JSON.stringify(correosGuardados));
        }

        const usuario = res.usuario || {};

        // 🔹 Redirigir según el rol y recargar la página completa
        if (usuario.rol === "ADMIN") {
          window.location.href = "/admin";
        } else {
          window.location.href = "/";
        }
      } else {
        setError("Error al iniciar sesión");
      }
    } catch (err) {
      console.error("Error en login:", err);
      setError("Error al conectar con el servidor");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
          <div className="flex justify-center mb-6">
            <Link to="/" className="block">
              <img
                src="https://res.cloudinary.com/dvgpq1ezx/image/upload/v1757571936/Logo_lb2nfx.png"
                alt="Logo Maybe"
                className="w-28 h-auto cursor-pointer transition-transform duration-300 hover:scale-105"
              />
            </Link>
          </div>

          <h2 className="text-2xl font-serif text-gray-900 mb-2 text-center">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-500 mb-6 text-center">
            Sign in to continue
          </p>

          <form
            className="space-y-4"
            onSubmit={handleSubmit}
            autoComplete="on"
          >
            <input
              list="correosGuardados"
              type="email"
              name="email"
              placeholder="Email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
              required
            />
            <datalist id="correosGuardados">
              {sugerencias.map((c, i) => (
                <option key={i} value={c} />
              ))}
            </datalist>

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
              required
            />

            {error && (
              <p className="text-red-500 text-xs text-center">{error}</p>
            )}
            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-black text-white py-2.5 rounded-lg text-sm uppercase tracking-wide font-medium hover:bg-gray-800 transition-colors duration-300 disabled:opacity-50"
            >
              {cargando ? "Cargando..." : "Sign In"}
            </button>
          </form>

          <div className="mt-3 text-right">
            <a
              href="#"
              className="text-xs text-gray-500 hover:text-black transition-colors"
            >
              Forgot password?
            </a>
          </div>

          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-2 text-gray-400 text-xs uppercase">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <p className="text-sm text-gray-600 text-center">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-black hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
