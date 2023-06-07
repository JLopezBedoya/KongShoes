const mongoose = require('mongoose');

const marcaSchema = mongoose.Schema({
    "nombre": {
        type: String,
        default: "Administrador"
    },
    "password": {
        type: String,
        default: "kongadministrador"
    },
    "descripcion": {
        type: String,
        default: "zapatos x para una marca y, compralos"
    },
    "correo": {
        type: String,
        default: "@random"

    },
    "banner": {
        type: String,
        default: "url del banner"
    },
    "productos": {
        type: Array,
        default: []
    },
    "ventas": {
        type: Array,
        default: []
    }

})
module.exports = mongoose.model('marca', marcaSchema)