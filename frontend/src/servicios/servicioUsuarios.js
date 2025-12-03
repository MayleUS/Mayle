import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL + "/usuarios";

// 🔹 Registrar usuario
export const registrarUsuario = async (datos) => {
  try {
    // Registro solo crea usuario inactivo, no retorna token
    const res = await axios.post(API_URL, datos);
    return res.data;
  } catch (error) {
    if (error.response) {
      return {
        error: true,
        mensaje: error.response.data.mensaje || "Error en el registro",
      };
    }
    return { error: true, mensaje: "Error al conectar con el servidor" };
  }
};

// 🔹 Login usuario
export const loginUsuario = async (datos) => {
  try {
    const res = await axios.post(`${API_URL}/login`, datos);

    // ⚡ Validar si el usuario está activo
    if (!res.data.usuario || !res.data.usuario.activo) {
      return {
        error: true,
        mensaje: "Debes verificar tu correo antes de iniciar sesión",
      };
    }

    return res.data;
  } catch (error) {
    if (error.response) {
      return {
        error: true,
        mensaje: error.response.data.mensaje || "Error en el login",
      };
    }
    return { error: true, mensaje: "Error al conectar con el servidor" };
  }
};

// 🔹 Verificar código de registro
export const verificarCodigo = async ({ correo, codigo }) => {
  try {
    // Al verificar el código, backend activa usuario y retorna token
    const res = await axios.post(`${API_URL}/verificar-codigo`, { correo, codigo });
    return res.data;
  } catch (error) {
    if (error.response) {
      return {
        error: true,
        mensaje: error.response.data.mensaje || "Error al verificar código",
      };
    }
    return { error: true, mensaje: "Error al conectar con el servidor" };
  }
};
