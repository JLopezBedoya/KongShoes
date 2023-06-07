const express = require('express');
const userModel = require('../models/user');
const zapatoModel = require("../models/zapatos");
const marcaModel = require('../models/marca')
const router = express.Router();

//crear usuario
router.post('/crear', (req, res)=>{
    const {nombre} = req.body
    userModel.find({nombre: nombre})
    .then((comp)=>{
        if(comp.length == 0){
            const usuario = userModel(req.body)
            usuario.save()
            .then((data)=>res.json(data))
            .catch((err)=> res.json({message: err}))
        }
        else{
            res.send("usuario ya existente")
        }
    })

})
//login
router.post('/login', (req, res)=>{
    const {usercomp, passcomp} = req.body
    userModel.findOne({nombre: usercomp})
    .then((data)=>{
        if(data==null){
            res.send({
                "id": "0",
                "nombre": "usuario",
                "passby": false,
                "razon": "Usuario no encontrado"
              })
        }
        else{
            if(passcomp==data.password){
                res.send({
                    "id": data._id,
                    "nombre": data.nombre,
                    "passby": true
                })
            }else{
                res.send({
                    "id": "0",
                    "nombre": "usuario",
                    "passby": false,
                    "razon": "password incorrecta"
                  })
            }
        }
    })
})
//traer los nombres
router.get('/nombres', (req, res)=>{
    userModel.find()
    .then((data)=>{
        var nombres = data.map((e) => e.nombre);
        res.send(nombres)
    })
})
//Realizar compras
router.post('/comprar', (req, res)=>{
    const { producto, usuario } = req.body
    zapatoModel.findById(producto)
    .then((data)=>{
        userModel.findById(usuario)
        .then((info)=>{
            marcaModel.findOne({nombre: data.Marca})
            .then((m)=>{
                let cant = (data.Cantidad-1)
                let vent = (data.ventas+1)
                zapatoModel.updateOne({_id:producto},{$set:{Cantidad: cant, ventas: vent}})
                .then((d)=>{
                    let anteriores = info.compras
                    anteriores.push({
                        'Fecha': Date.now(),
                        'producto': data.nombre,
                        'precio': data.precio,
                        'marca': data.Marca,
                        'foto': data.foto,
                        'banner': m.banner
                    })
                    userModel.updateOne({_id:usuario},{$set:{compras: anteriores}})
                    .then((a)=>{
                        let v = m.ventas
                        v.push({
                            'Fecha': Date.now(),
                            'producto': data.nombre,
                            'usuario': info.nombre,
                            'foto': data.foto,
                            'precio': data.precio
                        })
                        marcaModel.updateOne({_id: m._id}, {$set:{ventas: v}})
                        .then(c=>{
                            res.send({
                                "zapato": d,
                                "user": a,
                                "marca": c 
                            })
                        })
                    })
                })  
            })
        })
    })
})
//visualizar compras
router.get('/comprados/:id', (req, res)=>{
    const { id } = req.params
    userModel.findById(id)
    .then((data)=>{
        res.send(data.compras)
    })
})
module.exports = router