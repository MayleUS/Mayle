const express = require('express');
const router = express.Router();
const Cupon = require('../modelos/cupon');
const autenticacionOpcional = require('../middlewares/autenticacionOpcional');

// ─────────────────────────────────────────────
// Función de utilidad: ¿el cupón ya venció?
// ─────────────────────────────────────────────
function estaVencido(fechaExpiracion) {
  if (!fechaExpiracion) return false;
  return new Date() > new Date(fechaExpiracion);
}

/* =========================================================
 *                       RUTAS PÚBLICAS
 * ======================================================= */

// Validar cupón antes de aplicarlo
router.post('/validar', autenticacionOpcional, async (req, res) => {
  const { codigo } = req.body;
  const userId = req.usuario?.id;

  try {
    const cupon = await Cupon.findOne({ codigo });

    if (!cupon || !cupon.activo) {
      return res.status(400).json({ error: 'Cupón inválido o inactivo' });
    }
    if (estaVencido(cupon.fecha_expiracion)) {
      return res.status(400).json({ error: 'El cupón ha expirado' });
    }

    // Todos los cupones exigen que el usuario esté logueado
    if (!userId) {
      return res.status(401).json({ error: 'Debes iniciar sesión para usar cualquier cupón' });
    }

    switch (cupon.tipo) {
      case 'una_vez_total':
        if (cupon.usadosPor.length > 0) {
          return res.status(400).json({ error: 'Este cupón ya fue usado' });
        }
        break;

      case 'una_vez_por_usuario':
        if (cupon.usadosPor.includes(userId)) {
          return res.status(400).json({ error: 'Ya usaste este cupón' });
        }
        break;

      case 'cantidad_limitada':
        if (cupon.usos_disponibles <= 0) {
          return res.status(400).json({ error: 'Este cupón se ha agotado' });
        }
        break;

      case 'permanente':
        // Sin reglas extra
        break;

      default:
        return res.status(400).json({ error: 'Tipo de cupón desconocido' });
    }

    res.json({ descuento: cupon.descuento });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Registrar que el cupón fue usado (confirmación de pedido)
router.post('/usar', autenticacionOpcional, async (req, res) => {
  const { codigo } = req.body;
  const userId = req.usuario?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Debes iniciar sesión para usar un cupón' });
  }

  try {
    const cupon = await Cupon.findOne({ codigo });
    if (!cupon || !cupon.activo) {
      return res.status(400).json({ error: 'Cupón inválido' });
    }

    switch (cupon.tipo) {
      case 'una_vez_total':
        if (cupon.usadosPor.length > 0) {
          return res.status(400).json({ error: 'Este cupón ya fue usado' });
        }
        cupon.usadosPor.push(userId);
        cupon.activo = false; // Solo se usa una vez a nivel global
        break;

      case 'una_vez_por_usuario':
        if (!cupon.usadosPor.includes(userId)) {
          cupon.usadosPor.push(userId);
        } else {
          return res.status(400).json({ error: 'Ya usaste este cupón' });
        }
        break;

      case 'cantidad_limitada':
        if (cupon.usos_disponibles <= 0) {
          return res.status(400).json({ error: 'Este cupón se ha agotado' });
        }
        cupon.usos_disponibles -= 1;
        if (!cupon.usadosPor.includes(userId)) {
          cupon.usadosPor.push(userId);
        }
        if (cupon.usos_disponibles === 0) {
          cupon.activo = false; // Sin más usos
        }
        break;

      case 'permanente':
        // Sin manejo especial
        break;

      default:
        return res.status(400).json({ error: 'Tipo de cupón desconocido' });
    }

    await cupon.save();
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al registrar uso del cupón' });
  }
});

/* =========================================================
 *                    RUTAS ADMINISTRADOR
 * ======================================================= */

// Crear un cupón nuevo
router.post('/crear', autenticacionOpcional, async (req, res) => {
  const { codigo, descuento, tipo, fecha_expiracion, usos_disponibles } = req.body;
  const user = req.usuario;

  if (!user || user.rol !== 'ADMIN') {
    return res.status(403).json({ error: 'No autorizado' });
  }

  try {
    if (await Cupon.findOne({ codigo })) {
      return res.status(400).json({ error: 'El cupón ya existe' });
    }

    const nuevoCupon = new Cupon({
      codigo,
      descuento,
      tipo,
      fecha_expiracion: fecha_expiracion ? new Date(fecha_expiracion) : null,
      usos_disponibles: tipo === 'cantidad_limitada' ? usos_disponibles : undefined,
      activo: true
    });

    await nuevoCupon.save();
    res.status(201).json({ ok: true, cupon: nuevoCupon });
  } catch (err) {
    console.error('Error al crear cupón:', err);
    res.status(500).json({ error: 'Error al crear el cupón' });
  }
});

// Editar un cupón existente
router.put('/editar/:id', autenticacionOpcional, async (req, res) => {
  const { id } = req.params;
  const {
    codigo,
    tipo,
    descuento,
    activo,
    usos_disponibles,
    fecha_expiracion
  } = req.body;
  const user = req.usuario;

  if (!user || user.rol !== 'ADMIN') {
    return res.status(403).json({ error: 'No autorizado' });
  }

  try {
    const cupon = await Cupon.findById(id);
    if (!cupon) return res.status(404).json({ error: 'Cupón no encontrado' });

    if (codigo !== undefined) cupon.codigo = codigo.toUpperCase().trim();
    if (tipo !== undefined) cupon.tipo = tipo;
    if (descuento !== undefined) cupon.descuento = descuento;
    if (activo !== undefined) cupon.activo = activo;
    if (usos_disponibles !== undefined) cupon.usos_disponibles = usos_disponibles;
    if (fecha_expiracion !== undefined) {
      cupon.fecha_expiracion = fecha_expiracion ? new Date(fecha_expiracion) : null;
    }

    await cupon.save();
    res.json({ ok: true, cupon });
  } catch (err) {
    console.error('Error al editar cupón:', err);
    res.status(500).json({ error: 'Error al editar el cupón' });
  }
});

// Listar todos los cupones
router.get('/todos', autenticacionOpcional, async (req, res) => {
  const user = req.usuario;
  if (!user || user.rol !== 'ADMIN') {
    return res.status(403).json({ error: 'No autorizado' });
  }

  try {
    const cupones = await Cupon.find().sort({ createdAt: -1 });
    res.json(cupones);
  } catch (err) {
    console.error('Error al obtener cupones:', err);
    res.status(500).json({ error: 'Error al obtener los cupones' });
  }
});

// Eliminar un cupón
router.delete('/eliminar/:id', autenticacionOpcional, async (req, res) => {
  const { id } = req.params;
  const user = req.usuario;

  if (!user || user.rol !== 'ADMIN') {
    return res.status(403).json({ error: 'No autorizado' });
  }

  try {
    const cupon = await Cupon.findByIdAndDelete(id);
    if (!cupon) {
      return res.status(404).json({ error: 'Cupón no encontrado' });
    }

    res.json({ ok: true, mensaje: 'Cupón eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar cupón:', err);
    res.status(500).json({ error: 'Error al eliminar el cupón' });
  }
});

module.exports = router;