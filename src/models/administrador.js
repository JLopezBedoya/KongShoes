const mongoose = require('mongoose');

const administradorSchema = mongoose.Schema({
    "nombre": {
        type: String,
        default: "Administrador"
    },
    "usuario": {
        type: String,
        default: "kongshoesadmin"
    },
    "password": {
        type: String,
        default: "kongadministrador"
    },
    "descripcion": {
        type: String,
        default: "La mejor calidad a precios Kongtasticos, zapatos de todo tipo, mantente a la moda con kongshoes"
    },
    "productos": {
        type: Array,
        default: []
    },
    "ventas": {
        type: Array,
        default: []
    },
    "banner": {
        type: String,
        default: "url del banner"
    }

})
module.exports = mongoose.model('administrador', administradorSchema)