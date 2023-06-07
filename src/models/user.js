const mongoose = require('mongoose');

const userModel = mongoose.Schema({
    "nombre": {
        type: String
    },
    "password": {
        type: String
    },
    "correo": {
        type: String
    },
    "compras": {
        type: Array
    },
})
module.exports = mongoose.model('usuarios',userModel)