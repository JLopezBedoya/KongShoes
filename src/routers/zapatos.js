const express = require('express')
const zapatosModel = require('../models/zapatos')
const marcaModel = require('../models/marca')
const router = express.Router()

//crear 
router.post('/crear', (req, res)=>{
    const { Marca } = req.body
    const zapatos = zapatosModel(req.body)
    zapatos.save()
    .then((info)=> {
        marcaModel.findOne({nombre: Marca})
        .then((data)=>{
            const { productos } = data
            productos.push(info._id)
            marcaModel.updateOne({_id: data._id}, {$set: {productos: productos}})
            .then((resp)=>res.json(resp))
        })
    })
    .catch((err)=> res.json({message: err}))
})
//traer
router.get('/ver', (req, res)=>{
    zapatosModel.find({ Cantidad: { $ne: 0 } })
    .then((data)=> res.json(data))
    .catch((err)=> res.json({message: err}))
})
//parametros
router.get('/ver/:id', (req, res)=>{
    const {id} = req.params;
    zapatosModel.findById(id)
    .then((data)=> res.json(data))
    .catch((err)=> res.json({message: err}))
})
//actualizar
router.put('/actualizar/:id', (req, res)=>{
    const {id} = req.params;
    const {nombre, Marca, foto, puntuacion, ventas, precio, Cantidad, Categoria} = req.body
    zapatosModel.updateOne({ _id: id },{ $set:{nombre, Marca, puntuacion, ventas, precio, Cantidad, Categoria}})
    .then((data)=> res.json(data))
    .catch((err)=> res.json({message: err}))
})
//borrar
router.delete('/borrar/:id', (req, res)=>{
    const {id} = req.params;
    zapatosModel.deleteOne({_id: id})
    .then((data)=> res.json(data))
    .catch((err)=> res.json({message: err}))
})
router.get('/datos', (req, res) => {
    const mejoresPromise = zapatosModel.find({ Cantidad: { $ne: 0 } }).sort({ puntacion: -1 }).limit(10);
    const ultimosPromise = zapatosModel.find({ Cantidad: { $ne: 0 } }).sort({ _id: -1 }).limit(10);
    const unidadesPromise = zapatosModel.find({ Cantidad: { $ne: 0 } }).sort({ Cantidad: 1 }).limit(10);
    
    Promise.all([mejoresPromise, ultimosPromise, unidadesPromise])
      .then(([mejores, ultimos, unidades]) => {
        const resultado = {
          mejores,
          ultimos,
          unidades
        };
        res.send(resultado);
      })
  });
//nombres y categorias
router.get('/nombres', (req, res)=>{
    zapatosModel.find()
    .then((data)=>{
        var nombres = data.map(({nombre}) => nombre);
        var cat = data.map(({Categoria})=> Categoria)
        cat = cat.flat()
        var final = []
        cat.forEach(e=>{
            if(final.includes(e)){

            }else{
                final.push(e)
            }
        })
        res.send({
            "Nombres": nombres,
            "categorias": final
        })
    })
})
//filtros
router.post('/filtros', (req, res)=>{
    const {Marca, Categoria, precio, puntuacion} = req.body
    var filtro = {}
    if(Marca!=null){
        filtro.Marca = Marca 
    }
    if(Categoria!=null){
        filtro.Categoria = { $in: Categoria}
    }
    if(precio!=null){
        filtro.precio = { $lte: precio}
    }
    if(puntuacion!=null){
        filtro.puntacion = { $gte: puntuacion}
    }
    zapatosModel.find(filtro)
    .then((data)=>res.send(data))
})
module.exports = router