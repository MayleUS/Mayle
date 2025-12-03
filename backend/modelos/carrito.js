const mongoose = require('mongoose');

const productoEnCarritoSchema = new mongoose.Schema({
  producto_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
  nombre: { type: String, required: true },
  color: { type: [String], required: true }, // [nombre, hex]
  talla: { type: String, required: true },
  cantidad: { type: Number, required: true },
  precio_unitario: { type: Number, required: true },
  descuentoPorcentaje: { type: Number, required: false, default: 0 },
  precio_con_descuento: { type: Number, default: 0 },
  precio_total: { type: Number, required: true },
  imagen: { type: String }
}, { _id: true });

const carritoSchema = new mongoose.Schema({
  cliente_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    default: null,
    index: { unique: false, sparse: true }
  },
  session_id: {
    type: String,
    default: null,
    index: true
  },
  referencia_pago: {
    type: String,
    default: null,
    index: true
  },
  payment_link_id: {
    type: String,
    default: null,
    index: true
  },

  productos: [productoEnCarritoSchema]
}, {
  versionKey: false,
  timestamps: true
});

// Validación personalizada: cliente_id XOR session_id
carritoSchema.pre('validate', function (next) {
  const tieneCliente = !!this.cliente_id;
  const tieneSesion = !!this.session_id;

  if (!tieneCliente && !tieneSesion) {
    return next(new Error('El carrito debe tener cliente_id o session_id.'));
  }

  if (tieneCliente && tieneSesion) {
    return next(new Error('El carrito no puede tener ambos: cliente_id y session_id.'));
  }

  next();
});

module.exports = mongoose.model('Carrito', carritoSchema, 'carrito');
//
