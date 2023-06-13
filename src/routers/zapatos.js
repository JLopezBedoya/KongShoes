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
    zapatosModel.find()
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
    zapatosModel.updateOne({ _id: id },{ $set:{nombre, foto, Marca, puntuacion, ventas, precio, Cantidad, Categoria}})
    .then((data)=> res.json(data))
    .catch((err)=> res.json({message: err}))
})
//borrar
router.delete('/borrar/:id', (req, res)=>{
    const {id} = req.params;
    zapatosModel.findById(id)
    .then((e)=>{
        marcaModel.findOne({nombre: e.Marca})
        .then((mr)=>{
            var newp = mr.productos.filter(e=>e!=id)
            marcaModel.updateOne({_id: mr._id}, {$set:{productos: newp}})
            .then(()=>{
                zapatosModel.deleteOne({_id: id})
                .then((data)=> res.json(data))
            }) 
        })
    })
    .catch((err)=> res.json({message: err}))
})
router.get('/datos', (req, res) => {
    const mejoresPromise = zapatosModel.find({ Cantidad: { $ne: 0 } }).sort({ ventas: -1 }).limit(12);
    const ultimosPromise = zapatosModel.find({ Cantidad: { $ne: 0 } }).sort({ _id: -1 }).limit(12);
    const unidadesPromise = zapatosModel.find({ Cantidad: { $ne: 0 } }).sort({ Cantidad: 1 }).limit(12);
    const preciosPromise = zapatosModel.find({ Cantidad: { $ne: 0 } }).sort({ precio: -1 }).limit(12);
    
    Promise.all([mejoresPromise, ultimosPromise, unidadesPromise, preciosPromise])
      .then(([mejores, ultimos, unidades, precios]) => {
        const resultado = {
          mejores,
          ultimos,
          unidades,
          precios
        };
        res.send(resultado);
      })
  });

//nombres y categorias
router.get('/nombres', (req, res)=>{
    zapatosModel.find().sort({precio: 1})
    .then((data)=>{
        var nombres = data.map(({nombre}) => nombre);
        var min = data[0].precio
        var cat = data.map(({Categoria})=> Categoria);
        cat = cat.flat()
        var final = []
        cat.forEach(e=>{
            if(final.includes(e)){

            }else{
                final.push(e)
            }
        })
        zapatosModel.find().sort({precio: -1})
        .then((resp)=>{
            var max = resp[0].precio
            marcaModel.find()
            .then((marca)=>{
                var marcas = marca.map(({nombre})=>nombre)
                res.send({
                    "Nombres": nombres,
                    "categorias": final,
                    "preciomin": min,
                    "preciomax": max,
                    marcas
                })
            })
        }) 
        
    })
})
//filtros
router.post('/filtros', (req, res)=>{
    const {Marca, Categoria, precio, nombre} = req.body
    var filtro = {}
    if(nombre==null){
        if(Marca!=null && Marca!=undefined){
            filtro.Marca = Marca 
        }
        if(Categoria!=null && Categoria!=undefined){
            filtro.Categoria = { $in: Categoria}
        }
        if(!precio!=null && precio!=undefined){
            filtro.precio = { $lte: precio}
        }
    }
    else{
        filtro.nombre = nombre
    }
    zapatosModel.find(filtro)
    .then((data)=>res.send(data))
})
module.exports = router