const express = require("express");
const router = express.Router();
const paypal = require("@paypal/checkout-server-sdk");

// MODELOS NECESARIOS
const Carrito = require("../modelos/carrito");
const Pedido = require("../modelos/pedido");
const Producto = require("../modelos/producto");
const autenticacionOpcional = require("../middlewares/autenticacionOpcional");

// ============================================================
// VARIABLE io (será inyectada desde index.js)
// ============================================================
let io;

function setIo(serverIo) {
  io = serverIo;
}

// ============================================================
// CONFIGURACIÓN PAYPAL SDK
// ============================================================
const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, NODE_ENV, FRONTEND_URL } = process.env;

if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
  console.error("❌ Faltan las credenciales de PayPal (Client ID o Secret)");
}

const Environment =
  NODE_ENV === "production"
    ? paypal.core.LiveEnvironment
    : paypal.core.SandboxEnvironment;

const paypalClient = new paypal.core.PayPalHttpClient(
  new Environment(PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET)
);

console.log("✅ PayPal configurado con entorno:", NODE_ENV || "sandbox");

// ============================================================
// 1️⃣ CREAR ORDEN EN PAYPAL
// ============================================================
router.post("/create-order", async (req, res) => {
  try {
    const { total_pedido } = req.body;

    if (!total_pedido || isNaN(total_pedido)) {
      console.warn("⚠️ Monto total inválido:", total_pedido);
      return res.status(400).json({ error: "Monto total inválido" });
    }

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: total_pedido.toFixed(2),
          },
        },
      ],
      application_context: {
        brand_name: "Maylé",
        landing_page: "NO_PREFERENCE",
        user_action: "PAY_NOW",
        return_url: `${FRONTEND_URL}/paypal/success`,
        cancel_url: `${FRONTEND_URL}/paypal/cancel`,
      },
    });

    const order = await paypalClient.execute(request);
    const approvalUrl = order.result.links.find((l) => l.rel === "approve")?.href;

    console.log("✅ Orden PayPal creada:", order.result.id);

    res.json({ approvalUrl, orderID: order.result.id });
  } catch (error) {
    console.error("❌ Error creando orden PayPal:", error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================
// 2️⃣ CAPTURAR ORDEN Y CREAR PEDIDO REAL
// ============================================================
router.post("/capture-order", autenticacionOpcional, async (req, res) => {
  try {
    const { token, session_id } = req.body; // token = orderID de PayPal

    if (!token) {
      console.warn("⚠️ Token (orderID) faltante");
      return res.status(400).json({ error: "Token (orderID) faltante" });
    }

    console.log("💳 Capturando pago PayPal con token:", token);

    // 1. CAPTURAR PAGO EN PAYPAL
    const captureRequest = new paypal.orders.OrdersCaptureRequest(token);
    captureRequest.requestBody({});

    const capture = await paypalClient.execute(captureRequest);

    console.log("📦 Resultado captura PayPal:", capture.result.status);

    if (capture.result.status !== "COMPLETED") {
      console.warn("⚠️ Pago no completado en PayPal");
      return res.status(400).json({
        success: false,
        mensaje: "Pago no completado en PayPal",
      });
    }

    // 2. IDENTIFICAR USUARIO (logueado o invitado)
    const clienteId = req.usuario?.id || null;

    // 3. TRAER CARRITO
    const filtroCarrito = clienteId ? { cliente_id: clienteId } : { session_id };
    const carrito = await Carrito.findOne(filtroCarrito);

    if (!carrito || carrito.productos.length === 0) {
      console.warn("⚠️ Carrito vacío o no encontrado");
      return res.status(400).json({ error: "Carrito vacío o no encontrado" });
    }

    // 4. ARMAR PRODUCTOS DEL PEDIDO
    const productosEnPedido = [];
    let subtotal = 0;

    for (const item of carrito.productos) {
      const productoInfo = await Producto.findById(item.producto_id);
      if (!productoInfo) {
        console.warn("⚠️ Producto no encontrado:", item.producto_id);
        continue;
      }

      productosEnPedido.push({
        producto_id: item.producto_id,
        nombre: productoInfo.nombre,
        color: Array.isArray(item.color) ? item.color : [item.color],
        talla: item.talla,
        imagen: item.imagen,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
        precio_total: item.precio_total,
      });

      subtotal += item.precio_total;
    }

    // 5. DATOS EXTRA QUE MANDA EL FRONTEND
    const {
      first_name,
      last_name,
      correo_cliente,
      celular_cliente,
      pais_envio,
      direccion_envio,
      valor_envio = 0,
      descuento_aplicado = 0,
      suscrito_ofertas = false,
    } = req.body;

    const valor_descuento =
      descuento_aplicado > 0 ? (subtotal * descuento_aplicado) / 100 : 0;

    const total_pedido = subtotal - valor_descuento + valor_envio;

    // 6. CREAR PEDIDO REAL
    const nuevoPedido = new Pedido({
      cliente_id: clienteId || null,
      session_id: clienteId ? null : session_id,
      productos: productosEnPedido,
      subtotal,
      valor_envio,
      total_pedido,
      descuento_aplicado,
      valor_descuento,
      first_name,
      last_name,
      correo_cliente,
      celular_cliente,
      pais_envio,
      direccion_envio,
      suscrito_ofertas,
      fecha_pedido: new Date().toLocaleDateString("es-CO"),
      paypal_order_id: token,
      estado: "Pagado",
    });

    await nuevoPedido.save();
    console.log("✅ Pedido creado en DB:", nuevoPedido._id);

    // 🔔 EMITIR EVENTO DE NUEVO PEDIDO
    try {
      io.emit("pedido_creado", {
        id: nuevoPedido._id,
        cliente: `${nuevoPedido.first_name} ${nuevoPedido.last_name}`,
        total: nuevoPedido.total_pedido,
        fecha: nuevoPedido.fecha_pedido,
        productos: nuevoPedido.productos.length,
      });
      console.log("🔔 Evento pedido_creado emitido via Socket.io");
    } catch (socketError) {
      console.error("❌ Error emitiendo evento Socket.io:", socketError);
    }

    // 7. LIMPIAR CARRITO
    carrito.productos = [];
    await carrito.save();
    console.log("🧹 Carrito limpiado:", carrito._id);

    res.json({
      success: true,
      mensaje: "Pago capturado y pedido creado con éxito",
      pedido: nuevoPedido.toObject(),
    });
  } catch (error) {
    console.error("❌ Error capturando pago o creando pedido:", error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================
// EXPORTAR ROUTER Y setIo
// ============================================================
module.exports.router = router;
module.exports.setIo = setIo;
