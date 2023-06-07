const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');
require('dotenv').config()
const zapatosRouters =  require('./routers/zapatos');
const adminRouters =  require('./routers/administrador');
const userRouters =  require('./routers/user');
const marcaRouters =  require('./routers/marca');
const peticionesRouters = require('./routers/peticiones')
const app = express();
const port = process.env.PORT || 9000

//midleWare
app.use(cors());
app.use(express.json())
app.use('/api/shoes', zapatosRouters)
app.use('/api/admin', adminRouters)
app.use('/api/user', userRouters)
app.use('/api/marca', marcaRouters)
app.use('/api/peticiones', peticionesRouters )
//rutas
app.get('/', (req, res)=>{
    res.send("Bienvenido a mi API, helado?");
})

//mongoose
mongoose.connect(process.env.MONGODB_URI)
.then(()=>console.log("Nos conectamos a mongo papu"))
.catch((err)=>console.log("hubo un error, papu: "+err))

app.listen(port, ()=> {
    console.log('El servidor esta activo en el puerto: '+port)
})