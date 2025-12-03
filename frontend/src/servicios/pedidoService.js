import axios from "axios";

// 🔹 Endpoints base
const API_PEDIDOS = `${import.meta.env.VITE_BACKEND_URL}/pedido`;
const API_PAYPAL = `${import.meta.env.VITE_BACKEND_URL}/paypal`;

// ============================================================
// 1️⃣ Crear la orden PayPal (PRE-checkout)
// ============================================================
export const confirmarPedido = async (formData) => {
  try {
    // Generar o recuperar el session_id (para invitados)
    const session_id =
      localStorage.getItem("session_id") || crypto.randomUUID();
    localStorage.setItem("session_id", session_id);

    // 🟢 Crear la orden PayPal desde el backend
    const { data } = await axios.post(`${API_PAYPAL}/create-order`, {
      ...formData,
      session_id,
    });

    return data; // { approvalUrl, orderID }
  } catch (error) {
    console.error(
      "❌ Error creando orden de PayPal:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// ============================================================
// 2️⃣ Confirmar pago exitoso (post-PayPal, crear pedido real)
// ============================================================
export const confirmarPagoExitoso = async (tokenPaypal, pedidoData) => {
  try {
    // Asegurar que el session_id esté incluido
    const session_id =
      pedidoData.session_id || localStorage.getItem("session_id");

    // Obtener el JWT del usuario si existe
    const jwt = localStorage.getItem("token"); // Ajusta al nombre que uses

    const payload = {
      token: tokenPaypal,   // PAYPAL ORDER ID
      session_id,
      ...pedidoData,
    };

    const headers = jwt
      ? { Authorization: `Bearer ${jwt}` }
      : {}; // si no está logueado, no envía headers

    const { data } = await axios.post(
      `${API_PAYPAL}/capture-order`,
      payload,
      { headers }
    );

    return data; // { success, pedido }
  } catch (error) {
    console.error(
      "❌ Error confirmando pago exitoso:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// ============================================================
// 3️⃣ Obtener pedidos solo para usuario autenticado
// ============================================================
export const obtenerMisPedidos = async (token) => {
  try {
    const { data } = await axios.get(`${API_PEDIDOS}/mis-pedidos`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return data;
  } catch (error) {
    console.error(
      "❌ Error obteniendo mis pedidos:",
      error.response?.data || error.message
    );
    throw error;
  }
};
