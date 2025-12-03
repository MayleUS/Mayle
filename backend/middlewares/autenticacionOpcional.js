// middlewares/autenticacionOpcional.js
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.header('Authorization');

  if (authHeader && authHeader.startsWith('Bearer')) {
    const token = authHeader.split(' ')[1]?.trim();

    if (token) {
      try {
        const verificarToken = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = verificarToken; // Guardamos el usuario si el token es válido
      } catch (error) {
        console.warn('Token inválido o expirado, continuando como anónimo');
      }
    }
  }

  next(); // Siempre continúa, con o sin token
};
