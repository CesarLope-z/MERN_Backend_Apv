import Veterinario from "../models/Veterinaria.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";

const inicioVet = async (req, res) => {
    const { email, password, nombre } = req.body;
    const existe = await Veterinario.findOne({email})

    if(existe){
        const e = new Error('Usuario ya registrado')
        return res.status(404).json({ msg: e.message })
    } 

    try {
        // guardar nuevo vet
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save()
        //enviando email

        emailRegistro({
            email,
            nombre,
            token: veterinarioGuardado.token,
            
        })

        res.json(veterinarioGuardado)

    } catch (error) {
        console.log(error)
    }
}

const perfilVet = (req, res) => {

    const { veterinario } = req;

    res.json({ perfil: veterinario })
}

const confirmar = async (req, res) => {
    const {token} = req.params;
    const usuarioConfirmar = await Veterinario.findOne({token})
    if(usuarioConfirmar){
        try {
            usuarioConfirmar.token = null
            usuarioConfirmar.confirmado = true
            await usuarioConfirmar.save()
            
            res.json({msg: 'Usuario confirmado correctamente'})
        } catch (error) {
            console.log(error)
        }    
    }else{
        console.log("error")}
}

const authenticar = async (req, res) => {
    const { email, password } = req.body;

    const usuario = await Veterinario.findOne({email})

    if (!usuario) {
        return res.status(404).json({msg: 'Usuario no existe'})
    }
    
    if(!usuario.confirmado){
        return res.status(404).json({msg: 'Usuario no confirmado'})
    }

    if( await usuario.comprobarPassword(password) ){
        usuario.token = 
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id),
        })
    }else{
        const error = new Error("Password incorrecto")
        return res.status(404).json({msg: error.message})
    }

}

const olvidepassword = async ( req, res ) => {
    const { email } = req.body;

    const existeVeterinario = await Veterinario.findOne({email})

    if(!existeVeterinario){
        const error = new Error('El usuario no existe');
        return res.status(400).json({msg: error.message})
    }

    try {
        existeVeterinario.token = generarId()
        await existeVeterinario.save()
        
        //enviando el email
        emailOlvidePassword({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token,
        })

        res.json({ msg: 'Se ha enviado un e-mail con las instrucciones' })
    
    } catch (error) {
        
    }

}

const comprobarToken = async (req, res) => {
    const { token } = req.params;
    const tokenValido = await Veterinario.findOne({token})

    if (tokenValido) {
        res.json({ msg: "Token valido y el usuario existe" })
    } else {
        const error = new Error('Token no valido')
        return res.status(400).json({ msg: error.message })
    }

}

const nuevoPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const veterinario = await Veterinario.findOne({ token })

    if(!veterinario){
        const error = Error("Hubo un error")
        return res.status(400).json({ msg: error.message })
    }

    try {
        veterinario.token = null
        veterinario.password = password
        await veterinario.save();
        return res.json({ msg: 'Password cambiado'})

    } catch (error) {
        console.log(error)
    }

}

const actualizarPerfil = async (req, res) => {

    const veterinario = await Veterinario.findById(req.params.id)

    if (!veterinario) {
        const error = new Error('Hubo un error');
        return res.status(400).json({ msg: error.message })
    }

    const { email } = req.body;
    if(veterinario.email !== req.body.email){
        const existeEmail = await Veterinario.findOne({email});
        if(existeEmail){
            const error = new Error("Email ya existente, prueba colocando otro email")
            return res.status(400).json({ msg: error.message })
        }
    }

    try {
        
        veterinario.nombre = req.body.nombre || veterinario.nombre;
        veterinario.email = req.body.email || veterinario.email;
        veterinario.web = req.body.web || veterinario.web;
        veterinario.telefono = req.body.telefono || veterinario.telefono;

        const veterinarioActualizado = await veterinario.save();
        res.json(veterinarioActualizado)

    } catch (error) {
        console.log(error)
    }

}

const actualizarPassword = async (req, res) => {
    
    // leer los datos

    const { id } = req.veterinario;
    const { pwd_actual, pwd_nuevo } = req.body;

    // comprobar que el veterinario existe 
    const veterinario = await Veterinario.findById(id)
    if (!veterinario) {
        const error = new Error('Hubo un error');
        return res.status(400).json({ msg: error.message })
    }

    // comprobar password 

    if(await veterinario.comprobarPassword(pwd_actual)){
        // almacenar nuevo password
        veterinario.password = pwd_nuevo;
        await veterinario.save();
        res.json({msg: 'password Correctamente Almacenado'})

    }else{

        const error = new Error('Password incorrecto');
        return res.status(400).json({ msg: error.message })
    
    }





}


export {
    inicioVet,
    perfilVet,
    confirmar,
    authenticar,
    olvidepassword,
    actualizarPassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil
}