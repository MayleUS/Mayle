    const mongoose = require('mongoose');

    const CodigoVerificacionSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    documento: { type: Number, required: true, unique: true },
    correo: { type: String, required: true, unique: true },
    contraseña: { type: String, required: true },
    tratamiento_datos: { type: Boolean, required: true },
    boletin: { type: Boolean, default: false },
    codigo: { type: String, required: true },
    expiracion: { type: Date, required: true }
    }, { versionKey: false });

    module.exports = mongoose.model('CodigoVerificacion', CodigoVerificacionSchema, 'verificaciones');