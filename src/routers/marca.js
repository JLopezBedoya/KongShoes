const express = require('express')
const marcaModel = require('../models/marca')
const zapatosModel = require('../models/zapatos')
const router = express.Router()

//crear 
router.post('/crear', (req, res)=>{
    const { nombre } = req.body
    marcaModel.find({nombre: nombre})
    .then((info)=>{
        if(info.length == 0){
            const marca = marcaModel(req.body)
            marca.save()
            .then((data)=> res.json(data))
            .catch((err)=> res.json({message: err}))
        }
        else{
            res.send("Ya existe esa marca")
        }
    })
})
//loguear
router.post('/login', (req, res)=>{
    const {usercomp, passcomp} = req.body
    marcaModel.findOne({nombre: usercomp})
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
//llamar por nombre
router.get('/traer/:nombre', async (req, res) => {
    try {
      const { nombre } = req.params;
      const data = await marcaModel.findOne({ nombre: nombre });
      const detalles = [];
  
      for (let e of data.productos) {
        const zap = await zapatosModel.findById(e);
        detalles.push(zap);
      }
  
      res.send({
        datos: data,
        details: detalles
      });
    } catch (err) {
      res.send({ message: err });
    }
  });
//todos los nombres
router.get('/nombres', (req, res)=>{
    marcaModel.find()
    .then((data)=>{
        var nombres = data.map((e) => e.nombre);
        var banner = data.map((e) => e.banner);
        res.send({
            nombres,
            banner
        })
    })
})
module.exports = router