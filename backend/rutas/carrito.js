const express = require('express');
const router = express.Router();
const Carrito = require('../modelos/carrito');
const Producto = require('../modelos/producto');
const autenticacionOpcional = require('../middlewares/autenticacionOpcional');

// Obtener el carrito
router.get('/', autenticacionOpcional, async (req, res) => {
  const sessionId = req.query.session_id;
  const clienteId = req.usuario?.id;

  try {
    const filtro = clienteId ? { cliente_id: clienteId } : { session_id: sessionId };
    const carrito = await Carrito.findOne(filtro).populate('productos.producto_id');

    if (!carrito) return res.status(200).json({ mensaje: 'Carrito vacío', productos: [] });

    res.json(carrito);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el carrito', error });
  }
});

// Agregar producto al carrito
router.post('/agregar', autenticacionOpcional, async (req, res) => {
  const clienteId = req.usuario?.id;
  const { session_id, producto_id, color, talla, cantidad } = req.body;

  if (!producto_id || !color || !talla || !cantidad || (!clienteId && !session_id)) {
    return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
  }

  try {
    const producto = await Producto.findById(producto_id);
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });

    const descuentoPorcentaje = producto.descuentoPorcentaje || 0;
    const precio_unitario = producto.precio;
    const precio_con_descuento = descuentoPorcentaje > 0 
      ? producto.precio * (1 - descuentoPorcentaje / 100) 
      : null;

    const precio_total = (precio_con_descuento ?? precio_unitario) * cantidad;

    const filtro = clienteId ? { cliente_id: clienteId } : { session_id };
    let carrito = await Carrito.findOne(filtro);

    if (!carrito) {
      const carritoData = { productos: [] };
      if (clienteId) carritoData.cliente_id = clienteId;
      else carritoData.session_id = session_id;

      carrito = new Carrito(carritoData);
    }

    const colorFinal = Array.isArray(color) ? color : [color];

    const colorEncontrado = producto.colores.find(c =>
      Array.isArray(c.color) && JSON.stringify(c.color) === JSON.stringify(colorFinal)
    );

    if (!colorEncontrado) {
      return res.status(400).json({ mensaje: 'Color no encontrado en el producto' });
    }

    const tallaEncontrada = colorEncontrado.tallas.find(t => t.talla === talla);
    if (!tallaEncontrada) {
      return res.status(400).json({ mensaje: 'Talla no encontrada en el color del producto' });
    }

    const imagen = tallaEncontrada.imagen || colorEncontrado.imagenes?.[0] || '';

    const productoExistente = carrito.productos.find(p =>
      p.producto_id.equals(producto_id) &&
      JSON.stringify(p.color) === JSON.stringify(colorFinal) &&
      p.talla === talla
    );

    if (productoExistente) {
      productoExistente.cantidad += cantidad;
      productoExistente.precio_total += precio_total;
      productoExistente.precio_unitario = precio_unitario;
      productoExistente.precio_con_descuento = descuentoPorcentaje > 0 ? precio_con_descuento : null;
      productoExistente.descuentoPorcentaje = descuentoPorcentaje;
      if (!productoExistente.imagen) {
        productoExistente.imagen = imagen;
      }
    } else {
      carrito.productos.push({
        producto_id,
        nombre: producto.nombre,
        color: colorFinal,
        talla,
        cantidad,
        precio_unitario,
        descuentoPorcentaje,
        precio_con_descuento: descuentoPorcentaje > 0 ? precio_con_descuento : null,
        precio_total,
        imagen
      });
    }

    await carrito.save();
    res.json({ mensaje: 'Producto agregado al carrito', carrito });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al agregar producto', error });
  }
});

// Actualizar cantidad
router.put('/actualizar', autenticacionOpcional, async (req, res) => {
  const clienteId = req.usuario?.id;
  const { session_id, producto_id, color, talla, cantidad } = req.body;

  if (!producto_id || !color || !talla || !cantidad || (!clienteId && !session_id)) {
    return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
  }

  try {
    const filtro = clienteId ? { cliente_id: clienteId } : { session_id };
    const carrito = await Carrito.findOne(filtro);
    if (!carrito) return res.status(404).json({ mensaje: 'Carrito no encontrado' });

    const colorFinal = Array.isArray(color) ? color : [color];

    const productoEnCarrito = carrito.productos.find(p =>
      p.producto_id.equals(producto_id) &&
      JSON.stringify(p.color) === JSON.stringify(colorFinal) &&
      p.talla === talla
    );

    if (!productoEnCarrito) {
      return res.status(404).json({ mensaje: 'Producto no encontrado en el carrito' });
    }

    const producto = await Producto.findById(producto_id);
    const descuentoPorcentaje = producto.descuentoPorcentaje || 0;
    const precio_unitario = producto.precio;
    const precio_con_descuento = descuentoPorcentaje > 0 
      ? producto.precio * (1 - descuentoPorcentaje / 100) 
      : null;

    productoEnCarrito.precio_unitario = precio_unitario;
    productoEnCarrito.precio_con_descuento = descuentoPorcentaje > 0 ? precio_con_descuento : 0;
    productoEnCarrito.descuentoPorcentaje = descuentoPorcentaje;
    productoEnCarrito.cantidad = cantidad;
    productoEnCarrito.precio_total = cantidad * (precio_con_descuento ?? precio_unitario);

    await carrito.save();
    res.json({ mensaje: 'Cantidad actualizada', carrito });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar cantidad', error });
  }
});

// Eliminar producto
router.delete('/eliminar', autenticacionOpcional, async (req, res) => {
  const clienteId = req.usuario?.id;
  const { session_id, producto_id, color, talla } = req.body;

  if (!producto_id || !color || !talla || (!clienteId && !session_id)) {
    return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
  }

  try {
    const filtro = clienteId ? { cliente_id: clienteId } : { session_id };
    const carrito = await Carrito.findOne(filtro);
    if (!carrito) return res.status(404).json({ mensaje: 'Carrito no encontrado' });

    const colorFinal = Array.isArray(color) ? color : [color];

    carrito.productos = carrito.productos.filter(p =>
      !(p.producto_id.equals(producto_id) &&
        JSON.stringify(p.color) === JSON.stringify(colorFinal) &&
        p.talla === talla)
    );

    await carrito.save();
    res.json({ mensaje: 'Producto eliminado del carrito', carrito });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar producto', error });
  }
});

// Vaciar carrito
router.delete('/vaciar', autenticacionOpcional, async (req, res) => {
  const clienteId = req.usuario?.id;
  const { session_id } = req.body;

  if (!clienteId && !session_id) {
    return res.status(400).json({ mensaje: 'Falta cliente_id o session_id' });
  }

  try {
    const filtro = clienteId ? { cliente_id: clienteId } : { session_id };
    const carrito = await Carrito.findOne(filtro);
    if (!carrito) return res.status(404).json({ mensaje: 'Carrito no encontrado' });

    carrito.productos = [];
    await carrito.save();

    res.json({ mensaje: 'Carrito vaciado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al vaciar el carrito', error });
  }
});

// Limpiar carritos huérfanos
router.delete('/limpiar-carritos-viejos', async (req, res) => {
  const hace7dias = new Date();
  hace7dias.setDate(hace7dias.getDate() - 7);

  try {
    const resultado = await Carrito.deleteMany({
      cliente_id: { $exists: false },
      createdAt: { $lte: hace7dias }
    });

    res.json({ mensaje: 'Carritos viejos eliminados', eliminados: resultado.deletedCount });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al limpiar carritos viejos', error });
  }
});

module.exports = router;
