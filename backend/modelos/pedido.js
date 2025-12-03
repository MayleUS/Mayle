const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Subdocumento para los productos dentro del pedido
const productoEnPedidoSchema = new Schema({
  producto_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  nombre: { type: String, required: true },
  color: { type: [String], required: true },
  talla: { type: String, required: true },
  imagen: { type: String, required: true },
  cantidad: { type: Number, required: true },
  precio_unitario: { type: Number, required: true },
  precio_total: { type: Number, required: true }
}, { _id: false });

// Esquema principal del pedido
const pedidoSchema = new Schema({
  // Identificación del cliente
  cliente_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: false },
  session_id: { type: String, required: false }, // Para invitados (sin login)

  // Fecha automática con formato día/mes/año
  fecha_pedido: {
    type: String,
    default: () => {
      const fecha = new Date();
      return `${fecha.getDate().toString().padStart(2, '0')}/${(fecha.getMonth() + 1).toString().padStart(2, '0')}/${fecha.getFullYear()}`;
    }
  },

  // Nombre desglosado (viene del formulario)
  first_name: { type: String, required: false },
  last_name: { type: String, required: false },

  // Datos de contacto (de Contacto.jsx)
  correo_cliente: { type: String, required: false },
  suscrito_ofertas: { type: Boolean, default: false },

  // Datos de envío (de InfoEnvio.jsx)
  pais_envio: { type: String, required: false },
  direccion_envio: { type: String, required: false },
  celular_cliente: { type: String, required: false },

  // Datos del resumen (de ResumenPedido.jsx)
  subtotal: { type: Number, required: true },

  // Descuento aplicado en porcentaje (ej: 25%)
  descuento_aplicado: { type: Number, default: 0 },

  // Valor monetario del descuento (ej: 25000)
  valor_descuento: { type: Number, default: 0 },

  // Costo del envío (si aplica)
  valor_envio: { type: Number, default: 0 },

  // Total final del pedido
  total_pedido: { type: Number, required: true },

  // Lista de productos
  productos: [productoEnPedidoSchema]

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual para mantener compatibilidad con 'nombre_cliente'
pedidoSchema.virtual('nombre_cliente').get(function() {
  const first = this.first_name || '';
  const last = this.last_name || '';
  const full = `${first} ${last}`.trim();
  return full || undefined;
});

module.exports = mongoose.model('Pedido', pedidoSchema, 'pedidos');
