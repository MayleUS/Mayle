//modelo para todos los productos en general
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productosSchema = new Schema({
  nombre: { type: String, required: false },
  categoriaPrincipal: { type: [String], required: false, default: [] },
  categoria: { type: [String], required: false, default: [] },
  descripcion: { type: String, required: false },
  colores: [
    {
      color: [{ type: String, required: false }],
      imagenes: [String],
      tallas: [
        {
          talla: { type: String, required: false },
          stock: { type: Number, required: false },
          imagen: { type: String },
        }
      ]
    }
  ],
  precio: { type: Number, required: false },
  descuentoPorcentaje: { type: Number, required: false, default: 0 }, // descuento opcional
  cuidados: { type: String, required: false, default: '' },
  guia: { type: String, required: false, default: '' },
  publicado: { type: Boolean, default: true },
  galeriaPrincipal: { type: Boolean, default: false }

}, { timestamps: false, versionKey: false });

// Virtual: calcula el precio con descuento
productosSchema.virtual('precioConDescuento').get(function () {
  if (!this.descuentoPorcentaje || this.descuentoPorcentaje <= 0) {
    return this.precio;
  }
  const descuento = this.precio * (this.descuentoPorcentaje / 100);
  return this.precio - descuento;
});

productosSchema.set('toJSON', { virtuals: true });
productosSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Productos', productosSchema);
