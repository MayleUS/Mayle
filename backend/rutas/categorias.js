const express = require("express");
const Categoria = require("../modelos/categorias");

const router = express.Router();

// GET /categorias → obtener todas las categorías
router.get("/", async (req, res) => {
  try {
    const categorias = await Categoria.find();
    res.json(categorias);
  } catch (err) {
    console.error("Error al obtener categorías:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;