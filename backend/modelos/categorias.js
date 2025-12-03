const mongoose = require("mongoose");

const SubcategoriaSchema = new mongoose.Schema({
  nombre: String,
  productos: [String],
});

const CategoriaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  slug: { type: String, required: true },
  subcategorias: [SubcategoriaSchema],
});

module.exports = mongoose.model("Categoria", CategoriaSchema);