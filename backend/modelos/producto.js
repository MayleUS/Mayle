//Modelo del producto dirigido al carrito
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productoSchema = new Schema({
  nombre: { type: String, required: true },
  categoria: {
    type: [String],
    required: false,
    default: [],
  },
  descripcion: { type: String, required: true },
  colores: [
    {
      color: [{ type: String, required: false }],
      imagenes: [String],
      tallas: [
        {
          talla: { type: String, required: true },
          stock: { type: Number, required: true },
          imagen: { type: String },
        }
      ]
    }
  ],
  precio: { type: Number, required: true },
  descuentoPorcentaje: { type: Number, required: false, default: 0 } // descuento opcional
}, { timestamps: true, versionKey: false });

// Virtual: calcula el precio con descuento
productoSchema.virtual('precioConDescuento').get(function () {
  if (!this.descuentoPorcentaje || this.descuentoPorcentaje <= 0) {
    return this.precio;
  }
  const descuento = this.precio * (this.descuentoPorcentaje / 100);
  return this.precio - descuento;
});

productoSchema.set('toJSON', { virtuals: true });
productoSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Producto', productoSchema);
