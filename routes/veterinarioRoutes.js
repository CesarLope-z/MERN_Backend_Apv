import express from "express";
import { inicioVet, perfilVet, actualizarPassword, confirmar, actualizarPerfil, authenticar, olvidepassword, comprobarToken, nuevoPassword } from "../controller/veterinarioController.js";
import checkAuth from "../middleware/authMiddleware.js";
const router = express.Router();
// area publica
router.post('/', inicioVet);
router.get('/confirmar/:token', confirmar)
router.post('/login', authenticar)
router.post('/olvide-password', olvidepassword)
router.get('/olvide-password/:token', comprobarToken)
router.post('/olvide-password/:token', nuevoPassword)

//499 router.route("/olvide-password/:token").get(comprobarToken).post

//area privada
router.get('/perfil', checkAuth, perfilVet) // cuando se abre esta pagina, busca el auth u luego a perfil vet
router.put('/perfil/:id', checkAuth, actualizarPerfil)

router.put('/actualizar-password', checkAuth, actualizarPassword)

export default router; 