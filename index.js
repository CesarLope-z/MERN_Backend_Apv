import express from "express";
import dotenv from 'dotenv';
import cors from 'cors'
import conectarDB from './config/db.js'
import veterinarioRoutes from "./routes/veterinarioRoutes.js"
import pacienteRoutes from "./routes/pacienteRoutes.js"
const app = express();
dotenv.config();
conectarDB();

const domPermission = [process.env.FRONTEND_URL]
const corsOptions = {
    origin: function(origin, callback){
        if(domPermission.indexOf(origin) !== -1){
            callback(null, true)
        }else{
            callback(new Error('Acceso denegado por CORS'))
        }
    }
}

app.use(cors(corsOptions))
app.use(express.json())
app.use('/api/veterinarios', veterinarioRoutes)
app.use('/api/pacientes', pacienteRoutes)
const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
    console.log(`Servidor / Backend / ${PORT}`)
})