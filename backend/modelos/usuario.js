const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    documento: { type: Number, required: true, unique: true },
    fecha_nacimiento: { type: Date, default: null },
    correo: { type: String, required: true, unique: true },
    contraseña: { type: String, required: true },
    telefono: { type: Number, default: null },
    direccion: {
        calle: { type: String, default: '' },
        ciudad: { type: String, default: '' },
        departamento: { type: String, default: '' },
        pais: { type: String, default: '' },
        codigo_postal: { type: Number, default: null }
    },
    tratamiento_datos: { type: Boolean, required: true },
    boletin: { type: Boolean, default: false },
    rol: {
        type: String,
        enum: ['ADMIN', 'CLIENTE'],
        default: 'CLIENTE'
    },
    // Campos para verificación
    activo: { type: Boolean, default: false },
    codigo_verificacion: { type: Number },
    expiracion_codigo: { type: Date }
}, { versionKey: false });

module.exports = mongoose.model('Usuario', usuarioSchema);
