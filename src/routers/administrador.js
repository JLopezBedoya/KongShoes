const express = require('express')
const adminModel = require('../models/administrador')
const zapatosModel = require('../models/zapatos')
const marcaModel = require('../models/marca')
const userModel = require('../models/user');
const router = express.Router()

//Crear al admin
router.post('/crear', (req, res)=>{
    const admin = adminModel(req.body)
    admin.save()
    .then((data)=> res.json(data))
    .catch((err)=>res.json({message: err}))
})

router.post('/login', (req, res)=>{
    adminModel.findById("647e1e70c80fbdc2dc7a2074")
    .then((data)=>{
        const { usuario, password } = data
        const { usercomp, passcomp} = req.body
        if (usuario == usercomp && password == passcomp){
            res.send({
                id: "647e1e70c80fbdc2dc7a2074",
                nombre: "administrador",
                passby: true
            })
        }else{
            res.send({
                id: "0",
                nombre: "usuario",
                passby: false
        })
        }
        
    })
    .catch((err)=>res.json({message: err}))
})

//panel de informacion
router.get('/panel', (req, res)=>{
    zapatosModel.estimatedDocumentCount()
    .then((cantpro)=>{
        zapatosModel.find({},{_id: 1, ventas:1, nombre:1}).sort({ ventas: -1 })
        .then(vent=>{
            var venta = vent.map(e=>e.ventas)
            var ventas = venta.reduce((a, b)=> a+b, 0)
            var zprom = ventas/venta.length
            var zapatosvent = ventas
            marcaModel.find()
            .then(data=>{
                let ventas = data.map(e=>{
                    return{
                        "nombre": e.nombre,
                        "ventas": e.ventas.length
                    }
                })
                const masvendida = ventas.reduce((max, current) => (current.ventas > max.ventas) ? current : max);
                const vendida = {
                    "nombre": masvendida.nombre,
                    "ventas": masvendida.ventas
                }
                userModel.countDocuments()
                .then((usuarios)=>{
                    userModel.find()
                    .then(user=>{
                        let com = user.map(e=>e.compras)
                        let co = com.map(e=>e.length)
                        var buys = co.reduce((a, b)=> a+b, 0)
                        var buyprom = buys/co.length
                        res.send({
                            "totalProductos": cantpro,
                            "totalVentas": zapatosvent,
                            "totalUsuario": usuarios,
                            "promzapatos": zprom,
                            "promusuarios": buyprom,
                            "marcaMasVendida": vendida.nombre,
                            "zapatoMasVendido": vent[0].nombre
                        })
                    })
                })
            })
            
        })
    })
})
module.exports = router