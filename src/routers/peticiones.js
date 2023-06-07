const express = require('express')
const peticionesModel = require('../models/peticiones')
const shoesModel = require('../models/zapatos')
const router = express.Router()

//crear 
router.post('/crear', (req, res)=>{
    const peticiones = peticionesModel(req.body)
    peticiones.save()
    .then((data)=> res.json(data))
    .catch((err)=> res.json({message: err}))
})
//traer
router.get('/ver', (req, res)=>{
    peticionesModel.find()
    .then((data)=> res.json(data))
    .catch((err)=> res.json({message: err}))
})
//aceptar peticion
router.get('/aceptar/:id', (req, res)=>{
    const {id} = req.params;
    peticionesModel.findById(id).
    then((data)=>{
            shoesModel.insertMany([data])
    }).then(()=>{
        peticionesModel.deleteOne({_id: id})
        .then((info)=>res.send(info))
    })

})
//negar peticion
router.delete('/borrar/:id', (req, res)=>{
    const {id} = req.params;
    peticionesModel.deleteOne({_id: id})
    .then((data)=> res.json(data))
    .catch((err)=> res.json({message: err}))
})
module.exports = router