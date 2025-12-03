import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registrarUsuario } from "../../../servicios/servicioUsuarios";

// 🔥 Notificaciones profesionales
import { toast } from "sonner";

export default function Register() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [documento, setDocumento] = useState("");
  const [tratamientoDatos, setTratamientoDatos] = useState(false);
  const [boletin, setBoletin] = useState(false);

  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      const res = await registrarUsuario({
        nombre,
        correo,
        contraseña,
        documento: Number(documento),
        tratamiento_datos: tratamientoDatos,
        boletin,
      });

      if (res.mensaje === "Usuario registrado exitosamente") {
        // ✔️ Notificación elegante
        toast.success("Cuenta creada correctamente");

        setTimeout(() => {
          navigate("/login");
        }, 1200);
      } else {
        setError(res.mensaje || "Error al registrarse");

        toast.error(res.mensaje || "Error al registrarse");
      }
    } catch (err) {
      setError("Error al conectar con el servidor");

      toast.error("No se pudo conectar al servidor");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex flex-1 items-center justify-center px-4 py-8">
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
            Create Account
          </h2>
          <p className="text-sm text-gray-500 mb-6 text-center">
            Fill the form to sign up
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
              required
            />

            <input
              type="number"
              placeholder="Document ID"
              value={documento}
              onChange={(e) => setDocumento(e.target.value)}
              className="w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
              required
            />

            <label className="flex items-center space-x-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={tratamientoDatos}
                onChange={(e) => setTratamientoDatos(e.target.checked)}
                required
              />
              <span>I accept data treatment policy</span>
            </label>

            <label className="flex items-center space-x-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={boletin}
                onChange={(e) => setBoletin(e.target.checked)}
              />
              <span>Subscribe to newsletter</span>
            </label>

            {error && (
              <p className="text-red-500 text-xs text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-black text-white py-2.5 rounded-lg text-sm uppercase tracking-wide font-medium hover:bg-gray-800 transition-colors duration-300 disabled:opacity-50"
            >
              {cargando ? "Processing..." : "Sign Up"}
            </button>
          </form>

          <p className="text-sm text-gray-600 text-center mt-6">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-black hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
