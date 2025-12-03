const express = require('express');
const router = express.Router();
const Productos = require('../modelos/productos');
const verificarToken = require('../middlewares/autenticacion');

// Obtener todos los productos o filtrarlos por categoría con ?categoria=...
router.get('/', async (req, res) => {
  try {
    const { categoria } = req.query;

    let filtro = {};
    if (categoria) {
      const categoriaNormalizada = categoria.trim();
      filtro.categoria = { $in: [new RegExp(`^${categoriaNormalizada}$`, 'i')] };
    }

    const productos = await Productos.find(filtro);
    res.json(productos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los productos', error });
  }
});

// --- Obtener productos paginados ---
router.get('/paginados', async (req, res) => {
  try {
    const { categoria, pagina = 1, limite = 6 } = req.query;
    const paginaNum = parseInt(pagina) || 1;
    const limiteNum = parseInt(limite) || 6;

    let filtro = {};
    if (categoria) filtro.categoria = { $in: [new RegExp(`^${categoria.trim()}$`, 'i')] };

    const totalProductos = await Productos.countDocuments(filtro);
    const totalPaginas = Math.ceil(totalProductos / limiteNum);

    const productos = await Productos.find(filtro)
      .sort({ nombre: 1 })
      .skip((paginaNum - 1) * limiteNum)
      .limit(limiteNum)
      .select("nombre precio publicado categoria colores guia"); // solo campos necesarios

    res.json({
      pagina: paginaNum,
      totalPaginas,
      totalProductos,
      productos,
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los productos paginados', error });
  }
});

// ✅ Obtener valores únicos para filtros (colores, tallas, categorías y categorías principales)
router.get('/filtros/opciones', async (req, res) => {
  try {
    const productos = await Productos.find({}, 'categoria categoriaPrincipal colores.color colores.tallas.talla');

    const coloresSet = new Set();
    const tallasSet = new Set();
    const categoriasSet = new Set();
    const categoriasPrincipalesSet = new Set();

    productos.forEach(prod => {
      // Categorías normales
      if (Array.isArray(prod.categoria)) {
        prod.categoria.forEach(cat => categoriasSet.add(cat));
      } else if (prod.categoria) {
        categoriasSet.add(prod.categoria);
      }

      // Categorías principales
      if (Array.isArray(prod.categoriaPrincipal)) {
        prod.categoriaPrincipal.forEach(cp => categoriasPrincipalesSet.add(cp));
      } else if (prod.categoriaPrincipal) {
        categoriasPrincipalesSet.add(prod.categoriaPrincipal);
      }

      // Colores y tallas
      prod.colores?.forEach(colorObj => {
        if (Array.isArray(colorObj.color)) {
          colorObj.color.forEach(c => coloresSet.add(c));
        } else if (colorObj.color) {
          coloresSet.add(colorObj.color);
        }

        colorObj.tallas?.forEach(t => {
          if (t.talla) tallasSet.add(t.talla);
        });
      });
    });

    res.json({
      colores: Array.from(coloresSet).sort(),
      tallas: Array.from(tallasSet).sort(),
      categorias: Array.from(categoriasSet).sort(),
      categoriasPrincipales: Array.from(categoriasPrincipalesSet).sort() // 👈 agregado
    });
  } catch (error) {
    console.error("Error al obtener filtros:", error);
    res.status(500).json({ mensaje: "Error al obtener filtros", error });
  }
});

// Obtener producto por ID
router.get('/:id', async (req, res) => {
  try {
    const producto = await Productos.findById(req.params.id);
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json(producto);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el producto', error });
  }
});

// Crear un nuevo producto (solo ADMIN)
router.post('/', verificarToken, async (req, res) => {
  try {
    if (req.usuario.rol !== 'ADMIN') return res.status(403).json({ mensaje: 'Acceso denegado. Solo administradores.' });

    const { categoria, descripcion, colores, nombre, precio, cuidados, descuentoPorcentaje, guia } = req.body;

    const productoExistente = await Productos.findOne({ nombre });
    if (productoExistente) return res.status(400).json({ mensaje: 'El producto ya existe' });

    const coloresValidados = colores.map(c => ({
      ...c,
      color: Array.isArray(c.color) ? c.color : [c.color]
    }));

    const nuevoProducto = new Productos({
      categoria,
      descripcion,
      colores: coloresValidados,
      nombre,
      precio,
      cuidados,
      descuentoPorcentaje,
      guia
    });

    await nuevoProducto.save();
    res.status(201).json({ mensaje: 'Producto creado exitosamente', producto: nuevoProducto });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear el producto', error });
  }
});

// ✅ Actualizar un producto por ID (solo ADMIN)
router.put('/:id', verificarToken, async (req, res) => {
  try {
    if (req.usuario.rol !== 'ADMIN') return res.status(403).json({ mensaje: 'Acceso denegado. Solo administradores.' });

    const productoActualizado = await Productos.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!productoActualizado) return res.status(404).json({ mensaje: 'Producto no encontrado' });

    res.json({ mensaje: 'Producto actualizado', producto: productoActualizado });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar el producto', error });
  }
});

// Eliminar un producto por ID (solo ADMIN)
router.delete('/eliminar/:id', verificarToken, async (req, res) => {
  try {
    if (req.usuario.rol !== 'ADMIN') return res.status(403).json({ mensaje: 'Acceso denegado. Solo administradores.' });

    const eliminado = await Productos.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ mensaje: 'Producto no encontrado' });

    res.json({ mensaje: 'Producto eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar el producto', error });
  }
});

module.exports = router;
