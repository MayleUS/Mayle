const express = require('express');
const router = express.Router();
const Usuario = require('../modelos/usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verificarToken = require('../middlewares/autenticacion');
const { enviarCorreoRegistroExitoso } = require('../correos/enviarCorreo');
const asignarCarritoAUsuario = require('../middlewares/asignarCarrito');

// Función auxiliar para esperar middleware async
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      resolve(result);
    });
  });
}

// ========================
// RUTAS
// ========================

// Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (error) {
    console.error("❌ Error al obtener usuarios:", error);
    res.status(500).json({ mensaje: 'Error al obtener los usuarios', error });
  }
});

// Crear un nuevo usuario (SIN verificación)
router.post('/', async (req, res) => {
  try {
    const { nombre, correo, contraseña, documento, tratamiento_datos, boletin } = req.body;

    if (await Usuario.findOne({ correo }))
      return res.status(400).json({ mensaje: 'El correo ya está registrado' });

    if (await Usuario.findOne({ documento }))
      return res.status(400).json({ mensaje: 'El documento ya está registrado' });

    const salt = await bcrypt.genSalt(10);
    const contraseñaEncriptada = await bcrypt.hash(contraseña, salt);

    const nuevoUsuario = new Usuario({
      nombre,
      correo,
      contraseña: contraseñaEncriptada,
      documento,
      tratamiento_datos,
      boletin: boletin || false,
      activo: true, // 🔥 ACTIVADO DE UNA
      codigo_verificacion: null,
      expiracion_codigo: null
    });

    await nuevoUsuario.save();

    // Enviar correo de bienvenida
    try {
      await enviarCorreoRegistroExitoso(correo, nombre);
      console.log(`📧 Correo de bienvenida enviado a ${correo}`);
    } catch (err) {
      console.error(`❌ Error al enviar correo de bienvenida a ${correo}:`, err.message);
    }

    res.json({
      mensaje: 'Usuario registrado exitosamente',
      usuario: {
        id: nuevoUsuario._id,
        correo: nuevoUsuario.correo,
        nombre: nuevoUsuario.nombre,
        rol: nuevoUsuario.rol,
        activo: nuevoUsuario.activo
      }
    });
  } catch (error) {
    console.error("❌ Error al crear usuario:", error);
    res.status(500).json({ mensaje: 'Error al crear el usuario', error });
  }
});

// ---------------------------
// Inicio de sesión
// ---------------------------
router.post('/login', async (req, res) => {
  try {
    const { correo, contraseña, session_id } = req.body;

    const usuario = await Usuario.findOne({ correo });
    if (!usuario)
      return res.status(400).json({ mensaje: 'Correo o contraseña incorrectos' });

    if (!usuario.activo)
      return res.status(400).json({ mensaje: 'Usuario no está activo' });

    const esValido = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!esValido)
      return res.status(400).json({ mensaje: 'Correo o contraseña incorrectos' });

    const token = jwt.sign(
      { id: usuario._id, correo: usuario.correo, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    req.usuario = { _id: usuario._id };
    req.body.session_id = session_id;
    await runMiddleware(req, res, asignarCarritoAUsuario);

    res.json({
      mensaje: 'Inicio de sesión exitoso',
      token,
      usuario: {
        id: usuario._id,
        correo: usuario.correo,
        nombre: usuario.nombre,
        rol: usuario.rol,
        activo: usuario.activo
      }
    });
  } catch (error) {
    console.error("❌ Error en login:", error);
    res.status(500).json({ mensaje: 'Error al iniciar sesión', error });
  }
});

// ---------------------------
// Actualizar un usuario por ID
// ---------------------------
router.put('/perfil/:id', async (req, res) => {
  try {
    const { fecha_nacimiento, telefono, nombre, documento } = req.body;
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      { fecha_nacimiento, telefono, nombre, documento },
      { new: true }
    );
    res.json({ mensaje: 'Perfil actualizado', usuario: usuarioActualizado });
  } catch (error) {
    console.error("❌ Error al actualizar perfil:", error);
    res.status(500).json({ mensaje: 'Error al actualizar el perfil', error });
  }
});

// ---------------------------
// Obtener perfil completo por ID
// ---------------------------
router.get('/perfil/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);

    if (!usuario)
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    res.json({
      nombre: usuario.nombre,
      correo: usuario.correo,
      documento: usuario.documento,
      telefono: usuario.telefono,
      fecha_nacimiento: usuario.fecha_nacimiento,
      direccion: usuario.direccion,
      rol: usuario.rol,
      activo: usuario.activo,
    });
  } catch (error) {
    console.error("❌ Error al obtener perfil completo:", error);
    res.status(500).json({ mensaje: 'Error al obtener perfil', error });
  }
});

// ---------------------------
// Actualizar correo electrónico
// ---------------------------
router.put('/cambiar-correo/:id', verificarToken, async (req, res) => {
  try {
    const { nuevoCorreo, contraseñaActual } = req.body;

    if (req.usuario.id !== req.params.id)
      return res.status(403).json({ mensaje: 'No autorizado' });

    if (await Usuario.findOne({ correo: nuevoCorreo }))
      return res.status(400).json({ mensaje: 'El correo ya está en uso' });

    const usuario = await Usuario.findById(req.params.id);
    if (!usuario)
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    const esValido = await bcrypt.compare(contraseñaActual, usuario.contraseña);
    if (!esValido)
      return res.status(400).json({ mensaje: 'Contraseña actual incorrecta' });

    usuario.correo = nuevoCorreo;
    await usuario.save();

    res.json({ mensaje: 'Correo actualizado correctamente' });
  } catch (error) {
    console.error("❌ Error al cambiar correo:", error);
    res.status(500).json({ mensaje: 'Error al actualizar el correo', error });
  }
});

// ---------------------------
// Actualizar contraseña
// ---------------------------
router.put('/cambiar-contrasena/:id', verificarToken, async (req, res) => {
  try {
    const { contraseñaActual, nuevaContraseña, confirmarNuevaContraseña } = req.body;

    if (req.usuario.id !== req.params.id)
      return res.status(403).json({ mensaje: 'No autorizado' });

    if (nuevaContraseña !== confirmarNuevaContraseña)
      return res.status(400).json({ mensaje: 'Las nuevas contraseñas no coinciden' });

    const usuario = await Usuario.findById(req.params.id);
    if (!usuario)
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    const esValido = await bcrypt.compare(contraseñaActual, usuario.contraseña);
    if (!esValido)
      return res.status(400).json({ mensaje: 'Contraseña actual incorrecta' });

    const salt = await bcrypt.genSalt(10);
    usuario.contraseña = await bcrypt.hash(nuevaContraseña, salt);
    await usuario.save();

    res.json({ mensaje: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error("❌ Error al cambiar contraseña:", error);
    res.status(500).json({ mensaje: 'Error al actualizar la contraseña', error });
  }
});

// ---------------------------
// Actualizar dirección
// ---------------------------
router.put('/editar-direccion/:id', verificarToken, async (req, res) => {
  try {
    if (req.usuario.id !== req.params.id)
      return res.status(403).json({ mensaje: 'No autorizado' });

    const { calle, ciudad, departamento, pais, codigo_postal } = req.body;

    if (!calle || !ciudad || !departamento || !pais || !codigo_postal)
      return res.status(400).json({ mensaje: 'Todos los campos de dirección son obligatorios' });

    const usuario = await Usuario.findById(req.params.id);
    if (!usuario)
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    usuario.direccion = { calle, ciudad, departamento, pais, codigo_postal };
    await usuario.save();

    res.json({ mensaje: 'Dirección actualizada correctamente', direccion: usuario.direccion });
  } catch (error) {
    console.error("❌ Error al actualizar dirección:", error);
    res.status(500).json({ mensaje: 'Error al actualizar la dirección', error });
  }
});

// ---------------------------
// Eliminar cuenta del usuario autenticado
// ---------------------------
router.delete('/perfil', verificarToken, async (req, res) => {
  try {
    await Usuario.findByIdAndDelete(req.usuario.id);
    res.json({ mensaje: 'Cuenta eliminada exitosamente' });
  } catch (error) {
    console.error("❌ Error al eliminar cuenta:", error);
    res.status(500).json({ mensaje: 'Error al eliminar la cuenta', error });
  }
});

module.exports = router;
