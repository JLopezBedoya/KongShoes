const mongoose = require('mongoose');

const shoesSchema = mongoose.Schema({
    "nombre": {
        type: String
    },
    "Marca": {
        type: String
    },
    "foto": {
        type: String
    },
    "puntacion": {
        type: Number,
        default: 0
    },
    "ventas": {
        type: Number,
        default: 0
    },
    "fechaAñadida": {
        type: Date,
        default: Date.now()
    },
    "precio":{
        type: Number,
        default: 0
    },
    "Cantidad": {
        type: Number,
        default: 0
    },
    "Categoria": {
        type: Array,
    }
})
module.exports = mongoose.model('shoes', shoesSchema)