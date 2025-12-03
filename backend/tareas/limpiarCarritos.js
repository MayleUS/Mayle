// tareas/limpiarCarritos.js
const Carrito = require('../modelos/carrito');

async function limpiarCarritosAntiguos() {
    const hace7Dias = new Date();
    hace7Dias.setDate(hace7Dias.getDate() - 7);

    try {
        const resultado = await Carrito.deleteMany({
            cliente_id: null,
            createdAt: { $lt: hace7Dias }
        });

        if (resultado.deletedCount > 0) {
            console.log(`🧹 Se eliminaron ${resultado.deletedCount} carrito vacio.`);
        }
    } catch (error) {
        console.error('Error al limpiar carritos antiguos:', error.message);
    }
}

module.exports = limpiarCarritosAntiguos;