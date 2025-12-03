const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const CodigoVerificacion = require('../modelos/codigoVerificacion');
const Usuario = require('../modelos/usuario');
const { enviarCodigoVerificacion, enviarCorreoRegistroExitoso } = require('../correos/enviarCorreo');
const asignarCarritoAUsuario = require('../middlewares/asignarCarrito');

//Genera código de 6 dígitos
const generarCodigo = () => Math.floor(100000 + Math.random() * 900000).toString();

//Promisificar middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      resolve(result);
    });
  });
}

//Paso 1: Solicitar código de verificación
router.post('/solicitar', async (req, res) => {
  try {
    const {
      nombre,
      correo,
      contraseña,
      documento,
      tratamiento_datos,
      boletin
    } = req.body;

    const yaRegistrado = await Usuario.findOne({ correo });
    if (yaRegistrado) {
      return res.status(400).json({ mensaje: 'El correo ya está registrado' });
    }

    const codigo = generarCodigo();
    const expiracion = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos
    const contraseñaHasheada = await bcrypt.hash(contraseña, 10);

    await CodigoVerificacion.findOneAndUpdate(
      { correo },
      {
        nombre,
        documento,
        correo,
        contraseña: contraseñaHasheada,
        tratamiento_datos,
        boletin,
        codigo,
        expiracion
      },
      { upsert: true, new: true }
    );

    await enviarCodigoVerificacion(correo, nombre, codigo);

    res.json({ mensaje: 'Código enviado. Revisa tu correo.' });
  } catch (error) {
    console.error('Error solicitando verificación:', error);
    res.status(500).json({ mensaje: 'Error al solicitar verificación' });
  }
});

//Paso 2: Confirmar código y crear usuario
router.post('/confirmar', async (req, res) => {
  try {
    const { correo, codigo, session_id } = req.body;

    const temporal = await CodigoVerificacion.findOne({ correo });
    if (!temporal) return res.status(404).json({ mensaje: 'No hay verificación pendiente para este correo' });

    if (temporal.codigo !== codigo) return res.status(400).json({ mensaje: 'Código incorrecto' });
    if (temporal.expiracion < new Date()) return res.status(400).json({ mensaje: 'Código expirado' });

    const nuevoUsuario = new Usuario({
      nombre: temporal.nombre,
      documento: temporal.documento,
      correo: temporal.correo,
      contraseña: temporal.contraseña,
      tratamiento_datos: temporal.tratamiento_datos,
      boletin: temporal.boletin
    });

    await nuevoUsuario.save();
    await CodigoVerificacion.deleteOne({ correo });

    const token = jwt.sign(
      { id: nuevoUsuario._id, correo: nuevoUsuario.correo, rol: nuevoUsuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    req.usuario = { _id: nuevoUsuario._id };
    req.body.session_id = session_id;
    await runMiddleware(req, res, asignarCarritoAUsuario);

    await enviarCorreoRegistroExitoso(correo, temporal.nombre);

    res.json({ mensaje: 'Usuario verificado y registrado exitosamente', token });
  } catch (error) {
    console.error('Error al confirmar verificación:', error);
    res.status(500).json({ mensaje: 'Error al crear el usuario' });
  }
});

module.exports = router;