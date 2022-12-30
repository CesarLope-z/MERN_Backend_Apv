import jwt from "jsonwebtoken"
import Veterinario from "../models/Veterinaria.js"

const checkAuth = async (req, res, next) => {
    //496
    if(
        req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')
        ){
            try {
                //497 

                const token = req.headers.authorization.split(" ")[1]

                const decoded = jwt.verify(token, process.env.JWT_SECRET)

                req.veterinario = await Veterinario.findById(decoded.id).select(
                    "-password -token -confirmado"
                )
                
                return next()
            } catch (error) {
                const e = new Error('Token no valido')
      
                return res.status(403).json({ msg: e.message })
            }
    }
 
    const error = new Error('Token no valido')
    res.status(403).json({ msg: error.message })

    
    next();

}

export default checkAuth;