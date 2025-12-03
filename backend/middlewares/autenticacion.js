const jwt = require('jsonwebtoken');
const Usuario = require('../modelos/usuario');

module.exports = async function (req, res, next) {
    const tokenHeader = req.header('Authorization');
    if (!tokenHeader) {
        return res.status(401).json({ mensaje: 'Acceso denegado. No hay token' });
    }

    const token = tokenHeader.replace('Bearer ', '');

    try {
        const verificarToken = jwt.verify(token, process.env.JWT_SECRET);

        // buscar el usuario por id
        const usuario = await Usuario.findById(verificarToken.id);
        if (!usuario) {
            return res.status(401).json({ mensaje: 'Usuario no encontrado' });
        }

        req.usuario = usuario; // ✅ guarda el usuario en la request
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ mensaje: 'Token inválido o expirado' });
    }
};
