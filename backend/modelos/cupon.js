const mongoose = require('mongoose');

const cuponSchema = new mongoose.Schema({
  codigo: {
    type: String,required: true, unique: true, trim: true,uppercase: true
  },

  tipo: {
    type: String, enum: ['una_vez_total', 'una_vez_por_usuario', 'permanente', 'cantidad_limitada'], default: 'una_vez_por_usuario'
  },

  descuento: {
    type: Number, required: true, min: 1,max: 100
  },

  activo: { type: Boolean, default: true
  },

  usos_disponibles: { type: Number, default: null // solo se usa para 'cantidad_limitada'
  },

  fecha_expiracion: { type: Date, default: null
  },

  usadosPor: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Usuario'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Cupon', cuponSchema, 'cupones');