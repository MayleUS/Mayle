const express = require("express");
const router = express.Router();
const Carrito = require("../modelos/carrito");
const Pedido = require("../modelos/pedido");
const Producto = require("../modelos/producto");
const autenticacionOpcional = require("../middlewares/autenticacionOpcional");

// ============================================================
// Confirmar un pedido (funciona para invitados y logueados)
// ============================================================
router.post("/confirmar", autenticacionOpcional, async (req, res) => {
  try {
    const clienteId = req.usuario?.id; // si está logueado
    const { session_id } = req.body; // si es invitado

    if (!clienteId && !session_id) {
      return res.status(400).json({
        mensaje: "Se requiere cliente_id (logueado) o session_id (invitado)",
      });
    }

    // Buscar carrito del usuario logueado o del invitado
    const filtroCarrito = clienteId ? { cliente_id: clienteId } : { session_id };
    const carrito = await Carrito.findOne(filtroCarrito);

    if (!carrito || carrito.productos.length === 0) {
      return res.status(400).json({ mensaje: "Carrito vacío o no encontrado" });
    }

    // Construir los productos dentro del pedido
    const productosEnPedido = [];
    let subtotal = 0;

    for (const item of carrito.productos) {
      const productoInfo = await Producto.findById(item.producto_id);
      if (!productoInfo) continue;

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

    const valor_envio = req.body.valor_envio || 0;
    const descuento_aplicado = req.body.descuento_aplicado || 0;

    // Calcular valor monetario del descuento (ej: 10% de subtotal)
    const valor_descuento = descuento_aplicado > 0
      ? (subtotal * descuento_aplicado) / 100
      : 0;

    // Total del pedido después del descuento
    const total_pedido = subtotal - valor_descuento + valor_envio;

    // Crear el nuevo pedido con toda la info del frontend
    const nuevoPedido = new Pedido({
      cliente_id: clienteId || null,
      session_id: clienteId ? null : session_id,
      productos: productosEnPedido,
      subtotal,
      valor_envio,
      total_pedido,
      descuento_aplicado,
      valor_descuento,

      // Datos personales
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      correo_cliente: req.body.correo_cliente,
      celular_cliente: req.body.celular_cliente,

      // Datos de envío
      pais_envio: req.body.pais_envio,
      direccion_envio: req.body.direccion_envio,

      // Configuración adicional
      suscrito_ofertas: req.body.suscrito_ofertas || false,
      fecha_pedido: new Date().toLocaleDateString("es-CO"),
    });

    await nuevoPedido.save();

    // Vaciar el carrito después de confirmar el pedido
    carrito.productos = [];
    await carrito.save();

    res.status(201).json({
      mensaje: "Pedido confirmado con éxito",
      pedido: nuevoPedido,
    });
  } catch (error) {
    console.error("❌ Error al confirmar el pedido:", error);
    res
      .status(500)
      .json({ mensaje: "Error al confirmar el pedido", error: error.message });
  }
});

// ============================================================
// Obtener pedidos del cliente autenticado
// ============================================================
router.get("/mis-pedidos", autenticacionOpcional, async (req, res) => {
  try {
    const clienteId = req.usuario?.id;

    if (!clienteId) {
      return res.status(401).json({
        mensaje:
          "Solo los usuarios registrados pueden ver su historial de pedidos",
      });
    }

    const pedidos = await Pedido.find({ cliente_id: clienteId }).sort({
      createdAt: -1,
    });

    res.json(pedidos);
  } catch (error) {
    console.error("❌ Error obteniendo pedidos:", error);
    res.status(500).json({ mensaje: "Error al obtener tus pedidos" });
  }
});

// ============================================================
// Obtener todos los pedidos (solo admin)
// ============================================================
router.get("/todos", autenticacionOpcional, async (req, res) => {
  try {
    if (!req.usuario || req.usuario.rol !== "ADMIN") {
      return res
        .status(403)
        .json({ mensaje: "Acceso denegado. Solo para administradores." });
    }

    const pedidos = await Pedido.find().sort({ createdAt: -1 });
    res.json(pedidos);
  } catch (error) {
    console.error("❌ Error obteniendo todos los pedidos:", error);
    res.status(500).json({ mensaje: "Error al obtener los pedidos" });
  }
});

module.exports = router;
