const Carrito = require('../modelos/carrito');

module.exports = async function asignarCarritoAUsuario(req, res, next) {
    const { session_id } = req.body;
    const usuario = req.usuario; // JWT ya verificado y decodificado por el middleware de autenticación

    if (!session_id || !usuario || !usuario._id) {
        return next();
    }

    try {
        // Buscar carrito anónimo con session_id
        const carritoAnonimo = await Carrito.findOne({ session_id });

        if (carritoAnonimo) {
            // Verificar si el usuario ya tiene un carrito
            const carritoExistente = await Carrito.findOne({ cliente_id: usuario._id });

            if (!carritoExistente) {
                // Limpiar los productos del carrito anónimo
                carritoAnonimo.productos = [];

                // Transferir el carrito anónimo al usuario
                carritoAnonimo.cliente_id = usuario._id;
                carritoAnonimo.session_id = null;
                await carritoAnonimo.save();
                console.log(`Carrito anónimo asignado al usuario ${usuario._id} y limpiado`);
            } else {
                // Eliminar carrito anónimo si ya existe uno del usuario
                await carritoAnonimo.deleteOne();
                console.log(`Carrito anónimo eliminado (el usuario ya tenía uno).`);
            }
        }

        next();
    } catch (error) {
        console.error('Error asignando carrito a usuario:', error.message);
        next(); // no rompemos la app
    }
};