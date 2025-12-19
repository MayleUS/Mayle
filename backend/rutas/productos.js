const express = require('express');
const router = express.Router();
const Productos = require('../modelos/productos');
const verificarToken = require('../middlewares/autenticacion');

// ---------------------------------------------
// OBTENER PRODUCTOS (con filtro opcional)
// ---------------------------------------------
router.get('/', async (req, res) => {
  try {
    const { categoria } = req.query;

    let filtro = {};
    if (categoria) {
      filtro.categoria = { $in: [new RegExp(`^${categoria.trim()}$`, 'i')] };
    }

    const productos = await Productos.find(filtro);
    res.json(productos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los productos', error });
  }
});

// ---------------------------------------------
// PRODUCTOS PAGINADOS
// ---------------------------------------------
router.get('/paginados', async (req, res) => {
  try {
    const { categoria, pagina = 1, limite = 6 } = req.query;

    const paginaNum = parseInt(pagina);
    const limiteNum = parseInt(limite);

    let filtro = {};
    if (categoria) {
      filtro.categoria = { $in: [new RegExp(`^${categoria.trim()}$`, 'i')] };
    }

    const totalProductos = await Productos.countDocuments(filtro);
    const totalPaginas = Math.ceil(totalProductos / limiteNum);

    const productos = await Productos.find(filtro)
      .sort({ nombre: 1 })
      .skip((paginaNum - 1) * limiteNum)
      .limit(limiteNum)
      .select("nombre precio publicado categoria categoriaPrincipal colores guia galeriaPrincipal");

    res.json({
      pagina: paginaNum,
      totalPaginas,
      totalProductos,
      productos,
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener productos paginados', error });
  }
});

// ---------------------------------------------
// OPCIONES PARA FILTROS
// ---------------------------------------------
router.get('/filtros/opciones', async (req, res) => {
  try {
    const productos = await Productos.find(
      {},
      'categoria categoriaPrincipal colores.color colores.tallas.talla'
    );

    const coloresSet = new Set();
    const tallasSet = new Set();
    const categoriasSet = new Set();
    const categoriasPrincipalesSet = new Set();

    productos.forEach(prod => {
      prod.categoria?.forEach(c => categoriasSet.add(c));
      prod.categoriaPrincipal?.forEach(cp => categoriasPrincipalesSet.add(cp));

      prod.colores?.forEach(colorObj => {
        colorObj.color?.forEach(c => coloresSet.add(c));
        colorObj.tallas?.forEach(t => t.talla && tallasSet.add(t.talla));
      });
    });

    res.json({
      colores: [...coloresSet].sort(),
      tallas: [...tallasSet].sort(),
      categorias: [...categoriasSet].sort(),
      categoriasPrincipales: [...categoriasPrincipalesSet].sort(),
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener filtros', error });
  }
});

// ---------------------------------------------
// OBTENER PRODUCTO POR ID
// ---------------------------------------------
router.get('/:id', async (req, res) => {
  try {
    const producto = await Productos.findById(req.params.id);
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener producto', error });
  }
});

// ---------------------------------------------
// CREAR PRODUCTO (ADMIN)
// ---------------------------------------------
router.post('/', verificarToken, async (req, res) => {
  try {
    if (req.usuario.rol !== 'ADMIN') {
      return res.status(403).json({ mensaje: 'Acceso denegado' });
    }

    const {
      nombre,
      categoriaPrincipal,
      categoria,
      descripcion,
      colores,
      precio,
      cuidados,
      descuentoPorcentaje,
      guia
    } = req.body;

    const existente = await Productos.findOne({ nombre });
    if (existente) {
      return res.status(400).json({ mensaje: 'El producto ya existe' });
    }

    const categoriaPrincipalLimpia = Array.isArray(categoriaPrincipal)
      ? categoriaPrincipal.filter(Boolean)
      : [];

    const categoriaLimpia = Array.isArray(categoria)
      ? categoria.filter(Boolean)
      : [];

    const coloresValidados = colores.map(c => ({
      ...c,
      color: Array.isArray(c.color) ? c.color : [c.color]
    }));

    const nuevoProducto = new Productos({
      nombre,
      categoriaPrincipal: categoriaPrincipalLimpia,
      categoria: categoriaLimpia,
      descripcion,
      colores: coloresValidados,
      precio,
      cuidados,
      descuentoPorcentaje,
      guia
    });

    await nuevoProducto.save();

    res.status(201).json({
      mensaje: 'Producto creado exitosamente',
      producto: nuevoProducto
    });

  } catch (error) {
    console.error('ERROR CREANDO PRODUCTO:', error);
    res.status(500).json({ mensaje: 'Error al crear producto', error });
  }
});

// ---------------------------------------------
// ACTUALIZAR PRODUCTO (ADMIN)
// ---------------------------------------------
router.put('/:id', verificarToken, async (req, res) => {
  try {
    if (req.usuario.rol !== 'ADMIN') {
      return res.status(403).json({ mensaje: 'Acceso denegado' });
    }

    const actualizado = await Productos.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!actualizado) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    res.json({ mensaje: 'Producto actualizado', producto: actualizado });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar producto', error });
  }
});

// ---------------------------------------------
// ELIMINAR PRODUCTO (ADMIN)
// ---------------------------------------------
router.delete('/eliminar/:id', verificarToken, async (req, res) => {
  try {
    if (req.usuario.rol !== 'ADMIN') {
      return res.status(403).json({ mensaje: 'Acceso denegado' });
    }

    const eliminado = await Productos.findByIdAndDelete(req.params.id);
    if (!eliminado) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    res.json({ mensaje: 'Producto eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar producto', error });
  }
});

// ---------------------------------------------
// TOGGLE GALERÍA PRINCIPAL
// ---------------------------------------------
router.put('/:id/galeria-principal', verificarToken, async (req, res) => {
  try {
    if (req.usuario.rol !== 'ADMIN') {
      return res.status(403).json({ mensaje: 'Acceso denegado' });
    }

    const producto = await Productos.findById(req.params.id);
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    producto.galeriaPrincipal = !producto.galeriaPrincipal;
    await producto.save();

    res.json({
      mensaje: producto.galeriaPrincipal
        ? 'Producto agregado al inicio'
        : 'Producto removido del inicio',
      producto
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error actualizando galería', error });
  }
});

module.exports = router;
